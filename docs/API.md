# API Reference

The backend is a **Node.js + Express** REST API running on port `3000`. All responses are in JSON. Data is persisted to `backend/todos.json`.

**Base URL:** `http://localhost:3000`

---

## Endpoints

### `GET /api/todos`

Fetch all todos, newest first.

**Request:** No body or parameters required.

**Response `200 OK`:**
```json
[
  {
    "id": "1719000000001",
    "title": "Buy groceries",
    "description": "Milk, eggs, bread",
    "category": "personal",
    "priority": "low",
    "completed": false,
    "createdAt": 1719000000001,
    "doneAt": null
  },
  {
    "id": "1719000000000",
    "title": "Finish the report",
    "description": "",
    "category": "work",
    "priority": "high",
    "completed": true,
    "createdAt": 1719000000000,
    "doneAt": 1719003600000
  }
]
```

Returns an empty array `[]` if no todos exist.

---

### `GET /api/todos/:id`

Fetch a single todo by its ID.

**URL Parameter:**
| Param | Type | Description |
|---|---|---|
| `id` | `string` | The todo's unique ID |

**Response `200 OK`:**
```json
{
  "id": "1719000000000",
  "title": "Finish the report",
  "description": "Include Q2 data and charts.",
  "category": "work",
  "priority": "high",
  "completed": false,
  "createdAt": 1719000000000,
  "doneAt": null
}
```

**Response `404 Not Found`:**
```json
{ "error": "Not found" }
```

---

### `POST /api/todos`

Create a new todo.

**Request Body (JSON):**
| Field | Type | Required | Default | Description |
|---|---|---|---|---|
| `title` | `string` | ✅ Yes | — | The task title |
| `description` | `string` | No | `""` | Optional notes |
| `category` | `string` | No | `"other"` | `work` \| `personal` \| `health` \| `other` |
| `priority` | `string` | No | `"medium"` | `high` \| `medium` \| `low` |

**Example Request:**
```json
{
  "title": "Prepare slides",
  "description": "For the Monday all-hands meeting",
  "category": "work",
  "priority": "high"
}
```

**Response `201 Created`:**
```json
{
  "id": "1719007200000",
  "title": "Prepare slides",
  "description": "For the Monday all-hands meeting",
  "category": "work",
  "priority": "high",
  "completed": false,
  "createdAt": 1719007200000,
  "doneAt": null
}
```

**Response `400 Bad Request`** (missing title):
```json
{ "error": "Title required" }
```

---

### `PUT /api/todos/:id`

Update an existing todo. All fields are optional — only the fields provided in the body are updated.

**URL Parameter:**
| Param | Type | Description |
|---|---|---|
| `id` | `string` | The todo's unique ID |

**Request Body (JSON) — all fields optional:**
| Field | Type | Description |
|---|---|---|
| `title` | `string` | Updated title |
| `description` | `string` | Updated notes |
| `category` | `string` | Updated category |
| `priority` | `string` | Updated priority |
| `completed` | `boolean` | Updated completion status |

**Special logic for `doneAt`:**
- When `completed` transitions from `false` → `true`, `doneAt` is automatically set to the current timestamp.
- When `completed` transitions from `true` → `false`, `doneAt` is reset to `null`.

**Example Request** (toggle complete):
```json
{ "completed": true }
```

**Response `200 OK`:** Returns the full updated todo object.
```json
{
  "id": "1719007200000",
  "title": "Prepare slides",
  "description": "For the Monday all-hands meeting",
  "category": "work",
  "priority": "high",
  "completed": true,
  "createdAt": 1719007200000,
  "doneAt": 1719010800000
}
```

**Response `404 Not Found`:**
```json
{ "error": "Not found" }
```

---

### `DELETE /api/todos/:id`

Delete a todo permanently.

**URL Parameter:**
| Param | Type | Description |
|---|---|---|
| `id` | `string` | The todo's unique ID |

**Response `204 No Content`:** Empty body. Deletion successful.

**Response `404 Not Found`:**
```json
{ "error": "Not found" }
```

---

## Error Codes Summary

| Status | Meaning |
|---|---|
| `200` | OK — request succeeded, data returned |
| `201` | Created — new todo created successfully |
| `204` | No Content — deletion successful |
| `400` | Bad Request — missing required field (`title`) |
| `404` | Not Found — no todo with that ID exists |

---

## CORS

The backend uses the `cors` middleware with default settings, which allows requests from any origin. This enables the Vite dev server (running on `localhost:5173`) to call the Express API (running on `localhost:3000`) without CORS errors.
