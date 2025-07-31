# CODTECH Real-Time Chat Server

A Node.js backend project using Socket.IO and MongoDB to support multiple chat rooms with real-time communication.

## Features

- Join/leave chat rooms
- Send and receive messages in real time
- Automatically loads chat history from MongoDB
- Easily test using included frontend HTML

## Getting Started

1. Clone or download the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file and add:
   ```
   MONGO_URI=mongodb://localhost:27017/codtech-chat
   ```
4. Start the server:

   ```
   node index.js
   ```

5. Open `public/index.html` in a web browser to start chatting

## Tech Stack

- Node.js
- Express.js
- Socket.IO
- MongoDB + Mongoose
