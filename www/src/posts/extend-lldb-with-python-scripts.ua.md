---
title: Відкриваємо папки iOS Simulator прямо з Xcode
date: "2026-01-01"
tags:
  - ios
  - xcode
  - lldb
  - python
  - debugging
  - simulator
description: Додайте власні команди LLDB, які відкривають папки поточного Simulator у Finder — без сторонніх застосунків.
readingTime: "6 min"
---

Під час дебагу iOS-застосунку в Xcode часто потрібно швидко заглянути в контейнер поточного Simulator — `Documents`, `Library`, `tmp` тощо — щоб перевірити/підправити файли. Найбільш дратівлива частина — щоразу вручну шукати правильну папку на диску.

Є чудові сторонні утиліти (RocketSim, SimSim), але якщо тобі хочеться workflow без інсталяцій, виручає LLDB: **LLDB можна розширювати Python-скриптами**, і ти можеш зареєструвати власні команди.

У цьому пості ти додаси дві команди:

- `documents` — відкриває **корінь sandbox** запущеного застосунку (батьківська папка `Documents/`)
- `files` — відкриває папку локального сховища **Files app** у Simulator (“File Provider Storage”)

## Що потрібно створити

Потрібно створити/змінити два файли:

1. `~/.lldbinit` — LLDB завантажує його на старті; тут ми імпортуємо скрипт.
2. `simfolder.py` — Python-скрипт, який додає команди.

> Важливо: застосунок має бути запущений під дебагером, і ти маєш бути “на паузі” (breakpoint/pause), щоб шлях коректно резолвився.

---

## Крок 1 — Створи `simfolder.py`

Поклади файл у стабільне місце, наприклад:

- `~/Developer/lldb/simfolder.py`  
  (Можна будь-де, головне — не переміщати.)

На високому рівні скрипт робить три речі:

1. Запитує в процесу, який дебажиться, шлях до `Documents` (через Objective‑C expression).
2. На основі нього знаходить потрібну папку контейнера.
3. Викликає `open <path>`, щоб відкрити шлях у Finder.

### 1) Дістаємо `Documents` через LLDB expression

Це ключовий трюк: виконуємо Foundation-виклик всередині зупиненого процесу та отримуємо шлях до Documents.

```python
def get_documents_path(debugger, command, result, internal_dict) -> str:
    debugger.HandleCommand("expr @import Foundation")

    documents_path_expression: str = (
        "po (NSString *)[NSSearchPathForDirectoriesInDomains("
        "NSDocumentDirectory, NSUserDomainMask, YES) objectAtIndex:0]"
    )

    documents_path_result = lldb.SBCommandReturnObject()
    debugger.GetCommandInterpreter().HandleCommand(
        documents_path_expression,
        documents_path_result
    )

    raw_output: str = documents_path_result.GetOutput()
    cleaned_path: str = raw_output.strip().strip('"')
    return cleaned_path
```

**Чому це працює:** сам застосунок знає, де знаходиться його sandbox. Ми просто читаємо це значення через LLDB.

### 2) Відкриваємо корінь sandbox (батьківську папку `Documents/`)

Коли вже є щось на кшталт `/.../Containers/Data/Application/<UUID>/Documents`, то один рівень угору — це корінь контейнера (sandbox root).

```python
def open_simulator_folder(debugger, command, result, internal_dict) -> None:
    print("Opening the simulator running app folder...")

    documents_path: str = get_documents_path(debugger, command, result, internal_dict)

    if not documents_path.startswith("/Users/"):
        print(f"Error: The path does not appear to be on the local machine: {documents_path}")
        return

    app_sandbox_folder: str = os.path.dirname(documents_path)

    subprocess.call(["open", app_sandbox_folder])
    print(f"Opened: {app_sandbox_folder}")
```

### 3) (Опційно) Знаходимо локальне сховище Files app

Files app використовує app group контейнер у Simulator. Скрипт робить таке:

- піднімається по дереву директорій, доки не дійде до `Containers`
- шукає в `Containers/Shared/AppGroup/` папки з назвою `File Provider Storage`
- для кожного кандидата читає metadata plist контейнера
- обирає той, де ідентифікатор дорівнює `group.com.apple.FileProvider.LocalStorage`

Ключові константи:

