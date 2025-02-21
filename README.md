# Welcome to Non-Idle Clicker 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

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

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.

## App Functionality and Purpose

Non-Idle Clicker is a mobile application designed to track work and tasks using principles inspired by Six Sigma and gamified with "Diablo 4 looter shooter mechanics." The application aims to provide a lightweight, local, and efficient way for users to measure their productivity and identify areas for improvement in their workflows.

### Key Features

- **Work unit (click) tracking:** Track the number of work units (clicks) completed during a session.
- **Elapsed time measurement:** Measure the time spent on tasks with a stopwatch.
- **Units Per Minute (UPM) calculation:** Calculate and display the rate of work units completed per minute.
- **Start/Pause/Reset timer functionality:** Control the timer with start, pause, and reset buttons.
- **Timestamped note-taking:** Add notes with timestamps during paused periods.
- **Local data storage:** Store session data locally on the user's device.
- **Light and Dark theme support:** Switch between light and dark themes based on user preference.

## Clean Architecture

Non-Idle Clicker follows the Clean Architecture approach to ensure maintainability, testability, and separation of concerns. The application is organized into four main layers:

1. **Domain Layer (Entities & Use Cases):**
   - Contains the core business logic and entities of the application.
   - Independent of any UI, frameworks, or databases.
   - Defines what the application does without specifying how it is done.

2. **Application Layer (Use Case Implementations & Ports):**
   - Implements the Use Cases defined in the Domain Layer.
   - Orchestrates the flow of data between the Presentation and Domain layers.
   - Contains application-specific business rules and logic.

3. **Presentation Layer (UI & Controllers/Presenters):**
   - Responsible for displaying information to the user and handling user input.
   - Adapts the Use Cases from the Application Layer to the specific needs of the UI.
   - Contains React Native components and controllers/presenters.

4. **Infrastructure Layer (Frameworks, Databases, External Services):**
   - Deals with external concerns such as UI frameworks, databases, device APIs, and external services.
   - Implements the Ports defined in the Application Layer.
   - The most volatile layer, changing frequently due to technology updates.

## Main Components and Their Roles

### Domain Layer

- **Entities:** Represent the business objects and data structures, such as `WorkSession`, `ClickEvent`, and `Note`.
- **Use Cases:** Define the specific actions a user can perform with the application, such as `StartTimerUseCase`, `PauseTimerUseCase`, `IncrementClicksUseCase`, `RecordNoteUseCase`, and `ResetSessionUseCase`.

### Application Layer

- **Use Case Implementations:** Concrete implementations of the Use Cases defined in the Domain Layer.
- **Ports (Interfaces):** Define interfaces that the Application Layer uses to interact with the Infrastructure Layer.

### Presentation Layer

- **UI Components (Views):** React Native components that render the user interface, such as `PlayScreen`.
- **Controllers/Presenters:** Handle user interactions from the UI, translate them into Use Case requests, and format data from the Application Layer for display in the UI.

### Infrastructure Layer

- **Frameworks & UI Framework:** React Native framework and React Context API for state management.
- **Device APIs:** React Native APIs for accessing device features.
- **Local Storage:** React Native AsyncStorage (or similar) for future persistent storage.
- **Date/Time:** JavaScript Date objects and utility functions for time management.

## Target Audience and Goals

### Target Audience

- Individuals practicing Six Sigma or Lean methodologies who need a simple tool for data collection.
- Professionals and knowledge workers seeking to improve their personal productivity and time management.
- Anyone interested in gamifying their daily tasks and tracking their efficiency in a fun and engaging way.
- Users who prioritize data privacy and prefer locally stored application data.

### Goals

- Provide a simple and intuitive tool for users to track their work units and time spent on tasks.
- Enable users to measure their work rate (Units Per Minute - UPM) and track progress over time.
- Facilitate the application of Six Sigma principles by providing data for process analysis and improvement.
- Gamify task tracking by incorporating elements inspired by "Diablo 4 looter shooter mechanics."
- Offer a local and private solution for work tracking, ensuring user data remains on their device.
- Maintain a lightweight and performant application suitable for everyday use on mobile devices.

## Technologies and Frameworks Used

- **React Native:** Framework for building cross-platform mobile applications.
- **TypeScript:** Programming language for type-safe development.
- **React Context API:** State management solution for managing global state.
- **Expo:** Toolset for developing, building, and deploying React Native applications.
- **JavaScript Date:** Built-in JavaScript object for handling date and time.
- **React Native AsyncStorage:** Local storage solution for persisting data on the user's device (planned for future versions).

