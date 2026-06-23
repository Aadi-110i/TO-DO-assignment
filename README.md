# Todo App

A multi-page todo application built with React (frontend) and Node.js/Express (backend).

This is NOT a single page application. Each page is a separate HTML file with its own React entry point. Navigating between pages triggers a full browser page load.

## Pages

1. **Tasks List** (`/`) - Main page. Shows all todos with filters (all, active, done, by category, by priority). Each task links to its detail page.
2. **Single Todo** (`/todo.html?id=<id>`) - Shows full details of a single todo. Supports inline editing, toggling completion, deleting, and a built-in Pomodoro timer.
3. **Add Task** (`/add.html`) - Form to create a new todo with title, description, category, priority, and due date.
4. **Completed** (`/completed.html`) - Lists all completed tasks. Allows reopening or deleting individual tasks, or clearing all at once.
5. **Stats** (`/stats.html`) - Dashboard showing total/active/completed counts, completion percentage, category and priority breakdowns, and overdue task warnings.

## Features

- Create, read, update, delete todos (full CRUD)
- Mark todos as complete/incomplete
- Filter by status (all, active, done), category (work, personal, health, other), or priority (high)
- Task categories: Work, Personal, Health, Other
- Task priorities: High, Medium, Low
- Optional due date with overdue detection
- Optional description/notes per task
- Pomodoro timer on the single todo page (25min focus / 5min break)
- Tracks completed pomodoro count per task
- Inline editing on the single todo page
- Progress bar showing completion percentage
- Stats page with category and priority breakdowns
- Light color theme
- Data persisted to a JSON file on the server

## Tech Stack

- Frontend: React, Vite (multi-page build), Axios
- Backend: Node.js, Express, CORS
- Storage: JSON file (todos.json)

## How to Run

### Backend

```
cd backend
npm install
node server.js
```

Runs on http://localhost:3000.

### Frontend

```
cd frontend
npm install
npm run dev
```

Runs on http://localhost:5173.

Open http://localhost:5173 in your browser. Make sure the backend is running first.

## Project Structure

```
backend/
  server.js        - Express server with CRUD API
  todos.json       - Data file (auto-created)
  package.json

frontend/
  index.html       - Tasks list page entry
  todo.html        - Single todo page entry
  add.html         - Add task page entry
  completed.html   - Completed tasks page entry
  stats.html       - Stats page entry
  vite.config.js   - Vite config with multi-page input
  src/
    main.jsx       - Entry for index.html
    todo.jsx       - Entry for todo.html
    add.jsx        - Entry for add.html
    completed.jsx  - Entry for completed.html
    stats.jsx      - Entry for stats.html
    App.jsx        - Tasks list component
    TodoApp.jsx    - Single todo detail component
    AddTask.jsx    - Add task form component
    CompletedPage.jsx - Completed tasks component
    StatsPage.jsx  - Stats dashboard component
    Navbar.jsx     - Shared navigation component
    index.css      - Shared styles
```
