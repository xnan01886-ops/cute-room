# Strawberry

A small, private AI chat app in progress. Strawberry's companion is **Null**, with a soft pink, warm, quiet visual direction.

## Frontend preview

The original React + Vite chat now includes a soft pink scrapbook homepage and an independent princess-room module. The room uses Three.js, loaded only when the room is opened. There is no AI model connection, database, authentication, or long-term memory yet.

- Home: calendar card, illustrated profile cards, daily note, and module shortcuts.
- Room: a genuinely three-dimensional, original mesh-built princess room named 草莓奶油宫 (editable in the room). All furniture, curtain folds, crystals, books, flowers, plush toys, dishes, and decorations are geometric models, not image billboards. The homepage thumbnail is an actual render of this scene.
- Camera: full horizontal orbit, elevation adjustment, zoom, pan, reset, optional auto-orbit, and automatic wall cutaway. Mouse drag rotates; right-drag pans; wheel zooms. Touch supports one-finger orbit and two-finger zoom/pan. Arrow keys, +/−, and Home also work when the canvas is focused.
- Furniture: independent bedside and chandelier lights, animated air-conditioner louvers/airflow, spinning fan, television, hinged wardrobe doors, and bed curtains. Click furniture directly or use the labeled remote buttons. These are virtual controls, with no connection to real appliances.
- Time: sunrise/day/sunset/night presets, a 24-hour slider, and an optional 100-second full-day cycle. Directional light, sky fill, window color, shadows, and ambient brightness respond to time.
- Lifecycle: animation pauses while the document is hidden, geometry/materials/WebGL resources are released on leaving the room, and reduced-motion preferences disable continuous fan/airflow/auto-orbit animation.
- Chat: local message composer with Chinese IME-safe Enter sending, Shift+Enter line breaks, and automatic scroll.
- Settings: ribbon, cream, and berry bubble styles.
- Collections: editable reading/watch lists with completion and removal, and a session-only diary.
- Music: select and play a local audio file; nothing is uploaded. Playback stops when the dialog closes.
- Responsive desktop sidebar and mobile bottom navigation; keyboard-accessible controls and dialogs.

Chat, bubble style, diary, and lists remain available while switching tabs but reset on reload. Room settings, name and camera view also survive navigation within the same page. Everything resets on refresh. No reference video, reference screenshots, third-party portraits, or third-party furniture models are bundled. WebGL 2 and browser graphics acceleration are required for the 3D view; initialization/context-loss errors offer a retry button.

### Validation

`npm run build` passes. Chromium WebGL checks exercised actual camera orbit, raycast selection of the television mesh, all remote switches, day/night/sunset and the clock cycle, scene disposal/re-entry with retained settings, keyboard orbit, and 320/390px layouts. Additional touch-input checks exercised one-finger rotation and two-finger gestures. Desktop and mobile render captures are in `docs/previews/room-3d-*.png`.

### Try this branch on Windows

From the existing `cute-room` folder (leave local changes intact; do not force checkout):

```powershell
git fetch origin
git switch strawberry-princess-room
git pull --ff-only
cd frontend
npm.cmd install
npm.cmd run dev
```

If a Vite process is already using port 5173, stop it with Ctrl+C first or open the new URL printed by Vite.

The message composer works locally in the browser so the static interface can be tried, but messages are not sent to a server and disappear when the page reloads.

## Stack

- Frontend: React + Vite + Three.js (3D room)
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
│   │   ├── room/
│   │   │   ├── models.js
│   │   │   ├── scene.js
│   │   │   └── room.css
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
