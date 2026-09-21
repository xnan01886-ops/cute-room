# Strawberry

A small, private AI chat app in progress. Strawberry's companion is **Null**, with a soft pink, warm, quiet visual direction.

## Frontend preview

The original React + Vite chat now includes a soft pink scrapbook homepage and an independent princess-room module. No new runtime dependencies were added. There is no AI model connection, database, authentication, or long-term memory yet.

- Home: calendar card, illustrated profile cards, daily note, and module shortcuts.
- Room: original SVG isometric furniture, pointer dragging, zoom buttons, reset, lamp toggle, blanket color toggle, and furniture descriptions. This is a fixed-angle 2.5D illustration, not a freely rotating 3D model. Pinch zoom is not implemented.
- Chat: local message composer with Chinese IME-safe Enter sending, Shift+Enter line breaks, and automatic scroll.
- Settings: ribbon, cream, and berry bubble styles.
- Collections: editable reading/watch lists with completion and removal, and a session-only diary.
- Music: select and play a local audio file; nothing is uploaded. Playback stops when the dialog closes.
- Responsive desktop sidebar and mobile bottom navigation; keyboard-accessible controls and dialogs.

Chat, bubble style, diary, and lists remain available while switching tabs but reset on reload. Room view and furniture state reset when leaving the room. All artwork is code-native SVG/CSS; no reference screenshots, third-party portraits, or external media are bundled.

### Try this branch on Windows

From the existing `cute-room` folder (leave local changes intact; do not force checkout):

```powershell
git fetch origin
git switch strawberry-princess-room
cd frontend
npm install
npm run dev
```

If a Vite process is already using port 5173, stop it with Ctrl+C first or open the new URL printed by Vite.

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
│   │   ├── Room.jsx
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
