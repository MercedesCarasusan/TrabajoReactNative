# MotionTrack

MotionTrack is a React Native fitness tracking app built with Expo. It lets users register, sign in, save profile data, record training sessions, track movement with device sensors, review previous workouts, and visualize burned calories.

## Features

- Email/password authentication with Firebase Authentication.
- User profile data stored in Firestore: weight, height, and age.
- Training session tracking with:
  - GPS route tracking.
  - Distance calculation.
  - Step counter.
  - Accelerometer readings.
  - Elapsed time.
  - Average speed.
  - Automatic training type classification.
  - Estimated calories burned.
- Optional training photos from the camera or photo library.
- Training history with date filters.
- Long-press deletion for saved workouts.
- Daily and weekly calorie charts.
- Drawer navigation for authenticated users.

## Tech Stack

- React Native 0.81
- React 19
- Expo 54
- Expo Dev Client
- Firebase Authentication
- Cloud Firestore
- Redux Toolkit
- React Redux
- React Navigation
- React Native Paper
- React Native Maps
- Expo Location
- Expo Sensors
- Expo Image Picker
- Expo File System

## Project Structure

```text
.
|-- App.js
|-- app.config.js
|-- index.js
|-- assets/
|-- components/
|   |-- calories/
|   `-- trainings/
|-- firebase/
|-- hooks/
|-- navigation/
|-- redux/
|   `-- slices/
|-- screens/
|-- services/
|   |-- firebase/
|   `-- local/
`-- utils/
```

## Requirements

- Node.js
- npm
- Expo CLI / Expo tooling
- Android Studio or Xcode, depending on the target platform
- A Firebase project with Authentication and Firestore enabled
- A Google Maps API key for Android map rendering

## Installation

Install the project dependencies:

```bash
npm install
```

## Environment Configuration

The Android configuration in `app.config.js` reads the Google Maps API key from:

```bash
GOOGLE_MAPS_API_KEY
```

Set this environment variable before running or building the Android app.

PowerShell example:

```bash
$env:GOOGLE_MAPS_API_KEY="your_google_maps_api_key"
```

On macOS/Linux:

```bash
export GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

Firebase is configured in `firebase/firebaseConfig.js`. If you use a different Firebase project, replace the Firebase configuration values in that file.

## Running the App

Start the Expo development server:

```bash
npm start
```

Run on Android:

```bash
npm run android
```

Run on iOS:

```bash
npm run ios
```

Run on web:

```bash
npm run web
```

Because this project uses native modules such as maps, sensors, location, and Expo Dev Client, the best mobile workflow is to run it in a development build instead of only relying on Expo Go.

## Available Scripts

```bash
npm start
```

Starts the Expo development server.

```bash
npm run android
```

Builds and runs the app on Android.

```bash
npm run ios
```

Builds and runs the app on iOS.

```bash
npm run web
```

Starts the app for web.

## App Flow

Unauthenticated users see the authentication stack with login and registration screens. Once Firebase reports an authenticated user, the app switches to the main drawer navigator.

The drawer contains:

- Profile: save weight, height, and age.
- Training: start and stop a training session.
- My Trainings: view, filter, and delete saved workouts.
- Calories: inspect daily and weekly calorie summaries.

## Permissions

The app requests permissions for:

- Fine and coarse location access.
- Activity recognition on Android.
- Device motion sensors.
- Camera access for training photos.
- Photo library access for training photos.

These permissions are declared in `app.config.js`.

## Data Storage

Training sessions are stored in Firestore under:

```text
entrenamientos/{userId}/sesiones
```

Profile documents are managed through `services/firebase/profileService.js`.

Local training images are handled through `services/local/trainingImageService.js`.

## EAS Build

The project includes `eas.json` with development, preview, and production profiles.

Development build:

```bash
eas build --profile development
```

Preview build:

```bash
eas build --profile preview
```

Production build:

```bash
eas build --profile production
```

## Notes

- Maps require a valid Google Maps API key on Android.
- Sensor and location features work best on a physical device.
- Firestore security rules should be configured so users can only access their own profile and training data.
