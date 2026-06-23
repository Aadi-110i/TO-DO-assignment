# Nexus — React + Node.js Multi-Page Todo App

> A full-stack task management application built with **React (Vite MPA)** + **Node.js/Express**, featuring real-time CRUD, filtering, priorities, categories, and inline editing.

---

## 📋 Table of Contents

- [Architecture](#architecture)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [API Reference](#api-reference)
- [Documentation](#documentation)

---

## Architecture

This is a **true Multi-Page Application (MPA)** — it does **not** use React Router or client-side navigation. Instead, Vite is configured with two separate HTML entry points, each bundled independently:

| Page | URL | File | Description |
|---|---|---|---|
| Todo List | `/` | `index.html` → `App.jsx` | Lists all todos, add/filter/delete |
| Todo Detail | `/todo.html?id=<id>` | `todo.html` → `TodoApp.jsx` | Single todo view & edit |

Navigating between the two pages triggers a **full browser page reload**, satisfying the non-SPA requirement.

```
Browser
  ├── GET /               → index.html  → React App (list)
  └── GET /todo.html?id=X → todo.html   → React App (detail)
              │
              ▼ (HTTP API calls)
        Express Backend (port 3000)
              │
              ▼
          todos.json (file-based persistence)
```

---

## Features

See **[docs/FEATURES.md](docs/FEATURES.md)** for the full feature breakdown.

**Highlights:**
- ✅ Add tasks with title, description, category, and priority
- ✅ Filter by status (All / Active / Done) and by category or priority
- ✅ Mark tasks complete/incomplete with live progress bar
- ✅ Click any task to open its dedicated detail page
- ✅ Full inline editing on the detail page (edit all fields)
- ✅ Delete tasks from both the list and detail pages
- ✅ Data persisted in `backend/todos.json`

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite 8 (MPA mode) |
| HTTP Client | Axios |
| Backend | Node.js, Express 5 |
| Data Store | JSON file (`todos.json`) |
| Styling | Vanilla CSS (custom design system) |

---

## Project Structure

```
react-node-todo/
├── backend/
│   ├── server.js         # Express app — all CRUD routes
│   ├── todos.json        # Persistent data store
│   └── package.json
├── frontend/
│   ├── index.html        # Entry point → Todo list page
│   ├── todo.html         # Entry point → Single todo detail page
│   ├── vite.config.js    # MPA rollup input configuration
│   ├── src/
│   │   ├── main.jsx      # Mounts App into index.html
│   │   ├── todo.jsx      # Mounts TodoApp into todo.html
│   │   ├── App.jsx       # Todo list page component
│   │   ├── TodoApp.jsx   # Single todo detail/edit component
│   │   ├── index.css     # Full design system (dark theme)
│   │   └── App.css
│   └── package.json
└── docs/
    ├── FEATURES.md       # All features documented
    ├── API.md            # Full backend API reference
    └── ARCHITECTURE.md   # Architecture deep-dive
```

---

## Getting Started

### Prerequisites

- Node.js ≥ 18
- npm ≥ 9

### 1. Start the Backend

```bash
cd backend
npm install
node server.js
```

The backend runs on **http://localhost:3000**.

### 2. Start the Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend dev server runs on **http://localhost:5173**.

Open **http://localhost:5173** for the todo list page.  
Navigate to **http://localhost:5173/todo.html?id=\<id\>** for a single todo's detail page (IDs are shown in the list URLs when you click a task).

---

## API Reference

See **[docs/API.md](docs/API.md)** for the full API documentation.

**Quick reference:**

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/todos` | Fetch all todos |
| `GET` | `/api/todos/:id` | Fetch a single todo by ID |
| `POST` | `/api/todos` | Create a new todo |
| `PUT` | `/api/todos/:id` | Update a todo (partial or full) |
| `DELETE` | `/api/todos/:id` | Delete a todo |

---

## Documentation

| File | Contents |
|---|---|
| [docs/FEATURES.md](docs/FEATURES.md) | Complete feature documentation |
| [docs/API.md](docs/API.md) | API endpoints, request/response schemas, examples |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | Architecture, data model, design decisions |
