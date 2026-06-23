import { useState, useEffect } from 'react'
import axios from 'axios'
import Navbar from './Navbar.jsx'

const PRIORITY_LABELS = { high: 'High', medium: 'Medium', low: 'Low' }
const CATEGORY_LABELS = { work: 'Work', personal: 'Personal', health: 'Health', other: 'Other' }

export default function CompletedPage() {
  const [todos, setTodos] = useState([])

  const fetchTodos = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/todos')
      setTodos(res.data.filter(t => t.completed))
    } catch (e) { console.error(e) }
  }

  useEffect(() => { fetchTodos() }, [])

  const handleReopen = async (id) => {
    try {
      await axios.put(`http://localhost:3000/api/todos/${id}`, { completed: false })
      fetchTodos()
    } catch (e) { console.error(e) }
  }

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/todos/${id}`)
      fetchTodos()
    } catch (e) { console.error(e) }
  }

  const handleClearAll = async () => {
    if (!window.confirm('Delete all completed tasks? This cannot be undone.')) return
    try {
      await Promise.all(todos.map(t => axios.delete(`http://localhost:3000/api/todos/${t.id}`)))
      setTodos([])
    } catch (e) { console.error(e) }
  }

  const formatDate = (ts) => {
    if (!ts) return ''
    return new Date(ts).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  return (
    <div data-page="completed">
      <Navbar activePage="completed" />

      <main className="page" id="main">
        <header className="page-hero">
          <p className="page-eyebrow">Archive</p>
          <h1 className="page-title">Completed <span>Tasks</span></h1>
          <p className="page-subtitle">{todos.length} task{todos.length !== 1 ? 's' : ''} completed in total.</p>
        </header>

        {/* Stats */}
        <div className="stats-grid" role="list" style={{ marginBottom: '2.5rem' }}>
          <div className="stat-card" role="listitem">
            <span className="stat-label">All Time</span>
            <span className="stat-value">{todos.length}</span>
            <span className="stat-note">completed tasks</span>
          </div>
          <div className="stat-card" role="listitem">
            <span className="stat-label">Done Today</span>
            <span className="stat-value">
              {todos.filter(t => t.doneAt && new Date(t.doneAt).toDateString() === new Date().toDateString()).length}
            </span>
            <span className="stat-note">tasks today</span>
          </div>
        </div>

        {/* Actions */}
        {todos.length > 0 && (
          <div className="section-heading">
            <h2 className="section-title">Completed List</h2>
            <button className="btn btn-danger" onClick={handleClearAll} style={{ fontSize: '0.8rem', padding: '0.35rem 0.8rem' }}>
              Clear All
            </button>
          </div>
        )}

        {/* Empty state */}
        {todos.length === 0 && (
          <div className="empty-state visible" role="status">
            <div className="empty-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
            </div>
            <p className="empty-title">Nothing completed yet</p>
            <p className="empty-body">Complete a task from the <a href="/" style={{ color: 'var(--text-2)', textDecoration: 'underline' }}>task list</a> and it will appear here.</p>
          </div>
        )}

        {/* Task list */}
        {todos.length > 0 && (
          <div className="task-list" role="list">
            {todos.map(task => (
              <div key={task.id} className="task-card done" data-priority={task.priority} role="listitem">
                <input
                  type="checkbox"
                  className="task-check"
                  checked={true}
                  onChange={() => handleReopen(task.id)}
                  aria-label={`Reopen "${task.title}"`}
                />
                <div className="task-body">
                  <a href={`/todo.html?id=${task.id}`} className="task-title" style={{ display: 'block', textDecoration: 'none' }}>{task.title}</a>
                  <div className="task-meta">
                    <span className={`badge badge-${task.category}`}>{CATEGORY_LABELS[task.category]}</span>
                    <span className={`badge badge-${task.priority}`}>{PRIORITY_LABELS[task.priority]}</span>
                    {task.doneAt && <span className="badge badge-other">Done {formatDate(task.doneAt)}</span>}
                  </div>
                </div>
                <div className="task-actions">
                  <button className="icon-btn" onClick={() => handleDelete(task.id)} title="Delete" aria-label={`Delete "${task.title}"`}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/></svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
