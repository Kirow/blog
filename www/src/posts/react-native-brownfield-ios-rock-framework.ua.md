---
title: Інтеграція React Native Brownfield для iOS з Rock Framework
date: '2025-12-30'
tags:
  - react-native
  - ios
  - swift
  - brownfield
  - tutorial
description: Дізнайтеся, як інтегрувати компоненти React Native в існуючий iOS-додаток за допомогою Rock framework (раніше RNEF). Цей посібник охоплює налаштування, створення компонентів та робочий процес розробки для brownfield інтеграції.
readingTime: 8 хв
---

Інтеграція React Native в існуючий iOS-додаток (brownfield інтеграція) дозволяє поступово впроваджувати React Native без переписування всього додатку. Цей посібник показує, як налаштувати [Rock framework](https://www.rockjs.dev/) (раніше RNEF) для створення компонентів React Native, які можуть використовуватися як нативні xcframeworks у вашому Swift-проєкті.

## Огляд

Це налаштування використовує:

- **Rock** — Система збірки для інтеграції React Native + native
- **Hermes** — JavaScript-рушій, оптимізований для React Native
- **Bun** — Швидкий JavaScript runtime та пакетний менеджер
- **CocoaPods** — Управління залежностями iOS (через Ruby)

Кінцевий результат — набір xcframeworks, які ваш нативний iOS-додаток може використовувати, експонуючи компоненти React Native як Swift-сумісні в'юшки.

## Передумови

### Необхідні інструменти

| Інструмент | Призначення | Встановлення |
|------------|-------------|--------------|
| Homebrew | Пакетний менеджер macOS | [brew.sh](https://brew.sh) |
| mise | Менеджер версій інструментів | Див. нижче |
| Xcode | Розробка iOS | Mac App Store |

### Системні залежності

Встановіть `libyaml` (необхідний для Ruby/CocoaPods):

```bash
brew install libyaml
```

### Встановлення mise

[mise](https://mise.jdx.dev/getting-started.html) керує версіями Node, Bun та Ruby для послідовних середовищ розробки.

**Встановіть mise:**

```bash
curl https://mise.run | sh
```

**Додайте mise до вашої оболонки** (дотримуйтесь інструкцій від інсталятора):

```bash
# Для zsh (за замовчуванням на macOS)
echo 'eval "$(~/.local/bin/mise activate zsh)"' >> ~/.zshrc
source ~/.zshrc
```

## Налаштування проєкту

### Крок 1: Налаштування версій інструментів

Створіть файл `mise.toml` у каталозі вашого проєкту:

```toml
[tools]
bun = "latest"
node = "24.6.0"
ruby = "3.3.4"
```

Встановіть закріплені версії:

```bash
mise install
```

### Крок 2: Створення нового Rock-проєкту

```bash
bun create rock@latest
```

Дотримуйтесь підказок для налаштування вашого проєкту. Це створює базову структуру для вашої brownfield інтеграції React Native.

### Крок 3: Встановлення JavaScript-залежностей

Перейдіть до каталогу проєкту та встановіть залежності:

```bash
bun install
```

### Крок 4: Збірка iOS Frameworks

Цей крок генерує xcframeworks, які ваш Swift-проєкт буде використовувати:

```bash
bun run package:ios
```

Ця команда:
- Збирає JavaScript-код у бандл
- Збирає нативні iOS xcframeworks
- Генерує xcframeworks, включаючи `hermes.xcframework` та `ReactBrownfield.xcframework`

### Крок 5: Перевірка встановлення

Запустіть сервер розробки, щоб переконатися, що все працює:

```bash
bun run start
```

Або запустіть в iOS Simulator:

```bash
bun run ios
```

## Додавання нового компонента

Щоб додати новий компонент React Native, який можна використовувати зі Swift:

### Крок 1: Створення React-компонента

Створіть нову папку та TypeScript-файл у каталозі модулів:

```
YourProject/
└── Modules/
    └── MyScreen/
        └── MyScreen.tsx
```

Приклад компонента:

```tsx
import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

export default function MyScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Мій екран</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
    },
});
```

### Крок 2: Реєстрація компонента

Додайте імпорт та реєстрацію в `index.js`:

```javascript
import { AppRegistry } from 'react-native';
import MyScreen from './Modules/MyScreen/MyScreen';

AppRegistry.registerComponent('MyScreen', () => MyScreen);
```

### Крок 3: Додавання Swift Binding

Створіть або оновіть ваші Swift bindings для експонування нового компонента:

```swift
public enum ReactNativeModule: String, CaseIterable, Identifiable {
    case myScreen = "MyScreen"
    
    public var id: String { rawValue }
    
    public var displayName: String {
        switch self {
        case .myScreen:
            return "Мій екран"
        }
    }
}
```

### Крок 4: Перезбірка Framework

Після внесення змін перезберіть iOS framework:

```bash
bun run package:ios
```

### Крок 5: Використання в SwiftUI

Імпортуйте та використовуйте компонент у вашому Swift-коді:

```swift
import YourReactPackage

// Ініціалізація один раз при запуску додатку
ReactNativeComponent.initialize(launchOptions: launchOptions)

// Використання компонента в SwiftUI
ReactNativeComponent.view(for: .myScreen)
```

## Робочий процес розробки

### Розуміння процесу збірки

Коли ви запускаєте `bun run package:ios`, створюється **статичний JavaScript-бандл**, який вбудовується в xcframeworks. Ваш основний iOS-додаток використовує цей статичний бандл — hot reload не працює при запуску основного додатку.

**Щоб побачити зміни в основному додатку:**
1. Внесіть зміни в React-компонент
2. Запустіть `bun run package:ios` для перезбірки бандлу
3. Перезберіть ваш основний iOS-проєкт в Xcode

### Розробка з Hot Reload

Для швидшої ітерації під час розробки компонентів використовуйте автономний додаток розробки з hot reload:

#### 1. Запустіть сервер розробки

```bash
bun run start
```

Це запускає Metro bundler з підтримкою hot reload.

#### 2. Налаштуйте додаток розробки

Відредагуйте ваш `AppDelegate.swift`, щоб вказати, який модуль завантажувати:

```swift
factory.startReactNative(
    withModuleName: "MyScreen",  // Змініть на ім'я вашого компонента
    in: window,
    launchOptions: launchOptions
)
```

Ім'я модуля повинно відповідати імені, використаному в `AppRegistry.registerComponent()`.

#### 3. Запустіть додаток розробки

В окремому терміналі:

```bash
bun run ios
```

Це запускає додаток розробки в iOS Simulator, підключений до dev-сервера.

#### 4. Розробляйте з Hot Reload

Тепер ви можете редагувати ваш компонент і бачити зміни миттєво в симуляторі без перезбірки.

### Завершення змін

Після завершення розробки:

1. Поверніть зміну імені модуля в `AppDelegate.swift` (або залиште для наступної сесії розробки)
2. Запустіть `bun run package:ios` для створення production-бандлу
3. Перезберіть ваш основний iOS-проєкт, щоб включити оновлені компоненти

## Швидкий довідник

| Команда | Опис |
|---------|------|
| `mise install` | Встановити закріплені версії інструментів |
| `bun install` | Встановити JS-залежності |
| `bun run package:ios` | Збірка iOS frameworks (потрібно виконати першою) |
| `bun run start` | Запуск dev-сервера з hot reload |
| `bun run ios` | Запуск в iOS Simulator |
| `bun run lint` | Запуск ESLint |
| `bun run test` | Запуск Jest-тестів |

## Структура проєкту

Типова структура Rock brownfield-проєкту:

```
YourProject/
├── Modules/
│   ├── ScreenOne/
│   │   └── ScreenOne.tsx
│   └── ScreenTwo/
│       └── ScreenTwo.tsx
├── ios/
│   └── YourProject/
│       └── AppDelegate.swift
├── Sources/
│   └── YourPackage/
│       └── ReactComponent.swift
├── index.js
├── package.json
├── mise.toml
└── tsconfig.json
```

## Переваги цього підходу

- **Поступове впровадження**: Впроваджуйте React Native поступово без переписування додатку
- **Нативна продуктивність**: Hermes забезпечує оптимізоване виконання JavaScript
- **Безпека типів**: Підтримка TypeScript для React-компонентів
- **Швидка розробка**: Hot reload під час розробки компонентів
- **Чиста інтеграція**: xcframeworks забезпечують чітку межу між React Native та нативним кодом

## Наступні кроки

Звідси ви можете:
- Додати навігацію між екранами React Native
- Реалізувати native module bridges для платформо-специфічної функціональності
- Налаштувати спільний стан між нативним кодом та React Native
- Налаштувати CI/CD для автоматизованих збірок frameworks

Успішного кодування!

