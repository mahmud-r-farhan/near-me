# Near-Me Application

## Overview
The **Near-Me** application is a real-time, location-sharing platform that enables users to view each other's positions on an interactive map using **Leaflet**. The app offers secure user authentication with **JWT tokens**, data protection using **bcryptjs**, and real-time communication via **Socket.IO**. This application is built with the **MERN** stack (MongoDB, Express, Node.js), and it features an offline mode for map viewing, powered by **Leaflet**.

## Features
- **User Authentication**: Register and login with username, email, name, and password, securely stored in **MongoDB** with **bcryptjs** encryption.
- **JWT Token Authentication**: Secure token-based authentication using **jsonwebtoken** (JWT).
- **Real-Time Location Sharing**: See real-time updates of user locations via **Socket.IO** and the **Leaflet** map.
- **Offline Map Mode**: Map still works without an internet connection after initial load.
- **Multiple User Support**: Real-time updates and location management for multiple users.
- **Security Focused**: Passwords are hashed, and sensitive information is stored securely.
- **Environment Variables**: Uses a `.env` file to manage sensitive data such as PORT, MongoDB URI, and JWT secret.

## Technologies
- **JavaScript (Node.js)**: Main programming language.
- **Express**: Backend framework.
- **MongoDB**: Database to store user information.
- **Socket.IO**: Real-time communication between users.
- **Leaflet**: JavaScript library for interactive maps.
- **bcryptjs**: For password encryption.
- **dotenv**: To handle environment variables.
- **jsonwebtoken (JWT)**: Token-based authentication.
- **Nodemon**: Development tool to automatically restart the server on changes.

## Setup

### Prerequisites
- **Node.js** installed on your machine.
- **MongoDB** installed or access to MongoDB Atlas.

### Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/mahmud-r-farhan/near-me.git
   cd near-me


2. Install dependencies:

    `npm install`


3. Create a .env file in the root directory and add the following environment variables:

   `PORT=your_port_number
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret`


4. Start the application:
   * For production:
        `npm start`
   * For development (with nodemon):
        `nodemon app.js`

   #  How it Works
    * User Authentication: Users register with an email, username, name, and password. The password is encrypted using bcryptjs before saving to the database. On login, a JWT token is issued, which is used to authenticate the user on each request.
    
    * Real-Time Location Sharing: After logging in, the user's real-time location is shared with others on the map using Socket.IO. When a user moves, their location is updated for all other users on the map in real-time.
    
    * Offline Mode: The Leaflet map supports offline usage. Once loaded, the map tiles are cached, allowing users to view the map without an active internet connection.
    
    * Security: Passwords are hashed using bcryptjs for secure storage. JWT tokens are used for stateless authentication, protecting routes from unauthorized access. Sensitive data such as the MongoDB URI and JWT secret are stored in environment variables.

# Scripts

* `npm start`: Starts the server.
* `nodemon` app.js: Starts the server in development mode with auto-reloading.


# License

This project is licensed under the MIT License.

# Contribution

Feel free to contribute by submitting a pull request. For major changes, please open an issue first to discuss what you would like to change.

# Contact

For any inquiries or suggestions, please reach out to farhanstack.dev@gmail.com.