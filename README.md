# React + Node Multi-Page Todo App

This is a multi-page Todo application built with React, Node.js, and Express.

## Architecture

- **Backend (`/backend`)**: A Node.js + Express.js REST API that stores todos in a local `todos.json` file.
- **Frontend (`/frontend`)**: A React application configured with Vite to act as a **Multi-Page Application (MPA)**. It does not use client-side routing (like React Router) to simulate pages. Instead, it has two actual HTML entry points:
  - `index.html` -> Loads `src/main.jsx` and `App.jsx`
  - `todo.html` -> Loads `src/todo.jsx` and `TodoApp.jsx`

Navigating between the list and the single todo item triggers a full page reload, fulfilling the non-SPA requirement.

## Features

- **Multi-Page Navigation**: True MPA architecture using Vite's `rollupOptions.input`.
- **Todos List Page** (`/`):
  - View all todos
  - Add new todos with a title and optional description
  - Toggle completion status
  - Delete todos
  - Click on a todo title to navigate to its dedicated page
- **Single Todo Page** (`/todo.html?id=...`):
  - Reads the `id` from the URL query parameters
  - Fetches the specific todo from the backend
  - Displays full details: Title, Description, Completion Status, and Creation Date
- **Backend API**:
  - `GET /api/todos` - Fetch all
  - `GET /api/todos/:id` - Fetch single
  - `POST /api/todos` - Create
  - `PUT /api/todos/:id` - Update
  - `DELETE /api/todos/:id` - Delete
- **Data Persistence**: Saves data to `backend/todos.json`.

## How to Run

### 1. Start the Backend
```bash
cd backend
npm install
node server.js
```
The backend will run on `http://localhost:3000`.

### 2. Start the Frontend
```bash
cd frontend
npm install
npm run dev
```
The frontend will run on `http://localhost:5173`. Open this URL in your browser.
