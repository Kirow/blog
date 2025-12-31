---
title: React Native Brownfield Integration for iOS with Rock Framework
date: '2025-12-30'
tags:
  - react-native
  - ios
  - swift
  - brownfield
  - tutorial
description: Learn how to integrate React Native components into an existing iOS app using the Rock framework (formerly RNEF). This guide covers setup, component creation, and development workflow for brownfield integration.
readingTime: 8 min
---

Integrating React Native into an existing iOS app (brownfield integration) allows you to gradually adopt React Native without rewriting your entire application. This guide shows you how to set up the [Rock framework](https://www.rockjs.dev/) (formerly RNEF) to build React Native components that can be consumed as native xcframeworks in your Swift project.

## Overview

This setup uses:

- **Rock** - Build system for React Native + native integration
- **Hermes** - JavaScript engine optimized for React Native
- **Bun** - Fast JavaScript runtime and package manager
- **CocoaPods** - iOS dependency management (via Ruby)

The end result is a set of xcframeworks that your native iOS app can consume, exposing React Native components as Swift-compatible views.

## Prerequisites

### Required Tools

| Tool | Purpose | Installation |
|------|---------|--------------|
| Homebrew | macOS package manager | [brew.sh](https://brew.sh) |
| mise | Tool version manager | See below |
| Xcode | iOS development | Mac App Store |

### System Dependencies

Install `libyaml` (required for Ruby/CocoaPods):

```bash
brew install libyaml
```

### Installing mise

[mise](https://mise.jdx.dev/getting-started.html) manages Node, Bun, and Ruby versions for consistent development environments.

**Install mise:**

```bash
curl https://mise.run | sh
```

**Add mise to your shell** (follow the instructions from the installer):

```bash
# For zsh (default on macOS)
echo 'eval "$(~/.local/bin/mise activate zsh)"' >> ~/.zshrc
source ~/.zshrc
```

## Project Setup

### Step 1: Configure Tool Versions

Create a `mise.toml` file in your project directory:

```toml
[tools]
bun = "latest"
node = "24.6.0"
ruby = "3.3.4"
```

Install the pinned versions:

```bash
mise install
```

### Step 2: Create a New Rock Project

```bash
bun create rock@latest
```

Follow the prompts to configure your project. This creates the base structure for your React Native brownfield integration.

### Step 3: Install JavaScript Dependencies

Navigate to your project directory and install dependencies:

```bash
bun install
```

### Step 4: Build the iOS Frameworks

This step generates the xcframeworks that your Swift project will consume:

```bash
bun run package:ios
```

This command:
- Bundles the JavaScript code
- Builds the native iOS xcframeworks
- Generates xcframeworks including `hermes.xcframework` and `ReactBrownfield.xcframework`

### Step 5: Verify Installation

Start the development server to verify everything works:

```bash
bun run start
```

Or launch in the iOS Simulator:

```bash
bun run ios
```

## Adding a New Component

To add a new React Native component that can be used from Swift:

### Step 1: Create the React Component

Create a new folder and TypeScript file in your modules directory:

```
YourProject/
└── Modules/
    └── MyScreen/
        └── MyScreen.tsx
```

Example component:

```tsx
import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

export default function MyScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>My Screen</Text>
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

### Step 2: Register the Component

Add the import and registration in `index.js`:

```javascript
import { AppRegistry } from 'react-native';
import MyScreen from './Modules/MyScreen/MyScreen';

AppRegistry.registerComponent('MyScreen', () => MyScreen);
```

### Step 3: Add Swift Binding

Create or update your Swift bindings to expose the new component:

```swift
public enum ReactNativeModule: String, CaseIterable, Identifiable {
    case myScreen = "MyScreen"
    
    public var id: String { rawValue }
    
    public var displayName: String {
        switch self {
        case .myScreen:
            return "My Screen"
        }
    }
}
```

### Step 4: Rebuild the Framework

After making changes, rebuild the iOS framework:

```bash
bun run package:ios
```

### Step 5: Use in SwiftUI

Import and use the component in your Swift code:

```swift
import YourReactPackage

// Initialize once at app startup
ReactNativeComponent.initialize(launchOptions: launchOptions)

// Use the component in SwiftUI
ReactNativeComponent.view(for: .myScreen)
```

## Development Workflow

### Understanding the Build Process

When you run `bun run package:ios`, it creates a **static JavaScript bundle** that gets embedded into the xcframeworks. Your main iOS app uses this static bundle — there is no hot reload when running the main app.

**To see changes in the main app:**
1. Make your changes to the React component
2. Run `bun run package:ios` to rebuild the bundle
3. Rebuild your main iOS project in Xcode

### Development with Hot Reload

For faster iteration during component development, use the standalone development app with hot reload:

#### 1. Start the Development Server

```bash
bun run start
```

This starts Metro bundler with hot reload support.

#### 2. Configure the Development App

Edit your `AppDelegate.swift` to specify which module to load:

```swift
factory.startReactNative(
    withModuleName: "MyScreen",  // Change to your component name
    in: window,
    launchOptions: launchOptions
)
```

The module name must match the name used in `AppRegistry.registerComponent()`.

#### 3. Launch the Development App

In a separate terminal:

```bash
bun run ios
```

This launches the development app in the iOS Simulator, connected to the dev server.

#### 4. Develop with Hot Reload

Now you can edit your component and see changes instantly in the simulator without rebuilding.

### Finalizing Changes

Once development is complete:

1. Revert the `AppDelegate.swift` module name change (or leave it for the next development session)
2. Run `bun run package:ios` to create the production bundle
3. Rebuild your main iOS project to include the updated components

## Quick Reference

| Command | Description |
|---------|-------------|
| `mise install` | Install pinned tool versions |
| `bun install` | Install JS dependencies |
| `bun run package:ios` | Build iOS frameworks (required first) |
| `bun run start` | Start dev server with hot reload |
| `bun run ios` | Launch in iOS Simulator |
| `bun run lint` | Run ESLint |
| `bun run test` | Run Jest tests |

## Project Structure

A typical Rock brownfield project structure:

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

## Benefits of This Approach

- **Gradual adoption**: Introduce React Native incrementally without rewriting your app
- **Native performance**: Hermes provides optimized JavaScript execution
- **Type safety**: TypeScript support for React components
- **Fast development**: Hot reload during component development
- **Clean integration**: xcframeworks provide a clean boundary between React Native and native code

## Next Steps

From here, you can:
- Add navigation between React Native screens
- Implement native module bridges for platform-specific functionality
- Set up shared state between native and React Native code
- Configure CI/CD for automated framework builds

Happy coding!
