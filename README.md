# Temple Management System Frontend

A React-based frontend for the Temple Management System.

## Features

- Manage devotees and their information
- Schedule and track temple events and ceremonies
- Record and manage donations and financial records
- Responsive design for desktop and mobile devices

## Technologies Used

- React
- React Router for navigation
- React Bootstrap for UI components
- Axios for API communication

## Getting Started

### Prerequisites

- Node.js and npm installed on your machine

### Installation

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm start
```

The application will be available at `http://localhost:3000`.

## Project Structure

- `src/components/devotees/` - Components for devotee management
- `src/components/events/` - Components for event management
- `src/components/donations/` - Components for donation management
- `src/services/` - API services and utilities

## Available Scripts

- `npm start`: Start the development server
- `npm build`: Build the app for production
- `npm test`: Run tests
- `npm eject`: Eject from Create React App

## Backend API

The frontend connects to a Node.js/Express backend at `http://localhost:5000/api/`.
The backend uses MongoDB with the 'temple' collection for data storage.

Make sure the backend server is running before starting the frontend application.

## Starting the Application

1. Start the backend:
   ```bash
   cd ../backend
   npm run dev
   ```

2. In a separate terminal, start the frontend:
   ```bash
   cd ../frontend
   npm start
   ```

3. To initialize the database with sample data:
   ```bash
   cd ../backend
   npm run init-db
   ```
