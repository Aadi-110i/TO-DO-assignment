import { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'

function App() {
  const [todos, setTodos] = useState([])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  const fetchTodos = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/todos')
      setTodos(response.data)
    } catch (error) {
      console.error('Error fetching todos:', error)
    }
  }

  useEffect(() => {
    fetchTodos()
  }, [])

  const handleAddTodo = async (e) => {
    e.preventDefault()
    if (!title.trim()) return

    try {
      await axios.post('http://localhost:3000/api/todos', { title, description })
      setTitle('')
      setDescription('')
      fetchTodos()
    } catch (error) {
      console.error('Error adding todo:', error)
    }
  }

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/todos/${id}`)
      fetchTodos()
    } catch (error) {
      console.error('Error deleting todo:', error)
    }
  }

  const handleToggle = async (id, currentStatus) => {
    try {
      await axios.put(`http://localhost:3000/api/todos/${id}`, { completed: !currentStatus })
      fetchTodos()
    } catch (error) {
      console.error('Error updating todo:', error)
    }
  }

  return (
    <div className="container">
      <h1>All Todos</h1>
      
      <form onSubmit={handleAddTodo} className="todo-form">
        <input
          type="text"
          placeholder="Todo title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button type="submit">Add Todo</button>
      </form>

      <ul className="todo-list">
        {todos.map(todo => (
          <li key={todo.id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
            <div className="todo-content">
              <input 
                type="checkbox" 
                checked={todo.completed} 
                onChange={() => handleToggle(todo.id, todo.completed)} 
              />
              {/* Navigate to the separate page using normal anchor tag for MPA behavior */}
              <a href={`/todo.html?id=${todo.id}`} className="todo-title">
                {todo.title}
              </a>
            </div>
            <button onClick={() => handleDelete(todo.id)} className="delete-btn">Delete</button>
          </li>
        ))}
      </ul>
      {todos.length === 0 && <p>No todos found. Add one above!</p>}
    </div>
  )
}

export default App
