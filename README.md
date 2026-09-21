# Strawberry

A small, private AI chat app in progress. Strawberry's companion is **Null**, with a soft pink, warm, quiet visual direction.

## Phase 1

This phase intentionally contains only the project skeleton and a static chat interface. There is no AI model connection, database, authentication, or long-term memory yet.

The message composer works locally in the browser so the static interface can be tried, but messages are not sent to a server and disappear when the page reloads.

## Stack

- Frontend: React + Vite
- Backend: Node.js + Express
- Frontend and backend live in separate directories and run separately.

## Requirements

Install Node.js 20 or newer and npm. Node.js 22 LTS is a good choice.

## Run Strawberry

Clone the repository and enter it:

```bash
git clone https://github.com/xnan01886-ops/cute-room.git
cd cute-room
```

### 1. Start the frontend

In the first terminal:

```bash
cd frontend
npm install
npm run dev
```

Vite prints the local URL in the terminal. By default it is usually:

```text
http://localhost:5173
```

Open that address in your browser to see Strawberry.

### 2. Start the backend

Keep the frontend running. Open a second terminal from the project root and run:

```bash
cd backend
npm install
npm run dev
```

The Express server uses:

```text
http://localhost:3001
```

To check that it is alive, open:

```text
http://localhost:3001/health
```

You should see `{"ok":true}`.

## Project structure

```text
cute-room/
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── config.js
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   └── package.json
├── backend/
│   ├── package.json
│   └── server.js
├── .gitignore
└── README.md
```

## Easy-to-change identity

The app name, AI name, and subtitle are kept in `frontend/src/config.js`.

Current values:

- App: Strawberry
- AI: Null
- Visual direction: soft pink, warm, quiet
- Conversation sidebar: not included in Phase 1
