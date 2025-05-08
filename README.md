# HILBU - Car Recovery Service

A comprehensive vehicle recovery service app built with React Native and Expo.

## Project Overview

HILBU is a mobile application for car recovery services, similar to ride-hailing apps but specialized for vehicle recovery. The app consists of two main components:

1. User App: For customers to request vehicle recovery services
2. Driver App: For recovery service providers to accept and manage jobs
3. Admin Web Panel: For managing users, drivers, and recovery requests

## Features

### User App
- Phone number authentication with OTP
- Real-time car recovery request system
- Location-based driver matching and tracking
- Trip history and payment management
- In-app support and communication
- Guest access with post-service registration

### Driver App
- Driver registration and profile management
- Accept/reject recovery jobs
- Real-time navigation and status updates
- Earnings tracking and history

### Admin Panel (Web)
- Dashboard for monitoring activity
- User and driver management
- Recovery request oversight
- Analytics and reporting

## Technology Stack

- React Native with Expo
- Firebase Authentication
- Google Maps API for location services
- Firestore for database
- React Native Navigation for routing
- AsyncStorage for local data persistence
- React Context API for state management

## Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/hilbu-app.git
cd hilbu-app
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
Create a `.env` file in the root directory and add:
```
EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

4. Start the development server
```bash
npm run dev
```

## Project Structure

```
/app                    # App routes using Expo Router
  /(tabs)               # Main tab navigation
  /auth                 # Authentication screens
  /driver               # Driver app screens
/components             # Reusable components
/hooks                  # Custom hooks for data handling
/context                # React Context providers
/assets                 # Images, fonts and other static assets
```

## Deployment

This app is configured for deployment using Codemagic CI/CD.

## License

[MIT](LICENSE)