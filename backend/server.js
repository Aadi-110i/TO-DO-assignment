const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'todos.json');

app.use(cors());
app.use(express.json());

// Helper function to read todos
const readTodos = () => {
    if (!fs.existsSync(DATA_FILE)) {
        fs.writeFileSync(DATA_FILE, JSON.stringify([]));
    }
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(data);
};

// Helper function to write todos
const writeTodos = (todos) => {
    fs.writeFileSync(DATA_FILE, JSON.stringify(todos, null, 2));
};

// GET all todos
app.get('/api/todos', (req, res) => {
    const todos = readTodos();
    res.json(todos);
});

// GET single todo
app.get('/api/todos/:id', (req, res) => {
    const todos = readTodos();
    const todo = todos.find(t => t.id === req.params.id);
    if (todo) {
        res.json(todo);
    } else {
        res.status(404).json({ error: 'Todo not found' });
    }
});

// POST new todo
app.post('/api/todos', (req, res) => {
    const { title, description } = req.body;
    if (!title) return res.status(400).json({ error: 'Title is required' });

    const todos = readTodos();
    const newTodo = {
        id: Date.now().toString(),
        title,
        description: description || '',
        completed: false,
        createdAt: new Date().toISOString()
    };
    todos.push(newTodo);
    writeTodos(todos);
    res.status(201).json(newTodo);
});

// PUT update todo
app.put('/api/todos/:id', (req, res) => {
    const { title, description, completed } = req.body;
    const todos = readTodos();
    const index = todos.findIndex(t => t.id === req.params.id);

    if (index !== -1) {
        todos[index] = {
            ...todos[index],
            title: title !== undefined ? title : todos[index].title,
            description: description !== undefined ? description : todos[index].description,
            completed: completed !== undefined ? completed : todos[index].completed
        };
        writeTodos(todos);
        res.json(todos[index]);
    } else {
        res.status(404).json({ error: 'Todo not found' });
    }
});

// DELETE todo
app.delete('/api/todos/:id', (req, res) => {
    const todos = readTodos();
    const filteredTodos = todos.filter(t => t.id !== req.params.id);

    if (todos.length !== filteredTodos.length) {
        writeTodos(filteredTodos);
        res.status(204).send();
    } else {
        res.status(404).json({ error: 'Todo not found' });
    }
});

app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
});
