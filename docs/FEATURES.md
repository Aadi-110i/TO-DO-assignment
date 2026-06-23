# Features & Functionality

This document describes every feature of the Nexus Todo App — both on the **Todo List page** and the **Single Todo Detail page**.

---

## Page 1 — Todo List (`/`)

### 1. Add a Task

Located in the **"Add Task"** section at the top of the page.

- **Title field** (required): The main task name. Always visible.
- **Expand toggle (chevron button)**: Click the chevron `⌄` next to the title input, or simply click into the title field, to reveal additional fields:
  - **Description / Notes** (optional): A multi-line textarea for extra context, steps, or notes related to the task.
  - **Category** (select): Classify the task — `Work`, `Personal`, `Health`, or `Other`.
  - **Priority** (select): Set urgency — `High`, `Medium`, or `Low`. Each priority level is colour-coded throughout the app.
- **Add Task button**: Submits the form. Sends a `POST /api/todos` request. On success, the list refreshes and the form resets.

**Validation**: The title field is required. Submitting with an empty title does nothing.

---

### 2. Completion Progress Bar

A horizontal progress bar below the Add Task form shows the **percentage of all todos that are completed**.

- The percentage label updates in real time as tasks are toggled.
- The bar fills from left to right proportional to completion rate.
- Shows `0%` when no todos exist or all are pending.

---

### 3. Filter Bar

A row of filter buttons lets you narrow the visible task list without deleting or modifying any data.

| Filter | What it shows |
|---|---|
| **All** | Every todo |
| **Active** | Todos not yet completed |
| **Done** | Completed todos |
| **Work** | Todos with category = Work |
| **Personal** | Todos with category = Personal |
| **Health** | Todos with category = Health |
| **High** | Todos with priority = High |

Each button shows a **count badge** reflecting the number of matching todos.  
The active filter button is visually highlighted.

---

### 4. Todo List — Active Tasks

Todos that are **not completed** appear in the main list section.

Each task card displays:
- **Checkbox**: Click to mark the task as completed. Sends `PUT /api/todos/:id` with `{ completed: true }`. The task moves to the "Completed" section.
- **Title (clickable link)**: Clicking the title navigates to `/todo.html?id=<id>` — the dedicated detail page for that task. This is a real browser navigation (full page load).
- **Description preview** (if set): A truncated one-line preview of the description is shown beneath the title.
- **Category badge**: Colour-coded pill showing the task's category.
- **Priority badge**: Colour-coded pill showing the task's priority.
- **Delete button (trash icon)**: Sends `DELETE /api/todos/:id`. Removes the task immediately and refreshes the list. The task cannot be recovered after deletion.

---

### 5. Todo List — Completed Tasks

Completed tasks appear in a separate **"Completed"** section below the active tasks.

Each completed card displays:
- **Checked checkbox**: Click to mark the task as *incomplete* again (uncheck). Sends `PUT /api/todos/:id` with `{ completed: false }`. Task moves back to the active section.
- **Title** (strikethrough styling, still clickable).
- **Description preview** (if set).
- **Category badge**.
- **Priority badge**.
- **Completion timestamp badge**: Shows when the task was completed (relative time, e.g. "2h ago", "yesterday", or a date).
- **Delete button**.

---

### 6. Empty State

When no tasks match the current filter, a friendly empty state is shown with an icon and message prompting the user to add a task or switch filters.

---

## Page 2 — Single Todo Detail (`/todo.html?id=<id>`)

Accessed by clicking a task title on the list page, or by navigating directly to the URL with a valid `id` query parameter.

### 7. View Mode

Displays full details for the selected todo:

| Field | Description |
|---|---|
| **Title** | Shown as the page heading |
| **Created At** | Human-readable creation timestamp |
| **Status** | "✓ Completed (date)" or "○ Pending" |
| **Category** | Colour-coded badge |
| **Priority** | Colour-coded badge; card left-border colour matches priority |
| **Notes & Description** | Full multi-line description; shows "No description added" placeholder if empty |

---

### 8. Quick Toggle Complete (on Detail Page)

A **"Mark Complete" / "Mark Incomplete"** button sits next to the status badge.

- Sends `PUT /api/todos/:id` with the toggled `completed` value.
- Updates the page in real time without any navigation.

---

### 9. Inline Edit Mode

Clicking **"Edit Task"** switches the card to an editable form — same page, no navigation.

Editable fields:
- **Title** (required, text input)
- **Notes & Description** (optional, resizable textarea)
- **Category** (select: Work / Personal / Health / Other)
- **Priority** (select: High / Medium / Low)
- **Completion Status** (checkbox: "Mark as completed")

**Save Changes**: Sends `PUT /api/todos/:id` with all updated fields. On success:
- The view switches back to View Mode.
- A green **"Changes saved successfully!"** banner appears for 2.5 seconds.
- All displayed fields reflect the updated values.

**Cancel**: Discards all edits and returns to View Mode without making any API call.

---

### 10. Delete from Detail Page

A **"Delete"** button (with trash icon) on the detail page sends `DELETE /api/todos/:id`.

- A confirmation dialog appears before deletion.
- On confirmation, the todo is deleted and the user is redirected to the Todo List page (`/`).

---

### 11. Navigation

Both pages include a **navigation bar** with:
- The **Nexus brand logo** (links to `/`).
- The detail page also shows a **"← Back to List"** button to return to the list without changes.

---

### 12. Error Handling

- If `/todo.html` is accessed without an `id` query parameter, an error message is displayed.
- If the `id` does not match any todo in the database, a "Todo not found" error is shown.
- Both error states include a "Back to Home" link.

---

## Data Model

Each todo object stored in `todos.json` has the following shape:

```json
{
  "id": "1719000000000",
  "title": "Finish the assignment",
  "description": "Complete all CRUD endpoints and documentation.",
  "category": "work",
  "priority": "high",
  "completed": false,
  "createdAt": 1719000000000,
  "doneAt": null
}
```

| Field | Type | Description |
|---|---|---|
| `id` | `string` | Unix timestamp string (unique) |
| `title` | `string` | Task title (required) |
| `description` | `string` | Optional notes |
| `category` | `string` | `work` \| `personal` \| `health` \| `other` |
| `priority` | `string` | `high` \| `medium` \| `low` |
| `completed` | `boolean` | Completion status |
| `createdAt` | `number` | Unix timestamp (ms) of creation |
| `doneAt` | `number \| null` | Unix timestamp (ms) when completed, or `null` |
