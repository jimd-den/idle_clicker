# Software Requirements Specification: Non-Idle Clicker

**Version:** 1.1
**Date:** October 27, 2023

## 1. Introduction

This document outlines the software requirements for "Non-Idle Clicker," a mobile application designed to track work and tasks using principles inspired by Six Sigma and gamified with "Diablo 4 looter shooter mechanics." The application aims to provide a lightweight, local, and efficient way for users to measure their productivity and identify areas for improvement in their workflows.

## 2. Goals

The primary goals of Non-Idle Clicker are to:

*   **Provide a simple and intuitive tool** for users to track their work units and time spent on tasks.
*   **Enable users to measure their work rate** (Clicks Per Minute - CPM) and track progress over time.
*   **Facilitate the application of Six Sigma principles** by providing data for process analysis and improvement.
*   **Gamify task tracking** by incorporating elements inspired by "Diablo 4 looter shooter mechanics" (implicitly through progress tracking and potential future features).
*   **Offer a local and private solution** for work tracking, ensuring user data remains on their device.
*   **Maintain a lightweight and performant application** suitable for everyday use on mobile devices.

## 3. Target Audience

The target audience for Non-Idle Clicker includes:

*   **Individuals practicing Six Sigma or Lean methodologies** who need a simple tool for data collection.
*   **Professionals and knowledge workers** seeking to improve their personal productivity and time management.
*   **Anyone interested in gamifying their daily tasks** and tracking their efficiency in a fun and engaging way.
*   **Users who prioritize data privacy** and prefer locally stored application data.

## 4. Scope

This version (Version 1.1) of Non-Idle Clicker includes the core functionality of work unit tracking, time measurement, and basic note-taking.

**In Scope:**

*   Work unit (click) tracking.
*   Elapsed time measurement (stopwatch).
*   Clicks Per Minute (CPM) calculation and display (now referred to as UPM - Units Per Minute in UI).
*   Start/Pause/Reset timer functionality.
*   Timestamped note-taking during paused periods.
*   Local data storage on the user's device.
*   Basic user interface for task tracking and data display.
*   Light and Dark theme support.

**Out of Scope (for Version 1.1):**

*   Cloud data synchronization or backup.
*   Data export or reporting features.
*   Advanced data analysis or visualization.
*   User accounts or profiles.
*   Integration with other applications or services.
*   Gamification features beyond basic progress tracking (e.g., levels, rewards, leaderboards).
*   Customizable work units or task categories.

## 5. Functional Requirements

### 5.1. Play Screen (`app/(tabs)/play.tsx`)

The Play Screen is the primary interface for users to interact with the Non-Idle Clicker. It will consist of three main modules:

#### 5.1.1. Top Module: Performance Metrics Display

*   **FR-PLAY-1: UPM Display:** The application shall display the calculated Units Per Minute (UPM) in real-time or near real-time, updating as the user clicks and time elapses. (Note: UI Label changed from CPM to UPM for clarity).
*   **FR-PLAY-2: Stopwatch Display:** The application shall display an elapsed time stopwatch, showing minutes and seconds (MM:SS) format, updating every second.
*   **FR-PLAY-3: Timer Start/Reset on Screen Load:** The stopwatch timer shall **not** start automatically when the Play Screen is loaded. The timer should start only when the user presses the "Start" button. The timer should reset to 00:00 when the "Reset" button is pressed. (Note: Requirement adjusted - Timer no longer starts on screen load, user-initiated start/pause).

#### 5.1.2. Middle Module: Work Unit Input

*   **FR-PLAY-4: Click Button:** The application shall provide a prominent button labeled "Click!" or with a suitable icon for users to register work units.
*   **FR-PLAY-5: Click Counter:** Each press of the "Click!" button shall increment a counter that tracks the total work units (clicks) recorded during the current session.
*   **FR-PLAY-6: Haptic Feedback (Optional):**  Provide haptic feedback on button press for enhanced user experience (if feasible and desired).

#### 5.1.3. Bottom Module: Timer Control and Notes

*   **FR-PLAY-7: Play/Pause Button:** The application shall have a button to control the timer.
    *   When the timer is running, the button shall display "Pause" (or an "Andon" symbol).
    *   When the timer is paused, the button shall display "Start" (or a "Play" symbol).
*   **FR-PLAY-8: Timer Start/Pause Toggle:** Pressing the Play/Pause button shall toggle the timer between running and paused states.
*   **FR-PLAY-9: Note-Taking on Pause:** When the timer is paused, the application shall allow the user to input timestamped notes related to the task.
    *   **FR-PLAY-9.1: Note Input Field:** Provide a text input field for note entry, disabled when the timer is running.
    *   **FR-PLAY-9.2: Timestamping:**  Automatically timestamp each note with the current elapsed time (MM:SS format) when the note is added.
    *   **FR-PLAY-9.3: Note Storage:** Store notes in-memory for the current session. Notes are cleared on session reset.
    *   **FR-PLAY-9.4: Note Display (Basic):**  Display notes in a simple list format below the input field, showing the timestamp and note text. Display "No notes yet. Pause timer to add notes." message when no notes are present.
    *   **FR-PLAY-9.5: Add Note Button:** Provide an "Add Note" button to save the note, disabled when the timer is running.

