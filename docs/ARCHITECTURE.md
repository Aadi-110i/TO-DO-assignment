# Architecture

This document explains the technical architecture, design decisions, data flow, and folder structure of the Nexus Todo App.

---

## Overview

Nexus is a **full-stack Todo application** with a clear separation between frontend and backend:

| Tier | Technology | Port |
|---|---|---|
| Frontend | React 19 + Vite (MPA) | `5173` (dev) |
| Backend | Node.js + Express 5 | `3000` |
| Data | JSON file (`todos.json`) | — |

---

## Why Multi-Page Application (MPA)?

The assignment requirement was **multiple pages, not a Single-Page Application (SPA)**. In a traditional SPA (like one built with React Router), there is only one `index.html` and the browser never actually navigates — React intercepts URL changes and swaps components.

To satisfy the true multi-page requirement, this app uses **Vite's MPA (Multi-Page Application) mode**:

```js
// vite.config.js
rollupOptions: {
  input: {
    main: resolve(__dirname, 'index.html'),
    todo: resolve(__dirname, 'todo.html'),
  },
},
```

This produces two **independent HTML + JS bundles**. When a user clicks a task title and the browser navigates from `/` to `/todo.html?id=123`, it performs a **full HTTP request** and loads a completely different HTML document and React root. There is **no shared React state** between pages — each page starts fresh.

---

## Frontend Architecture

```
frontend/
├── index.html          ← Page 1 shell (loads main.jsx)
├── todo.html           ← Page 2 shell (loads todo.jsx)
└── src/
    ├── main.jsx        ← createRoot for Page 1
    ├── App.jsx         ← Page 1 component tree (todo list)
    ├── todo.jsx        ← createRoot for Page 2
    ├── TodoApp.jsx     ← Page 2 component tree (detail/edit)
    └── index.css       ← Shared design system (CSS variables, dark theme)
```

### Page 1 — `App.jsx`

Responsibilities:
- Fetches all todos from `GET /api/todos` on mount
- Manages local UI state: filter selection, form fields, expanded/collapsed add form
- Renders the add-task form, progress bar, filter bar, and two todo lists (active + done)
- All mutations (toggle, delete, create) call the API and then re-fetch to sync state

### Page 2 — `TodoApp.jsx`

Responsibilities:
- Reads `?id=` from `window.location.search` on mount
- Fetches the specific todo from `GET /api/todos/:id`
- Renders View Mode: full todo details with quick-toggle and delete
- Renders Edit Mode: a form to update all fields, wired to `PUT /api/todos/:id`
- On delete, redirects back to `/`

---

## Backend Architecture

```
backend/
├── server.js     ← All Express routes + file I/O helpers
├── todos.json    ← JSON array — the entire data store
└── package.json
```

The backend is intentionally simple — a single `server.js` with:

- **`readTodos()`** — reads and parses `todos.json` on every request (ensures no stale in-memory state)
- **`writeTodos(todos)`** — serialises and writes the updated array back to disk

This synchronous file I/O approach is suitable for a local development / assignment context. In a production system, this would be replaced with a proper database (e.g. PostgreSQL, MongoDB).

### Route Table

| Method | Path | Handler |
|---|---|---|
| `GET` | `/api/todos` | Return all todos |
| `GET` | `/api/todos/:id` | Find by ID, 404 if not found |
| `POST` | `/api/todos` | Validate title, create with generated ID |
| `PUT` | `/api/todos/:id` | Partial update, auto-manage `doneAt` |
| `DELETE` | `/api/todos/:id` | Filter out by ID, 404 if not found |

---

## Data Model

Todos are stored as a JSON array. Each object:

```json
{
  "id": "1719000000000",
  "title": "Task title",
  "description": "Optional notes",
  "category": "work | personal | health | other",
  "priority": "high | medium | low",
  "completed": false,
  "createdAt": 1719000000000,
  "doneAt": null
}
```

**ID generation**: `Date.now().toString()` — a Unix millisecond timestamp as a string. This is collision-safe for a single-user local app.

**`doneAt` logic**: Automatically managed by the PUT handler:
- `false → true`: sets `doneAt = Date.now()`
- `true → false`: resets `doneAt = null`
- No change to completed: preserves existing `doneAt`

---

## Data Flow Diagram

```
User Action (e.g. "Add Task")
        │
        ▼
  App.jsx (React)
   handleAdd()
        │
        ▼ POST /api/todos {title, description, category, priority}
  Express (server.js)
   readTodos() → append new todo → writeTodos()
        │
        ▼ 201 Created {todo object}
  App.jsx
   fetchTodos() → setTodos([...])
        │
        ▼
  React re-renders task list
```

---

## Design Decisions

| Decision | Rationale |
|---|---|
| MPA over SPA | Satisfies the assignment requirement for true multi-page navigation |
| File-based storage (`todos.json`) | Zero-dependency persistence — no database setup needed |
| Vite as build tool | Fast HMR, native ES modules, excellent React support, trivial MPA config |
| Axios for HTTP | Cleaner API than `fetch`, consistent error handling |
| Synchronous file I/O | Acceptable for local/dev use; eliminates async complexity in a simple server |
| No authentication | Out of scope for this assignment |

---

## Running in Development

Both servers must be running simultaneously:

**Terminal 1 — Backend:**
```bash
cd backend
node server.js
# → Listening on http://localhost:3000
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm run dev
# → Vite dev server on http://localhost:5173
```

The Vite dev server proxies nothing — all API calls are made directly to `http://localhost:3000` via Axios. CORS is enabled on the Express server to allow this.
