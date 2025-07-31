# Real-Time Chat Server

This is a real-time chat server built with Node.js, Express, Socket.IO, and MongoDB. It supports user authentication, multiple chat rooms, and persists chat history.

## Features

- **User Authentication**: Secure user registration and login using JWT.
- **Multiple Chat Rooms**: Users can join different chat rooms.
- **Real-Time Messaging**: Instant message delivery using Socket.IO.
- **Chat History**: Automatically loads previous messages from MongoDB when a user joins a room.
- **Simple Frontend**: Includes a basic HTML frontend for testing and interaction.

## Tech Stack

- **Backend**: Node.js, Express.js
- **Real-Time Communication**: Socket.IO
- **Database**: MongoDB with Mongoose
- **Authentication**: JSON Web Tokens (JWT), bcryptjs
- **Middleware**: CORS, body-parser

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB

### Installation

1.  Clone the repository:

    ```sh
    git clone https://github.com/your-username/chat-server.git
    cd chat-server
    ```

2.  Install dependencies:

    ```sh
    npm install
    ```

3.  Create a `.env` file in the root directory and add the following environment variables:

    ```
    MONGO_URI=mongodb://localhost:27017/codtech-chat
    JWT_SECRET=your_jwt_secret
    PORT=3000
    ```

4.  Start the server:

    ```sh
    npm start
    ```

    or for development with nodemon:

    ```sh
    npm run dev
    ```

5.  Open `public/index.html` in your web browser to use the chat application.

## API Endpoints

### User Routes

- `POST /api/register`

  - Registers a new user.
  - **Request Body**: `{ "username": "testuser", "password": "password123" }`
  - **Response**: `{ "message": "User registered successfully" }`

- `POST /api/login`
  - Logs in an existing user.
  - **Request Body**: `{ "username": "testuser", "password": "password123" }`
  - **Response**: `{ "token": "your_jwt_token", "username": "testuser" }`

## Socket.IO Events

- **Connection**: A user connects to the server. Requires a valid JWT token in the `auth` object.

  ```javascript
  const socket = io({
    auth: {
      token: 'your_jwt_token',
    },
  });
  ```

- **joinRoom**: A user joins a specific chat room.

  - **Payload**: `roomName` (e.g., "general")

- **chatMessage**: A user sends a message to a room.

  - **Payload**: `{ room: "roomName", message: "Hello, world!" }`

- **roomHistory**: The server sends the chat history for a room to the user who just joined.

  - **Payload**: `Array of message objects`

- **disconnect**: A user disconnects from the server.

## Folder Structure

```
chat-server/
├── .env
├── .gitignore
├── index.js
├── package-lock.json
├── package.json
├── README.md
├── models/
│   ├── Message.js
│   └── User.js
├── node_modules/
└── public/
    └── index.html
```

## Contributing

Contributions are welcome! Please feel free to submit a pull request.

1.  Fork the repository.
2.  Create your feature branch (`git checkout -b feature/your-feature`).
3.  Commit your changes (`git commit -m 'Add some feature'`).
4.  Push to the branch (`git push origin feature/your-feature`).
5.  Open a pull request.

## License

This project is licensed under the ISC License.
