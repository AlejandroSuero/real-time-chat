# 💬 Real time chat application

This application will display messages from users on the client, where all users can interact with
each other at the same time.

For real time interaction, I will be using [NodeJS](https://nodejs.org/) and [WebSockets](https://wikipedia.org/wiki/WebSocket), specifically, [socket.io](https://socket.io/).

## 🛠️ Features

- Server:
  - TypeScript
  - [express](https://expressjs.com/)
  - [socket.io](https://socket.io/)
  - Database:
    - libSQL, a SQLite fork from [turso](https://turso.tech/)
- Client:
  - HTML
  - CSS
  - JavaScript

## 🤔 How to use

### 🏠 Locally

Clone the repository and build the application.

In order to do it, you will need to have installed:

- [Git](https://git-scm.com/)
- [Node](https://nodejs.org/)

Create an account in [turso](https://turso.tech/) and create a database, more info in the [docs](https://docs.turso.tech/)

Then, open your terminal and execute this commands:

```bash
git clone https://github.com/AlejandroSuero/real-time-chat.git
cd real-time-chat
# inside real-time-chat directory
# create a .env file to store your DB information
touch .env
npm install
npm run build
npm start
```

> NOTE: check the [.env.example](https://github.com/AlejandroSuero/real-time-chat/blob/main/.env.example)
> to store your DB information

Then go to http://localhost:3000/ and follow enjoy your chats with other people.

### 🛜 On the site

It is just a chat application, you can view other people messages, write your own messages and enjoy your time there 😊
