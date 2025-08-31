# Token-Based Authentication API with Refresh Tokens

This project implements a secure authentication system using JSON Web Tokens (JWT). It features short-lived access tokens and long-lived, database-stored refresh tokens to provide a secure and seamless user experience.

This implementation also includes **Refresh Token Rotation**, where a new refresh token is issued every time the old one is used, enhancing security by invalidating the used token.

## ✨ Features

-   User Registration & Login
-   JWT Access Tokens (short-lived, e.g., 15 minutes)
-   JWT Refresh Tokens (long-lived, e.g., 7 days)
-   Secure Password Hashing with `bcryptjs`
-   Protected Routes using Middleware
-   Token Refresh Endpoint to get a new access token without re-login
-   Secure Logout by invalidating the refresh token in the database
-   Refresh Token Rotation for enhanced security
-   Input validation with `express-validator`

## 🛠 Stack

-   **Backend:** Node.js, Express.js
-   **Database:** MongoDB with Mongoose
-   **Authentication:** JSON Web Token (`jsonwebtoken`), `bcryptjs`

## 🚀 Setup & Run

### Prerequisites

-   Node.js (v14 or higher)
-   MongoDB instance (local or cloud like MongoDB Atlas)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/ali-amir-code/t9-token-auth.git
    cd t9-token-auth
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Create a `.env` file** in the root directory and add your environment variables. Use the following template:
    ```ini
    # .env
    PORT=5000
    MONGO_URI=mongodb://localhost:27017/token_auth_db

    ACCESS_TOKEN_SECRET="your-super-secret-access-key-change-it"
    REFRESH_TOKEN_SECRET="your-super-secret-refresh-key-change-it"

    ACCESS_TOKEN_EXPIRY="15m"
    REFRESH_TOKEN_EXPIRY="7d"
    ```

4.  **Start the server:**
    ```bash
    npm start
    ```
    The server will be running at `http://localhost:5000`.

## 📦 API Endpoints & Usage

### Base URL: `http://localhost:5000/api`

#### Authentication

1.  **Register User**
    -   **Endpoint:** `POST /auth/register`
    -   **Body:**
        ```json
        {
          "name": "Ali Amir",
          "email": "ali@example.com",
          "password": "password123"
        }
        ```
    -   **Response (Success):** `201 Created`
        ```json
        {
          "msg": "User registered successfully"
        }
        ```

2.  **Login User & Get Tokens**
    -   **Endpoint:** `POST /auth/login`
    -   **Body:**
        ```json
        {
          "email": "ali@example.com",
          "password": "password123"
        }
        ```
    -   **Response (Success):** `200 OK`
        ```json
        {
          "accessToken": "ey...",
          "refreshToken": "ey..."
        }
        ```

3.  **Refresh Access Token**
    -   **Endpoint:** `POST /auth/refresh-token`
    -   **Body:**
        ```json
        {
          "token": "your-refresh-token-here"
        }
        ```
    -   **Response (Success):** `200 OK` (Note: a new rotated refresh token is also sent)
        ```json
        {
          "accessToken": "ey-new-access-token...",
          "refreshToken": "ey-new-rotated-refresh-token..."
        }
        ```

4.  **Logout User**
    -   **Endpoint:** `POST /auth/logout`
    -   **Body:**
        ```json
        {
          "token": "your-current-refresh-token"
        }
        ```
    -   **Response (Success):** `200 OK`
        ```json
        {
          "msg": "Logged out successfully"
        }
        ```

#### Protected Routes

*These routes require a valid `accessToken` in the Authorization header.*

**Header Format:** `Authorization: Bearer <your-access-token>`

1.  **Get Dashboard Data**
    -   **Endpoint:** `GET /user/dashboard`
    -   **Response (Success):** `200 OK`
        ```json
        {
          "message": "Welcome to the dashboard, Ali Amir!",
          "user": {
            "id": "63e...",
            "email": "ali@example.com",
            "name": "Ali Amir"
          }
        }
        ```

2.  **Update User Profile**
    -   **Endpoint:** `PUT /user/profile`
    -   **Body:**
        ```json
        {
          "name": "Amir Ali"
        }
        ```
    -   **Response (Success):** `200 OK`
        ```json
        {
            "_id": "63e...",
            "name": "Amir Ali",
            "email": "Amir@example.com"
        }
        ```