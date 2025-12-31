# SSE example (Node.js)

This folder contains a minimal Server-Sent Events (SSE) example using Express.

Files:

- `server.js` — Express server exposing `GET /events` which streams a JSON payload every second.

Usage (example only — you said you don't want to run it):

1. Create a folder and add `server.js`.
2. Install dependencies:

```bash
npm install express cors
```

3. Run:

```bash
node server.js
```

Then open an SSE client (or the React example in this repo) and connect to `http://localhost:3000/events`.
