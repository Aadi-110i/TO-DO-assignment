import { useState, useEffect } from 'react'
import axios from 'axios'
import Navbar from './Navbar.jsx'

const ICONS = {
  trash: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/></svg>,
  empty: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/></svg>,
  chevron: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="6 9 12 15 18 9"/></svg>,
  calendar: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
}

const PRIORITY_LABELS = { high: 'High', medium: 'Medium', low: 'Low' }
const CATEGORY_LABELS = { work: 'Work', personal: 'Personal', health: 'Health', other: 'Other' }

export default function App() {
  const [todos, setTodos] = useState([])
  const [filter, setFilter] = useState('all')

  const fetchTodos = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/todos')
      setTodos(res.data)
    } catch (e) { console.error(e) }
  }

  useEffect(() => { fetchTodos() }, [])

  const handleToggle = async (id, currentStatus) => {
    try {
      await axios.put(`http://localhost:3000/api/todos/${id}`, { completed: !currentStatus })
      fetchTodos()
    } catch (e) { console.error(e) }
  }

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/todos/${id}`)
      fetchTodos()
    } catch (e) { console.error(e) }
  }

  const active = todos.filter(t => !t.completed)
  const done = todos.filter(t => t.completed)
  const pct = todos.length ? Math.round((done.length / todos.length) * 100) : 0

  let filtered = todos
  if (filter === 'active') filtered = active
  else if (filter === 'done') filtered = done
  else if (filter === 'high') filtered = todos.filter(t => t.priority === 'high')
  else if (['work','personal','health'].includes(filter)) filtered = todos.filter(t => t.category === filter)

  const activeItems = filtered.filter(t => !t.completed)
  const doneItems = filtered.filter(t => t.completed)

  const formatRelativeDate = (ts) => {
    if (!ts) return ''
    const diff = Date.now() - ts
    const m = 60 * 1000, h = 60 * m, d = 24 * h
    if (diff < m) return 'just now'
    if (diff < h) return Math.floor(diff / m) + 'm ago'
    if (diff < d) return Math.floor(diff / h) + 'h ago'
    if (diff < 2 * d) return 'yesterday'
    return new Date(ts).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  const renderCard = (task) => (
    <div key={task.id} className={`task-card ${task.completed ? 'done' : ''}`} data-priority={task.priority} role="listitem">
      <input
        type="checkbox"
        className="task-check"
        checked={task.completed}
        onChange={() => handleToggle(task.id, task.completed)}
        aria-label={`Mark "${task.title}" as ${task.completed ? 'incomplete' : 'complete'}`}
      />
      <div className="task-body">
        <a href={`/todo.html?id=${task.id}`} className="task-title" style={{ display: 'block', textDecoration: 'none' }}>{task.title}</a>
        {task.description && (
          <p style={{ margin: '0.25rem 0 0', fontSize: '0.78rem', color: 'var(--text-3)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '40ch' }}>
            {task.description}
          </p>
        )}
        <div className="task-meta">
          <span className={`badge badge-${task.category}`}>{CATEGORY_LABELS[task.category]}</span>
          <span className={`badge badge-${task.priority}`}>{PRIORITY_LABELS[task.priority]}</span>
          {task.dueDate && (
            <span className="badge badge-other" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
              <span style={{ width: '0.8rem', height: '0.8rem' }}>{ICONS.calendar}</span>
              {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          )}
          {task.completed && task.doneAt && <span className="badge badge-other">{formatRelativeDate(task.doneAt)}</span>}
        </div>
      </div>
      <div className="task-actions">
        <button className="icon-btn" onClick={() => handleDelete(task.id)} title="Delete task" aria-label={`Delete "${task.title}"`}>{ICONS.trash}</button>
      </div>
    </div>
  )

  return (
    <div data-page="tasks">
      <Navbar activePage="tasks" />

      <main className="page" id="main">
        <header className="page-hero">
          <p className="page-eyebrow">Task Manager</p>
          <h1 className="page-title">All Tasks</h1>
          <p className="page-subtitle">Filter by category, priority, or completion status.</p>
        </header>

        {/* Progress */}
        <div className="progress-block" aria-label="Overall completion">
          <div className="progress-header">
            <span className="progress-label-text">Completion</span>
            <span className="progress-pct">{pct}%</span>
          </div>
          <div className="progress-track" role="progressbar" aria-valuenow={pct} aria-valuemin="0" aria-valuemax="100">
            <div className="progress-fill" style={{ width: `${pct}%` }}></div>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="filter-bar" role="group" aria-label="Filter tasks">
          {['all', 'active', 'done', 'work', 'personal', 'health', 'high'].map(f => {
            let count = 0
            if (f === 'all') count = todos.length
            else if (f === 'active') count = active.length
            else if (f === 'done') count = done.length
            else if (f === 'high') count = todos.filter(t => t.priority === 'high').length
            else count = todos.filter(t => t.category === f).length

            return (
              <button
                key={f}
                className={`filter-btn ${filter === f ? 'active' : ''}`}
                onClick={() => setFilter(f)}
                aria-pressed={filter === f}
              >
                {f === 'high' ? 'High Priority' : f.charAt(0).toUpperCase() + f.slice(1)}
                <span className="filter-count">{count}</span>
              </button>
            )
          })}
        </div>

        {filtered.length === 0 && (
          <div className="empty-state visible" role="status">
            <div className="empty-icon" aria-hidden="true">{ICONS.empty}</div>
            <p className="empty-title">No tasks here</p>
            <p className="empty-body">Try a different filter, or <a href="/add.html" style={{ color: 'var(--text-2)', textDecoration: 'underline' }}>add a new task</a>.</p>
          </div>
        )}

        {activeItems.length > 0 && (
          <section aria-label="Active tasks">
            <div className="task-list" role="list">
              {activeItems.map(renderCard)}
            </div>
          </section>
        )}

        {doneItems.length > 0 && (
          <div style={{ marginTop: '2rem' }}>
            <p className="done-label">Completed</p>
            <div className="task-list" role="list">
              {doneItems.map(renderCard)}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
