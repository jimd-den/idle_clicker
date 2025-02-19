# Clean Architecture Plan: Non-Idle Clicker

**Version:** 1.0
**Date:** October 26, 2023

## 1. Introduction to Clean Architecture

This document details the Clean Architecture plan for the Non-Idle Clicker mobile application. Clean Architecture is a software design philosophy that emphasizes the separation of concerns, making applications more maintainable, testable, and independent of frameworks, UI, and databases.

In the context of Non-Idle Clicker, Clean Architecture will help us:

*   **Isolate business logic:** Ensure that the core logic of work tracking and CPM calculation is independent of UI changes or framework updates.
*   **Improve testability:**  Enable unit testing of business logic without relying on UI or external dependencies.
*   **Enhance maintainability:**  Make the codebase easier to understand, modify, and extend as new features are added in the future.
*   **Adapt to change:**  Allow for easier changes to the UI, state management, or data storage mechanisms without impacting the core application logic.

## 2. Layer Definitions

Clean Architecture organizes the application into four main layers, arranged in concentric circles. The core of the application is independent of outer circles. Dependencies only point inwards.

*   **2.1. Domain Layer (Entities & Use Cases):**
    *   This is the innermost layer and contains the core business logic and entities of the application.
    *   It is independent of any UI, frameworks, or databases.
    *   It defines *what* the application does, without specifying *how* it is done.
    *   **Entities:** Represent the business objects and data structures. In Non-Idle Clicker, entities might include `WorkSession`, `ClickEvent`, `Note`.  For Version 1.0, these might be implicitly managed within the `WorkTimerContext` state.
    *   **Use Cases (Interactors):** Define the specific actions a user can perform with the application. Use cases operate on entities and encapsulate the business rules. Examples in Non-Idle Clicker include `StartTimerUseCase`, `PauseTimerUseCase`, `IncrementClicksUseCase`, `RecordNoteUseCase`, `ResetSessionUseCase`.

*   **2.2. Application Layer (Use Case Implementations & Ports):**
    *   This layer implements the Use Cases defined in the Domain Layer.
    *   It orchestrates the flow of data between the Presentation and Domain layers.
    *   It contains application-specific business rules and logic, but still remains independent of UI and infrastructure details.
    *   **Use Case Implementations:** Concrete implementations of the Use Cases defined in the Domain Layer. These implementations will use Entities and Domain logic to perform the required actions.
    *   **Ports (Interfaces):** Define interfaces that the Application Layer uses to interact with the Infrastructure Layer. Ports abstract away the concrete implementations of infrastructure concerns like data storage and external services.  For Version 1.0, explicit ports might be minimal, but the concept is important for future expansion.

*   **2.3. Presentation Layer (UI & Controllers/Presenters):**
    *   This layer is responsible for displaying information to the user and handling user input.
    *   It is aware of the Application Layer but should not contain any business logic.
    *   It adapts the Use Cases from the Application Layer to the specific needs of the UI.
    *   **UI Components (Views):** React Native components (`.tsx` files in `app/(tabs)`) that render the user interface (e.g., `PlayScreen`).
    *   **Controllers/Presenters:**  Handle user interactions from the UI, translate them into Use Case requests, and format data from the Application Layer for display in the UI. For Version 1.0, these might be implicitly within the React components, but for more complex UIs, dedicated controller/presenter components would be beneficial.

*   **2.4. Infrastructure Layer (Frameworks, Databases, External Services):**
    *   This is the outermost layer and deals with all external concerns such as UI frameworks, databases, device APIs, and external services.
    *   It implements the Ports defined in the Application Layer.
    *   It is the most volatile layer and changes most frequently due to technology updates.
    *   **Frameworks & UI Framework:** React Native framework itself, React Context API for basic state management (for Version 1.0).
    *   **Device APIs:** React Native APIs for accessing device features (e.g., haptic feedback - if implemented).
    *   **Local Storage:**  React Native AsyncStorage (or similar - for future persistent storage).
    *   **Date/Time:** JavaScript Date objects and utility functions for time management (`utils/timeUtils.ts`).

## 3. Component Breakdown for Non-Idle Clicker

Applying Clean Architecture to Non-Idle Clicker Version 1.0, we can outline the components within each layer:

