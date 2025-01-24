# Uber Clone Backend

This is the backend for the Uber Clone application. It provides APIs for user authentication, ride booking, driver management, and more.

## Features

- User authentication and authorization
- Ride booking and management
- Driver management
- Real-time location tracking
- Payment processing

## Technologies Used

- Node.js
- Express.js
- MongoDB
- Socket.io
- JWT for authentication

## Getting Started

### Prerequisites

- Node.js installed
- MongoDB installed and running

### Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/vivekCreates/uber-clone.git
    ```
2. Navigate to the project directory:
    ```bash
    cd uber-clone
    ```
3. Install dependencies:
    ```bash
    npm install
    ```

### Configuration

1. Create a `.env` file in the root directory and add the following environment variables:
    ```plaintext
    PORT=8000
    MONGODB_URI=your_mongodb_uri
    JWT_SECRET=your_jwt_secret
    ```

### Running the Application

1. Start the server:
    ```bash
    npm run dev
    ```
2. The server will be running on `http://localhost:8000`.