### 5.2. Data Management

*   **FR-DATA-1: Local Storage:** All application data, including session time, click counts, and notes, shall be stored locally on the user's device. (Note: For Version 1.1, notes are stored in-memory and are not persistent across app restarts).
*   **FR-DATA-2: Session Persistence (Temporary):**  Session data (time, clicks, notes) should persist while the application is in the foreground or background. Closing the application completely will reset the session data (timer, clicks, and notes) for Version 1.1.
*   **FR-DATA-3: Data Reset (Manual):** Provide a clear "Reset" button on the Play Screen for the user to manually reset the current session data (timer, clicks, notes).

## 6. Non-Functional Requirements

### 6.1. Performance

*   **NFR-PERF-1: Responsiveness:** The application shall be responsive and provide a smooth user experience. Button presses and timer updates should be near instantaneous.
*   **NFR-PERF-2: Low Resource Usage:** The application should be lightweight and consume minimal device resources (CPU, memory, battery).

### 6.2. Usability

*   **NFR-USAB-1: Intuitive Interface:** The user interface shall be intuitive and easy to use, requiring minimal learning.
*   **NFR-USAB-2: Clear Information Display:**  Information displayed (UPM, time, clicks, notes) should be clear, concise, and easily readable.
*   **NFR-USAB-3: Accessibility:**  Consider basic accessibility principles for users with disabilities (e.g., sufficient color contrast, text scaling).

### 6.3. Reliability

*   **NFR-RELY-1: Data Integrity:** The application shall ensure data integrity and prevent data loss during normal operation.
*   **NFR-RELY-2: Error Handling:** The application should handle errors gracefully and provide informative messages if necessary.

### 6.4. Security

*   **NFR-SEC-1: Local Data Storage Security:** Data is stored locally and relies on the device's inherent security. No specific application-level security measures are required for Version 1.1 beyond standard mobile app security practices.

### 6.5. Maintainability

*   **NFR-MAINT-1: Clean Architecture:** The application shall be developed using a clean architecture approach to ensure maintainability and scalability.
*   **NFR-MAINT-2: Code Readability:**  Code should be well-documented and written in a clear and understandable style.

### 6.6. Portability

*   **NFR-PORT-1: Cross-Platform Compatibility:** The application is intended to be cross-platform compatible (iOS and Android) using React Native.

## 7. Architecture

The application will be designed using a Clean Architecture approach. This will involve separating the application into distinct layers with clear responsibilities:

*   **Presentation Layer (UI):** React Native components (`.tsx` files in `app/(tabs)`) responsible for rendering the user interface and handling user interactions.
*   **Application Layer (Use Cases/Interactors):**  JavaScript/TypeScript modules (potentially in a `use_cases/` or `services/` directory - to be determined) that contain the application's business logic and orchestrate interactions between the UI and the Domain Layer.
*   **Domain Layer (Entities and Business Rules):** JavaScript/TypeScript modules (potentially in a `domain/` or `entities/` directory - to be determined) that define the core business entities (e.g., `WorkSession`, `Note`) and business rules.
*   **Infrastructure Layer (Frameworks and Drivers):**  React Native framework, device APIs, and local storage mechanisms.  Context API (`contexts/WorkSessionContext.tsx`) is used for state management.

**Layered Dependencies:** The Presentation Layer will depend on the Application Layer, which will depend on the Domain Layer. The Infrastructure Layer will be depended upon by all layers but should not depend on any of them. This dependency rule ensures loose coupling and promotes testability and maintainability.

## 8. Technology Stack

*   **Framework:** React Native
*   **Language:** TypeScript
*   **State Management:** React Context API (`contexts/WorkSessionContext.tsx`)
*   **Styling:** React Native StyleSheet, Themed Components (`components/Themed*`)
*   **Local Storage:** In-memory storage for notes in Version 1.1. (Consider React Native AsyncStorage for future persistence).
*   **UI Components:** React Native core components, custom components (`components/`)

## 9. Future Considerations (Beyond Version 1.1)

*   **Data Persistence:** Implement persistent storage of session history, including notes, allowing users to review past work sessions and track progress over time.
*   **Data Export:** Allow users to export session data (e.g., CSV, JSON) for analysis in external tools.
*   **Task Categorization:** Enable users to categorize work sessions by task type or project.
*   **Gamification Enhancements:** Introduce more advanced gamification elements, such as progress bars, achievements, streaks, and potentially leaderboards (if online features are added).
*   **Cloud Sync/Backup:**  Optionally provide cloud synchronization and backup of user data.
*   **Reporting and Analytics:**  Implement basic reporting features within the app to visualize work patterns and trends.
*   **Customizable UI:** Allow users to customize the application's appearance and layout.

This Software Requirements Specification serves as a guide for the development of Non-Idle Clicker Version 1.1. It will be reviewed and updated as needed throughout the development process.
