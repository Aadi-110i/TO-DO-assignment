import { useState, useEffect } from 'react'
import axios from 'axios'

// Icons
const ICONS = {
  check: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>,
  trash: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/></svg>,
  empty: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/></svg>,
  chevron: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="6 9 12 15 18 9"/></svg>,
}

const PRIORITY_LABELS = { high: 'High', medium: 'Medium', low: 'Low' };
const CATEGORY_LABELS = { work: 'Work', personal: 'Personal', health: 'Health', other: 'Other' };

export default function App() {
  const [todos, setTodos] = useState([])
  const [filter, setFilter] = useState('all')
  const [formExpanded, setFormExpanded] = useState(false)

  // Form State
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('work')
  const [priority, setPriority] = useState('medium')

  const fetchTodos = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/todos')
      setTodos(res.data)
    } catch (e) { console.error(e) }
  }

  useEffect(() => { fetchTodos() }, [])

  const handleAdd = async (e) => {
    e.preventDefault()
    if (!title.trim()) return
    try {
      await axios.post('http://localhost:3000/api/todos', { title, description, category, priority })
      setTitle('')
      setDescription('')
      setCategory('work')
      setPriority('medium')
      setFormExpanded(false)
      fetchTodos()
    } catch (e) { console.error(e) }
  }

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

  // Derived state
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

  return (
    <div data-page="tasks">
      {/* Navigation */}
      <nav className="nav" role="navigation" aria-label="Main navigation">
        <div className="nav-inner">
          <a href="/" className="nav-brand" aria-label="Nexus home">
            <div className="nav-brand-mark" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <span className="nav-brand-name">Nexus</span>
          </a>
        </div>
      </nav>

      <main className="page" id="main">
        <header className="page-hero">
          <p className="page-eyebrow">Task Manager</p>
          <h1 className="page-title">All Tasks</h1>
          <p className="page-subtitle">Filter by category, priority, or completion status.</p>
        </header>

        {/* Add Task Form */}
        <section style={{ marginBottom: '2.5rem' }}>
          <div className="section-heading">
            <h2 className="section-title">Add Task</h2>
          </div>
          <form onSubmit={handleAdd} className="form-card" style={{ padding: '1.25rem' }} id="add-task-form">
            {/* Title row — always visible */}
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: formExpanded ? '1rem' : 0 }}>
              <input
                id="task-title-input"
                type="text"
                className="form-input"
                placeholder="What needs to be done..."
                value={title}
                onChange={e => setTitle(e.target.value)}
                onFocus={() => setFormExpanded(true)}
                required
                style={{ flex: 1, margin: 0 }}
                aria-label="Task title"
              />
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => setFormExpanded(v => !v)}
                aria-expanded={formExpanded}
                aria-label="Toggle additional fields"
                style={{ padding: '0.5rem', lineHeight: 0 }}
              >
                <span style={{ display: 'inline-block', transform: formExpanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s', width: '1.1rem', height: '1.1rem' }}>
                  {ICONS.chevron}
                </span>
              </button>
              <button type="submit" className="btn btn-primary" id="add-task-btn">Add Task</button>
            </div>

            {/* Expanded fields */}
            {formExpanded && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem' }}>
                <textarea
                  id="task-description-input"
                  className="form-textarea"
                  placeholder="Add a description or notes (optional)..."
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  rows={3}
                  style={{ margin: 0, minHeight: 'auto', resize: 'vertical' }}
                  aria-label="Task description"
                />
                <div className="form-row" style={{ margin: 0 }}>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label" htmlFor="task-category-select">Category</label>
                    <select
                      id="task-category-select"
                      className="form-select"
                      value={category}
                      onChange={e => setCategory(e.target.value)}
                    >
                      {Object.entries(CATEGORY_LABELS).map(([v, l]) => (
                        <option key={v} value={v}>{l}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label" htmlFor="task-priority-select">Priority</label>
                    <select
                      id="task-priority-select"
                      className="form-select"
                      value={priority}
                      onChange={e => setPriority(e.target.value)}
                    >
                      {Object.entries(PRIORITY_LABELS).map(([v, l]) => (
                        <option key={v} value={v}>{l}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}
          </form>
        </section>

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
                id={`filter-${f}`}
                className={`filter-btn ${filter === f ? 'active' : ''}`}
                onClick={() => setFilter(f)}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)} <span className="filter-count">{count}</span>
              </button>
            )
          })}
        </div>

        {filtered.length === 0 && (
          <div className="empty-state visible" role="status">
            <div className="empty-icon" aria-hidden="true">{ICONS.empty}</div>
            <p className="empty-title">No tasks here</p>
            <p className="empty-body">Try a different filter, or add a new task.</p>
          </div>
        )}

        {/* Active List */}
        {activeItems.length > 0 && (
          <section aria-label="Active tasks">
            <div className="task-list" role="list">
              {activeItems.map(task => (
                <div key={task.id} className="task-card" data-priority={task.priority} role="listitem">
                  <input
                    type="checkbox"
                    className="task-check"
                    checked={false}
                    onChange={() => handleToggle(task.id, false)}
                    aria-label={`Mark "${task.title}" as complete`}
                    id={`check-${task.id}`}
                  />
                  <div className="task-body">
                    <a href={`/todo.html?id=${task.id}`} className="task-title" style={{ display: 'block', textDecoration: 'none' }}>
                      {task.title}
                    </a>
                    {task.description && (
                      <p style={{ margin: '0.25rem 0 0', fontSize: '0.78rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '40ch' }}>
                        {task.description}
                      </p>
                    )}
                    <div className="task-meta">
                      <span className={`badge badge-${task.category}`}>{CATEGORY_LABELS[task.category]}</span>
                      <span className={`badge badge-${task.priority}`}>{PRIORITY_LABELS[task.priority]}</span>
                    </div>
                  </div>
                  <div className="task-actions">
                    <button className="icon-btn" onClick={() => handleDelete(task.id)} title="Delete task" aria-label={`Delete "${task.title}"`} id={`delete-${task.id}`}>{ICONS.trash}</button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Done List */}
        {doneItems.length > 0 && (
          <div style={{ marginTop: '2rem' }}>
            <p className="done-label">Completed</p>
            <div className="task-list" role="list">
              {doneItems.map(task => (
                <div key={task.id} className="task-card done" data-priority={task.priority} role="listitem">
                  <input
                    type="checkbox"
                    className="task-check"
                    checked={true}
                    onChange={() => handleToggle(task.id, true)}
                    aria-label={`Mark "${task.title}" as incomplete`}
                    id={`check-${task.id}`}
                  />
                  <div className="task-body">
                    <a href={`/todo.html?id=${task.id}`} className="task-title" style={{ display: 'block', textDecoration: 'none' }}>{task.title}</a>
                    {task.description && (
                      <p style={{ margin: '0.25rem 0 0', fontSize: '0.78rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '40ch' }}>
                        {task.description}
                      </p>
                    )}
                    <div className="task-meta">
                      <span className={`badge badge-${task.category}`}>{CATEGORY_LABELS[task.category]}</span>
                      <span className={`badge badge-${task.priority}`}>{PRIORITY_LABELS[task.priority]}</span>
                      {task.doneAt && <span className="badge badge-other">{formatRelativeDate(task.doneAt)}</span>}
                    </div>
                  </div>
                  <div className="task-actions">
                    <button className="icon-btn" onClick={() => handleDelete(task.id)} title="Delete task" aria-label={`Delete "${task.title}"`} id={`delete-${task.id}`}>{ICONS.trash}</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