```python
FILES_APP_GROUP_IDENTIFIER: str = "group.com.apple.FileProvider.LocalStorage"
FILE_PROVIDER_STORAGE_DIR: str = "File Provider Storage"
CONTAINER_METADATA_PLIST: str = ".com.apple.mobile_container_manager.metadata.plist"
```

Пошук папок:

```python
def find_file_provider_storage_folders(base_path: str) -> list[str]:
    find_command: str = f'find "{base_path}" -type d -name "{FILE_PROVIDER_STORAGE_DIR}"'
    try:
        find_output: str = subprocess.check_output(
            find_command,
            shell=True,
            stderr=subprocess.DEVNULL
        ).decode("utf-8")
    except subprocess.CalledProcessError:
        return []

    return [folder for folder in find_output.split("\n") if folder.strip()]
```

Читання ідентифікатора контейнера:

```python
def read_container_metadata_identifier(metadata_path: str) -> Optional[str]:
    try:
        plutil_output: str = subprocess.check_output(
            ["plutil", "-p", metadata_path],
            stderr=subprocess.DEVNULL
        ).decode("utf-8")

        match = re.search(
            r'"MCMMetadataIdentifier"\s*=>\s*"([^"]+)"',
            plutil_output
        )
        if match:
            return match.group(1)
    except subprocess.CalledProcessError:
        pass

    return None
```

І команда, яка відкриває Files storage:

```python
def open_simulator_files_app_folder(debugger, command, result, internal_dict) -> None:
    print("Opening the simulator Files app folder...")

    documents_path: str = get_documents_path(debugger, command, result, internal_dict)
    files_app_folder: Optional[str] = get_files_app_folder_from_documents(documents_path)

    if files_app_folder:
        subprocess.call(["open", files_app_folder])
        print(f"Opened: {files_app_folder}")
    else:
        print("Error: Files app folder not found.")
        print("Make sure the simulator has been used with the Files app at least once.")
```

---

## Крок 2 — Зареєструй команди в `__lldb_init_module`

LLDB автоматично викликає `__lldb_init_module`, коли ти імпортуєш скрипт. Саме тут додаються нові команди.

```python
def __lldb_init_module(debugger: lldb.SBDebugger, internal_dict: Dict[str, Any]) -> None:
    debugger.HandleCommand(
        "command script add -f simfolder.open_simulator_folder documents"
    )

    debugger.HandleCommand(
        "command script add -f simfolder.open_simulator_files_app_folder files"
    )

    print('Simulator folder commands loaded:')
    print('  - "documents" : Open the running app\'s sandbox folder')
    print('  - "files"     : Open the Files app storage folder')
```

Дві деталі, які легко пропустити:

- Ім’я модуля в `command script add -f simfolder.<func>` має відповідати назві файла (`simfolder.py` → `simfolder`).
- Функція команди має мати LLDB-підпис: `(debugger, command, result, internal_dict)`.

---

## Крок 3 — Імпортуй скрипт з `~/.lldbinit`

Додай у `~/.lldbinit` рядок:

```python
command script import ~/lldb/simfolder.py
```

Після цього перезапусти Xcode (або хоча б дебаг-сесію), щоб LLDB перечитав конфіг.

---

## Як користуватися в Xcode

1. Запусти застосунок у Simulator з Xcode.
2. Зупинись на breakpoint (або натисни pause).
3. У LLDB консолі виконай:

- `(lldb) documents` — відкриє корінь контейнера застосунку
- `(lldb) files` — відкриє локальне сховище Files app

Готово: без додаткових застосунків і без ручного полювання за UUID.

---

## Troubleshooting

- **`documents` повертає дивний шлях або нічого**  
  Переконайся, що ти зупинений у контексті, де LLDB може виконувати Objective‑C expressions. Також перевір, що застосунок справді запущений під дебагером.

- **`files` каже “folder not found”**  
  Simulator міг ще не ініціалізувати Files storage. Відкрий застосунок **Files** у Simulator хоча б один раз і спробуй ще раз.

- **Після додавання `~/.lldbinit` команди не знаходяться**  
  Перевір, що шлях імпорту абсолютний і вказує на правильний файл. Перезапусти Xcode, щоб LLDB перезавантажився.

---

## Повний скрипт

[simfolder.py](https://raw.githubusercontent.com/Kirow/blog/refs/heads/main/Resources/extend-lldb-with-python-scripts/simfolder.py)
