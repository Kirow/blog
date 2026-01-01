---
title: Open iOS Simulator App Folders from Xcode
date: "2026-01-01"
tags:
  - ios
  - xcode
  - lldb
  - python
  - debugging
  - simulator
description: Add custom LLDB commands that open the running app’s Simulator folders in Finder—no extra apps required.
readingTime: "6 min"
---

When you’re debugging an iOS app in Xcode, you often need to inspect or tweak files inside the current Simulator container (Documents, Library, tmp, etc.). The annoying part is finding the right folder on disk.

There are great third‑party tools (RocketSim, SimSim), but if you want a zero-install workflow, LLDB can help: **LLDB supports Python scripts**, and you can register your own commands.

In this post you’ll add two commands:

- `documents` — opens the running app’s **sandbox root** (parent of `Documents/`)
- `files` — opens the Simulator’s **Files app** local storage folder (“File Provider Storage”)

## What you’ll create

You’ll add/modify two files:

1. `~/.lldbinit` — loaded by LLDB on startup; we’ll use it to import our script.
2. `simfolder.py` — the Python script that registers the commands.

> Note: The app must be running under the debugger for the script to resolve paths.

---

## Step 1 — Create `simfolder.py`

Put the script somewhere stable, e.g.:

- `~/Developer/lldb/simfolder.py`  
  (Any path is fine as long as it doesn’t move.)

At a high level the script does three things:

1. Ask the debugged process for its `Documents` path (via an Objective‑C expression).
2. From there, resolve the container/sandbox folder.
3. Run `open <path>` to show it in Finder.

### 1) LLDB expression: get the app’s Documents directory

This is the core trick: evaluate a Foundation call inside the paused process to get the Documents path.

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

**Why this works:** the app itself knows where its sandbox is. We just query it.

### 2) Open the sandbox root (parent of `Documents/`)

Now that you have `/.../Containers/Data/Application/<UUID>/Documents`, going one level up gives the sandbox root.

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

### 3) (Optional) Locate the Files app local storage directory

The Files app uses an app group container in the Simulator. This script:

- climbs up until it reaches the `Containers` directory
- searches `Containers/Shared/AppGroup/` for directories named `File Provider Storage`
- reads each candidate container’s metadata plist
- picks the one whose identifier matches `group.com.apple.FileProvider.LocalStorage`

Key pieces:

```python
FILES_APP_GROUP_IDENTIFIER: str = "group.com.apple.FileProvider.LocalStorage"
FILE_PROVIDER_STORAGE_DIR: str = "File Provider Storage"
CONTAINER_METADATA_PLIST: str = ".com.apple.mobile_container_manager.metadata.plist"
```

Find folders:

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

Read the container identifier:

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

And the command itself:

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

## Step 2 — Register commands in `__lldb_init_module`

LLDB calls `__lldb_init_module` automatically when you import the script. This is where you add your new commands.

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

Two important details:

- The module name in `command script add -f simfolder.<func>` must match the filename (`simfolder.py` → `simfolder`).
- The function you register must follow LLDB’s command signature: `(debugger, command, result, internal_dict)`.

---

## Step 3 — Import the script from `~/.lldbinit`

Add this line to `~/.lldbinit`:

```python
command script import ~/lldb/simfolder.py
```

Restart Xcode (or restart the debug session) so LLDB reloads.

---

## Usage in Xcode

1. Run your app in the Simulator from Xcode.
2. Hit a breakpoint (or press pause).
3. In the LLDB console, run:

- `(lldb) documents` — opens the app container root
- `(lldb) files` — opens the Files app local storage folder

That’s it: no extra apps, no UUID hunting.

---

## Troubleshooting

- **`documents` prints a weird path or nothing**  
  Make sure you’re stopped in a context where Objective‑C expressions can run. Also confirm the app is actually running under the debugger.

- **`files` says “folder not found”**  
  The Simulator may not have initialized Files storage yet. Open the **Files** app in the Simulator at least once, then try again.

- **Command not found after adding `~/.lldbinit`**  
  Double-check the import path is absolute and points to the correct file. Restart Xcode to reload LLDB.

---

## Full Script

[simfolder.py](https://raw.githubusercontent.com/Kirow/blog/refs/heads/main/Resources/extend-lldb-with-python-scripts/simfolder.py)
