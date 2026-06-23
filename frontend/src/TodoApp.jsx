import { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'

function TodoApp() {
  const [todo, setTodo] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    // Extract ID from query parameters
    const params = new URLSearchParams(window.location.search)
    const id = params.get('id')

    if (!id) {
      setError('No Todo ID provided in the URL')
      setLoading(false)
      return
    }

    const fetchTodo = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/todos/${id}`)
        setTodo(response.data)
      } catch (err) {
        console.error('Error fetching todo:', err)
        setError('Todo not found')
      } finally {
        setLoading(false)
      }
    }

    fetchTodo()
  }, [])

  if (loading) return <div className="container"><p>Loading...</p></div>
  if (error) return <div className="container"><p className="error">{error}</p><a href="/">Back to Home</a></div>

  return (
    <div className="container">
      <a href="/" className="back-link">← Back to all todos</a>
      
      <div className="todo-detail-card">
        <h1>{todo.title}</h1>
        <div className="status-badge">
          Status: {todo.completed ? <span className="completed-badge">Completed</span> : <span className="pending-badge">Pending</span>}
        </div>
        
        {todo.description && (
          <div className="description-box">
            <h3>Description:</h3>
            <p>{todo.description}</p>
          </div>
        )}
        
        <div className="meta-info">
          <small>Created at: {new Date(todo.createdAt).toLocaleString()}</small>
          <br/>
          <small>Todo ID: {todo.id}</small>
        </div>
      </div>
    </div>
  )
}

export default TodoApp
