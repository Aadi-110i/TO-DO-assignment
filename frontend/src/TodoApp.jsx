import { useState, useEffect } from 'react'
import axios from 'axios'

const PRIORITY_LABELS = { high: 'High', medium: 'Medium', low: 'Low' };
const CATEGORY_LABELS = { work: 'Work', personal: 'Personal', health: 'Health', other: 'Other' };

const ICONS = {
  edit: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  save: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>,
  cancel: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  trash: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/></svg>,
}

export default function TodoApp() {
  const [todo, setTodo] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [todoId, setTodoId] = useState(null)

  // Edit mode state
  const [editing, setEditing] = useState(false)
  const [editTitle, setEditTitle] = useState('')
  const [editDescription, setEditDescription] = useState('')
  const [editCategory, setEditCategory] = useState('work')
  const [editPriority, setEditPriority] = useState('medium')
  const [editCompleted, setEditCompleted] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const id = params.get('id')

    if (!id) {
      setError('No Todo ID provided in the URL')
      setLoading(false)
      return
    }

    setTodoId(id)

    const fetchTodo = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/api/todos/${id}`)
        setTodo(res.data)
      } catch (err) {
        setError('Todo not found or the server is not running.')
      } finally {
        setLoading(false)
      }
    }

    fetchTodo()
  }, [])

  const startEditing = () => {
    setEditTitle(todo.title)
    setEditDescription(todo.description || '')
    setEditCategory(todo.category || 'other')
    setEditPriority(todo.priority || 'medium')
    setEditCompleted(todo.completed)
    setEditing(true)
    setSaveSuccess(false)
  }

  const cancelEditing = () => {
    setEditing(false)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    if (!editTitle.trim()) return
    setSaving(true)
    try {
      const res = await axios.put(`http://localhost:3000/api/todos/${todoId}`, {
        title: editTitle,
        description: editDescription,
        category: editCategory,
        priority: editPriority,
        completed: editCompleted,
      })
      setTodo(res.data)
      setEditing(false)
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 2500)
    } catch (err) {
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!window.confirm('Delete this todo? This cannot be undone.')) return
    try {
      await axios.delete(`http://localhost:3000/api/todos/${todoId}`)
      window.location.href = '/'
    } catch (err) {
      console.error(err)
    }
  }

  const handleToggleComplete = async () => {
    try {
      const res = await axios.put(`http://localhost:3000/api/todos/${todoId}`, { completed: !todo.completed })
      setTodo(res.data)
    } catch (err) {
      console.error(err)
    }
  }

  if (loading) return (
    <div className="page" style={{ textAlign: 'center', paddingTop: '5rem' }}>
      <p className="page-subtitle">Loading...</p>
    </div>
  )

  if (error) return (
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
      <div className="page" style={{ textAlign: 'center', paddingTop: '5rem' }}>
        <p className="page-subtitle" style={{ color: 'var(--high-txt)' }}>{error}</p>
        <a href="/" className="btn btn-ghost" style={{ marginTop: '1rem' }}>← Back to List</a>
      </div>
    </div>
  )

  const priorityColor = todo.priority === 'high' ? 'var(--high-txt)' : todo.priority === 'medium' ? 'var(--med-txt)' : 'var(--low-txt)'

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
            <a href="/" className="btn btn-ghost" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }} id="back-to-list">← Back to List</a>
          </div>
        </div>
      </nav>

      <main className="page" id="main" style={{ maxWidth: '680px' }}>
        <header className="page-hero" style={{ paddingBottom: '1.5rem' }}>
          <p className="page-eyebrow">Task Detail</p>
          <h1 className="page-title" style={{ wordBreak: 'break-word' }}>{todo.title}</h1>
          <p className="page-subtitle">
            Created {new Date(todo.createdAt).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}
          </p>
        </header>

        {/* Success banner */}
        {saveSuccess && (
          <div role="status" style={{
            background: 'rgba(74,222,128,0.12)',
            border: '1px solid rgba(74,222,128,0.4)',
            borderRadius: '0.6rem',
            padding: '0.75rem 1rem',
            marginBottom: '1.25rem',
            color: 'var(--low-txt)',
            fontSize: '0.85rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}>
            <span style={{ width: '1rem', height: '1rem', display: 'inline-flex' }}>{ICONS.save}</span>
            Changes saved successfully!
          </div>
        )}

        {/* View Mode */}
        {!editing && (
          <div className="form-card" style={{ borderLeft: `4px solid ${priorityColor}` }}>

            {/* Status + quick-toggle */}
            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <label className="form-label">Status</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                {todo.completed ? (
                  <span className="badge" style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem', background: 'rgba(74,222,128,0.15)', color: 'var(--low-txt)', border: '1px solid rgba(74,222,128,0.3)' }}>
                    ✓ Completed {todo.doneAt && `· ${new Date(todo.doneAt).toLocaleDateString('en-US', { dateStyle: 'medium' })}`}
                  </span>
                ) : (
                  <span className="badge" style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem', background: 'var(--surface-2)', color: 'var(--text-muted)' }}>
                    ○ Pending
                  </span>
                )}
                <button
                  id="toggle-complete-btn"
                  className="btn btn-ghost"
                  onClick={handleToggleComplete}
                  style={{ fontSize: '0.78rem', padding: '0.3rem 0.7rem' }}
                >
                  {todo.completed ? 'Mark Incomplete' : 'Mark Complete'}
                </button>
              </div>
            </div>

            {/* Category + Priority */}
            <div className="form-row" style={{ marginBottom: '1.5rem' }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Category</label>
                <span className={`badge badge-${todo.category}`} style={{ fontSize: '0.8rem' }}>
                  {CATEGORY_LABELS[todo.category] || todo.category}
                </span>
              </div>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Priority</label>
                <span className={`badge badge-${todo.priority}`} style={{ fontSize: '0.8rem' }}>
                  {PRIORITY_LABELS[todo.priority] || todo.priority}
                </span>
              </div>
            </div>

            {/* Description */}
            {todo.description ? (
              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label className="form-label">Notes & Description</label>
                <div className="form-textarea" style={{ minHeight: 'auto', background: 'var(--surface-2)', border: 'none', whiteSpace: 'pre-wrap' }}>
                  {todo.description}
                </div>
              </div>
            ) : (
              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label className="form-label">Notes & Description</label>
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>No description added.</p>
              </div>
            )}

            {/* Actions */}
            <div style={{ display: 'flex', gap: '0.75rem', paddingTop: '0.5rem', borderTop: '1px solid var(--border)' }}>
              <button
                id="edit-todo-btn"
                className="btn btn-primary"
                onClick={startEditing}
                style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
              >
                <span style={{ width: '0.9rem', height: '0.9rem', display: 'inline-flex' }}>{ICONS.edit}</span>
                Edit Task
              </button>
              <button
                id="delete-todo-btn"
                className="btn btn-ghost"
                onClick={handleDelete}
                style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--high-txt)' }}
              >
                <span style={{ width: '0.9rem', height: '0.9rem', display: 'inline-flex' }}>{ICONS.trash}</span>
                Delete
              </button>
            </div>
          </div>
        )}

        {/* Edit Mode */}
        {editing && (
          <form
            id="edit-todo-form"
            className="form-card"
            onSubmit={handleSave}
            style={{ borderLeft: `4px solid ${priorityColor}` }}
          >
            <div className="form-group">
              <label className="form-label" htmlFor="edit-title">Title <span style={{ color: 'var(--high-txt)' }}>*</span></label>
              <input
                id="edit-title"
                type="text"
                className="form-input"
                value={editTitle}
                onChange={e => setEditTitle(e.target.value)}
                required
                autoFocus
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="edit-description">Notes & Description</label>
              <textarea
                id="edit-description"
                className="form-textarea"
                value={editDescription}
                onChange={e => setEditDescription(e.target.value)}
                placeholder="Add notes or a description..."
                rows={4}
                style={{ resize: 'vertical' }}
              />
            </div>

            <div className="form-row">
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" htmlFor="edit-category">Category</label>
                <select
                  id="edit-category"
                  className="form-select"
                  value={editCategory}
                  onChange={e => setEditCategory(e.target.value)}
                >
                  {Object.entries(CATEGORY_LABELS).map(([v, l]) => (
                    <option key={v} value={v}>{l}</option>
                  ))}
                </select>
              </div>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" htmlFor="edit-priority">Priority</label>
                <select
                  id="edit-priority"
                  className="form-select"
                  value={editPriority}
                  onChange={e => setEditPriority(e.target.value)}
                >
                  {Object.entries(PRIORITY_LABELS).map(([v, l]) => (
                    <option key={v} value={v}>{l}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <label className="form-label">Completion Status</label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem' }}>
                <input
                  id="edit-completed"
                  type="checkbox"
                  className="task-check"
                  checked={editCompleted}
                  onChange={e => setEditCompleted(e.target.checked)}
                  style={{ position: 'static', width: '1.1rem', height: '1.1rem' }}
                />
                Mark as completed
              </label>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', paddingTop: '0.5rem', borderTop: '1px solid var(--border)' }}>
              <button
                id="save-edit-btn"
                type="submit"
                className="btn btn-primary"
                disabled={saving}
                style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
              >
                <span style={{ width: '0.9rem', height: '0.9rem', display: 'inline-flex' }}>{ICONS.save}</span>
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                id="cancel-edit-btn"
                type="button"
                className="btn btn-ghost"
                onClick={cancelEditing}
                style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
              >
                <span style={{ width: '0.9rem', height: '0.9rem', display: 'inline-flex' }}>{ICONS.cancel}</span>
                Cancel
              </button>
            </div>
          </form>
        )}
      </main>
    </div>
  )
}
