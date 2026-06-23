import { useState, useEffect } from 'react'
import axios from 'axios'

const PRIORITY_LABELS = { high: 'High', medium: 'Medium', low: 'Low' };
const CATEGORY_LABELS = { work: 'Work', personal: 'Personal', health: 'Health', other: 'Other' };

export default function TodoApp() {
  const [todo, setTodo] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const id = params.get('id')

    if (!id) {
      setError('No Todo ID provided in the URL')
      setLoading(false)
      return
    }

    const fetchTodo = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/api/todos/${id}`)
        setTodo(res.data)
      } catch (err) {
        setError('Todo not found')
      } finally {
        setLoading(false)
      }
    }

    fetchTodo()
  }, [])

  if (loading) return (
    <div className="page" style={{ textAlign: 'center', paddingTop: '5rem' }}>
      <p className="page-subtitle">Loading...</p>
    </div>
  )

  if (error) return (
    <div className="page" style={{ textAlign: 'center', paddingTop: '5rem' }}>
      <p className="page-subtitle" style={{ color: 'var(--high-txt)' }}>{error}</p>
      <a href="/" className="btn btn-ghost" style={{ marginTop: '1rem' }}>Back to Home</a>
    </div>
  )

  return (
    <div data-page="tasks">
      <nav className="nav" role="navigation" aria-label="Main navigation">
        <div className="nav-inner">
          <a href="/" className="nav-brand" aria-label="Nexus home">
            <div className="nav-brand-mark" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <span className="nav-brand-name">Nexus</span>
          </a>
          <div className="nav-links">
            <a href="/" className="btn btn-ghost" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>← Back to List</a>
          </div>
        </div>
      </nav>

      <main className="page" id="main" style={{ maxWidth: '640px' }}>
        <header className="page-hero">
          <p className="page-eyebrow">Task Detail</p>
          <h1 className="page-title">{todo.title}</h1>
          <p className="page-subtitle">
            Created on {new Date(todo.createdAt).toLocaleString()}
          </p>
        </header>

        <div className="form-card" style={{ borderLeft: `4px solid var(--${todo.priority === 'high' ? 'high' : todo.priority === 'medium' ? 'med' : 'low'}-txt)` }}>
          
          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label className="form-label">Status</label>
            <div>
              {todo.completed ? (
                <span className="badge badge-other" style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}>
                  ✓ Completed {todo.doneAt && `on ${new Date(todo.doneAt).toLocaleDateString()}`}
                </span>
              ) : (
                <span className="badge badge-high" style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem', background: 'var(--surface-2)', color: 'var(--text)' }}>
                  ○ Pending
                </span>
              )}
            </div>
          </div>

          <div className="form-row" style={{ marginBottom: '1.5rem' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Category</label>
              <div>
                <span className={`badge badge-${todo.category}`} style={{ fontSize: '0.8rem' }}>
                  {CATEGORY_LABELS[todo.category]}
                </span>
              </div>
            </div>
            
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Priority</label>
              <div>
                <span className={`badge badge-${todo.priority}`} style={{ fontSize: '0.8rem' }}>
                  {PRIORITY_LABELS[todo.priority]}
                </span>
              </div>
            </div>
          </div>

          {todo.description && (
            <div className="form-group">
              <label className="form-label">Notes & Description</label>
              <div className="form-textarea" style={{ minHeight: 'auto', background: 'var(--surface-2)', border: 'none' }}>
                {todo.description}
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  )
}
