# Non-Idle Clicker

Non-Idle Clicker is a mobile application designed to track work and tasks using principles inspired by Six Sigma and gamified with "Diablo 4 looter shooter mechanics." The application aims to provide a lightweight, local, and efficient way for users to measure their productivity and identify areas for improvement in their workflows.

## Features

- Track work units (clicks) and elapsed time
- Calculate and display Units Per Minute (UPM)
- Start, pause, and reset the timer
- Take timestamped notes during paused periods
- Local data storage on the user's device
- Light and dark theme support

## Installation

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

## Usage

1. Open the app on your device or simulator.
2. Press the "Start" button to begin tracking time.
3. Press the "Click!" button to register work units.
4. Press the "Pause" button to pause the timer and take notes.
5. Press the "Reset" button to reset the timer, clicks, and notes.

## File Structure

```plaintext
.
├── app
│   ├── (tabs)
│   │   ├── _layout.tsx
│   │   ├── explore.tsx
│   │   ├── index.tsx
│   │   └── play.tsx
│   ├── _layout.tsx
│   ├── +not-found.tsx
│   └── contexts
│       └── WorkSessionContext.tsx
├── application
│   ├── ports
│   │   └── TimerService.ts
│   ├── services
│   │   └── WorkTimerService.ts
│   └── use_cases
│       ├── IncrementClicksUseCase.ts
│       ├── PauseTimerUseCase.ts
│       ├── ResetSessionUseCase.ts
│       └── StartTimerUseCase.ts
├── components
│   ├── Collapsible.tsx
│   ├── ExternalLink.tsx
│   ├── MetricsDisplay.tsx
│   ├── TimerControls.tsx
│   ├── ThemedText.tsx
│   ├── ThemedView.tsx
│   └── ui
│       └── IconSymbol.tsx
├── constants
│   └── Colors.ts
├── domain
│   └── entities
│       └── WorkSession.ts
├── docs
│   ├── clean_architecture_plan.md
│   └── srs.md
├── hooks
│   ├── useColorScheme.ts
│   ├── useColorScheme.web.ts
│   └── useThemeColor.ts
├── infrastructure
│   └── TimerServiceImpl.ts
├── presentation
│   └── controllers
│       └── PlayScreenController.ts
├── utils
│   └── timeUtils.ts
├── .gitignore
├── app.json
├── package.json
├── README.md
└── tsconfig.json
```

## Contribution Guidelines

We welcome contributions from the community! To contribute to Non-Idle Clicker, please follow these guidelines:

1. Fork the repository and create a new branch for your feature or bugfix.
2. Write clear, concise commit messages and follow the existing code style.
3. Ensure your code passes all tests and linting checks.
4. Submit a pull request with a detailed description of your changes.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contact

For questions or support, please reach out to us through the following channels:

- [GitHub Issues](https://github.com/jimd-den/idle_clicker/issues)
- [Discord Community](https://chat.expo.dev)