*   **3.1. Domain Layer:**
    *   **Entities (Implicit for V1.0):**
        *   `WorkSession`:  Represents a work session, containing start time, end time, total clicks, and notes. (Not explicitly implemented as a class in V1.0, but the concept exists in the `WorkTimerContext` state).
        *   `ClickEvent`: Represents a single click event with a timestamp. (Implicitly tracked by the `clicks` counter).
        *   `Note`: Represents a timestamped note associated with a work session. (Implicitly managed as part of the session data for V1.0).
    *   **Use Cases (Implicit/Managed by Context for V1.0):**
        *   `StartTimerUseCase`: Starts the work timer. (Implemented by `startTimer` function in `WorkTimerContext`).
        *   `PauseTimerUseCase`: Pauses the work timer. (Implemented by `pauseTimer` function in `WorkTimerContext`).
        *   `IncrementClicksUseCase`: Increments the click counter. (Implemented by `incrementClicks` function in `WorkTimerContext`).
        *   `ResetSessionUseCase`: Resets the timer, clicks, and notes for a new session. (Implemented by `reset` function in `WorkTimerContext`).
        *   `RecordNoteUseCase`: Records a timestamped note during a paused session. (Partially implemented - note taking UI and storage to be added in future iterations).

*   **3.2. Application Layer:**
    *   **Use Case Implementations (Implicit/Context Provider for V1.0):**
        *   `WorkTimerContext.tsx`:  The `WorkTimerContext` component in `contexts/WorkTimerContext.tsx` acts as a simplified Application Layer for Version 1.0. It houses the state and functions that implement the core use cases.  For future versions, these use cases would be extracted into separate modules and orchestrated by the Application Layer.
    *   **Ports (Not explicitly defined in V1.0, but conceptually...):**
        *   For Version 1.0, there are no explicit ports as data storage is in-memory and state is managed by React Context.  However, conceptually, if we were to persist data, we would define ports (interfaces) here for data repositories.

*   **3.3. Presentation Layer:**
    *   **UI Components (Views):**
        *   `app/(tabs)/play.tsx`:  The `PlayScreen` component is the main UI for interacting with the work timer and clicker.
        *   `components/ThemedText.tsx`, `components/ThemedView.tsx`: Reusable themed UI components.
    *   **Controllers/Presenters (Implicit in V1.0 React Components):**
        *   The logic within `PlayScreen` to handle button presses (`incrementClicks`, `startTimer`, `pauseTimer`) and display data acts as the controller for Version 1.0.  In a more complex application, dedicated controller/presenter components would be introduced to separate UI logic from presentation details.

*   **3.4. Infrastructure Layer:**
    *   **Frameworks:**
        *   React Native
        *   React Context API
    *   **Device APIs:** (Potentially Haptic Feedback API in the future)
    *   **Local Storage:** (AsyncStorage for future persistence)
    *   **Utilities:**
        *   `utils/timeUtils.ts` (if more complex time utilities are added later)
        *   `constants/Colors.ts` for UI theming.

## 4. Dependency Rules and Flow of Control

*   **Dependency Rule:**  Layers can only depend on layers *inwards* from themselves.  Outer layers know about inner layers, but inner layers are completely unaware of outer layers.
    *   Presentation Layer depends on Application Layer.
    *   Application Layer depends on Domain Layer.
    *   Infrastructure Layer is depended upon by all layers but does not depend on any of them.
*   **Flow of Control:**
    1.  User interacts with the **Presentation Layer** (UI Components).
    2.  UI Components call functions or methods in the **Presentation Layer's Controllers/Presenters** (or directly within the component for V1.0).
    3.  Controllers/Presenters (or UI components) invoke **Use Cases** in the **Application Layer**.
    4.  Use Cases in the **Application Layer** interact with **Entities** and business logic in the **Domain Layer**.
    5.  If data persistence or external services are needed, the Application Layer uses **Ports** to communicate with the **Infrastructure Layer**.
    6.  The **Infrastructure Layer** performs the actual operations (e.g., database access, API calls) and returns results back through the layers, eventually reaching the Presentation Layer to update the UI.

## 5. Technology Stack Mapping to Layers

| Layer             | Technology in Non-Idle Clicker (V1.0)                                  |
| ----------------- | ----------------------------------------------------------------------- |
| Domain Layer      | JavaScript/TypeScript (Entities - Implicit, Use Cases - Implicit/Context) |
| Application Layer | React Context API (`contexts/WorkTimerContext.tsx`)                     |
| Presentation Layer| React Native Components (`app/(tabs)/*.tsx`, `components/*.tsx`)        |
| Infrastructure Layer| React Native, Device APIs (potential), JavaScript Date, `constants/Colors.ts` |

## 6. Diagram (Conceptual - V1.0 Simplified)

For Version 1.0, the Clean Architecture is simplified due to the limited scope.  A conceptual diagram would look something like this:

