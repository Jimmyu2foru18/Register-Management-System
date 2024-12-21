# Register Management System

## Overview

The Register Management System is a comprehensive application designed to manage retail businesses' inventory, sales,
and user authentication. It features a user-friendly interface for managing products, 
processing transactions, and generating reports. The system is built using a modern tech stack, including 
React for the front end and Laravel for the back end.

## Features

- User authentication with role-based access control (admin, supervisor, employee).
- Product management (CRUD operations).
- Transaction processing with real-time inventory updates.
- Reporting features for sales and inventory.
- Low stock alerts and notifications.
- Responsive design for both desktop and mobile devices.

## Technologies Used

- **Frontend**: React, TypeScript, Tailwind CSS, Recharts
- **Backend**: Laravel, PHP, MySQL
- **Database**: MySQL
- **State Management**: React Context API
- **API**: RESTful API with Laravel Sanctum for authentication
- **Build Tools**: Webpack, Babel

## Project Structure
```bash
register-management-system/
├── frontend/
│ ├── src/
│ │ ├── components/
│ │ ├── pages/
│ │ ├── services/
│ │ ├── hooks/
│ │ ├── context/
│ │ └── utils/
├── backend/
│ ├── app/
│ │ ├── HTTP/
│ │ │ ├── Controllers/
│ │ │ └── Middleware/
│ │ ├── Models/
│ │ ├── Services/
│ │ ├── Repositories/
│ │ └── Interfaces/
│ ├── database/
│ │ └── migrations/
│ └── tests/
└── docker/
```

## Installation

### Prerequisites

- PHP >= 8.0
- Composer
- Node.js >= 14.x
- npm
- MySQL

### Clone the Repository
```bash
git clone https://github.com/Jimmyu2foru18/Register-Management-System.git
```

### Backend Setup

1. Navigate to the backend directory:

   ```bash
   cd backend
   ```

2. Install PHP dependencies:

   ```bash
   composer install
   ```

3. Set up your `.env` file:

   ```bash
   cp .env.example .env
   ```

4. Generate the application key:

   ```bash
   php artisan key: generate
   ```

5. Run migrations:

   ```bash
   php artisan migrate
   ```

### Frontend Setup

1. Navigate to the frontend directory:

   ```bash
   cd ../frontend
   ```

2. Install Node.js dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm start
   ```

### Running the Application

- The backend will run on `http://localhost:8000`.
- The front end will run on `http://localhost:3000`.

## API Endpoints

### Authentication

- **POST** `/API/auth/login`: Log in as a user.
- **POST** `/API/auth/logout`: Log out the authenticated user.
- **GET** `/API/auth/user`: Get the authenticated user's details.

### Products

- **GET** `/API/products`: Get all products.
- **POST** `/API/products`: Create a new product.
- **GET** `/api/products/{id}`: Get a specific product.
- **PUT** `/api/products/{id}`: Update a specific product.
- **DELETE** `/api/products/{id}`: Delete a specific product.

### Transactions

- **POST** `/API/transactions`: Create a new transaction.
- **GET** `/API/transactions`: Get all transactions.
