const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = process.env.VERCEL ? '/tmp/todos.json' : path.join(__dirname, 'todos.json');

app.use(cors());
app.use(express.json());

const readTodos = () => {
    if (!fs.existsSync(DATA_FILE)) {
        fs.writeFileSync(DATA_FILE, JSON.stringify([]));
    }
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
};

const writeTodos = (todos) => {
    fs.writeFileSync(DATA_FILE, JSON.stringify(todos, null, 2));
};

app.get('/api/todos', (req, res) => res.json(readTodos()));

app.get('/api/todos/:id', (req, res) => {
    const todo = readTodos().find(t => t.id === req.params.id);
    todo ? res.json(todo) : res.status(404).json({ error: 'Not found' });
});

app.post('/api/todos', (req, res) => {
    const { title, description, category, priority } = req.body;
    if (!title) return res.status(400).json({ error: 'Title required' });

    const todos = readTodos();
    const newTodo = {
        id: Date.now().toString(),
        title,
        description: description || '',
        category: category || 'other',
        priority: priority || 'medium',
        completed: false,
        createdAt: Date.now(),
        doneAt: null
    };
    todos.unshift(newTodo); // Add to beginning
    writeTodos(todos);
    res.status(201).json(newTodo);
});

app.put('/api/todos/:id', (req, res) => {
    const { title, description, completed, category, priority } = req.body;
    const todos = readTodos();
    const index = todos.findIndex(t => t.id === req.params.id);

    if (index !== -1) {
        const wasCompleted = todos[index].completed;
        const isNowCompleted = completed !== undefined ? completed : wasCompleted;
        
        todos[index] = {
            ...todos[index],
            title: title !== undefined ? title : todos[index].title,
            description: description !== undefined ? description : todos[index].description,
            category: category !== undefined ? category : todos[index].category,
            priority: priority !== undefined ? priority : todos[index].priority,
            completed: isNowCompleted,
            doneAt: (!wasCompleted && isNowCompleted) ? Date.now() : (isNowCompleted ? todos[index].doneAt : null)
        };
        writeTodos(todos);
        res.json(todos[index]);
    } else {
        res.status(404).json({ error: 'Not found' });
    }
});

app.delete('/api/todos/:id', (req, res) => {
    const todos = readTodos();
    const filtered = todos.filter(t => t.id !== req.params.id);
    if (todos.length !== filtered.length) {
        writeTodos(filtered);
        res.status(204).send();
    } else {
        res.status(404).json({ error: 'Not found' });
    }
});

if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
    app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
}

module.exports = app;
