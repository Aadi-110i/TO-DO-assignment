import { useState } from 'react'
import axios from 'axios'
import Navbar from './Navbar.jsx'

const CATEGORY_LABELS = { work: 'Work', personal: 'Personal', health: 'Health', other: 'Other' }
const PRIORITY_LABELS = { high: 'High', medium: 'Medium', low: 'Low' }

export default function AddTask() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('work')
  const [priority, setPriority] = useState('medium')
  const [dueDate, setDueDate] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!title.trim()) {
      setError('Title is required.')
      return
    }
    setError('')
    setSubmitting(true)
    try {
      await axios.post('http://localhost:3000/api/todos', {
        title: title.trim(),
        description: description.trim(),
        category,
        priority,
        dueDate: dueDate || null,
      })
      window.location.href = '/'
    } catch (err) {
      setError('Failed to add task. Is the server running?')
      setSubmitting(false)
    }
  }

  return (
    <div data-page="add">
      <Navbar activePage="add" />

      <main className="page" id="main" style={{ maxWidth: '640px' }}>
        <header className="page-hero">
          <p className="page-eyebrow">New Entry</p>
          <h1 className="page-title">Add a <span>Task</span></h1>
          <p className="page-subtitle">Fill in the details below. Only the title is required.</p>
        </header>

        <div className="form-card">
          <form onSubmit={handleSubmit} noValidate>

            {error && (
              <div role="alert" style={{
                background: 'var(--high-bg)', color: 'var(--high-txt)',
                padding: '0.75rem 1rem', borderRadius: 'var(--r-sm)',
                fontSize: '0.85rem', marginBottom: '1.25rem',
              }}>
                {error}
              </div>
            )}

            <div className="form-group">
              <label htmlFor="task-title" className="form-label">
                Task Title <span style={{ color: 'var(--high-txt)' }}>*</span>
              </label>
              <input
                id="task-title"
                type="text"
                className="form-input"
                placeholder="What needs to be done..."
                value={title}
                onChange={e => setTitle(e.target.value)}
                maxLength={200}
                autoFocus
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="task-description" className="form-label">
                Description <span style={{ color: 'var(--text-3)', fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>(optional)</span>
              </label>
              <textarea
                id="task-description"
                className="form-textarea"
                placeholder="Additional context or details..."
                value={description}
                onChange={e => setDescription(e.target.value)}
                maxLength={1000}
              />
            </div>

            <div className="form-row">
              <div className="form-group" style={{ margin: 0 }}>
                <label htmlFor="task-category" className="form-label">Category</label>
                <select
                  id="task-category"
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
                <label htmlFor="task-priority" className="form-label">Priority</label>
                <select
                  id="task-priority"
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

            <div className="form-group" style={{ marginTop: '1.25rem' }}>
              <label htmlFor="task-due-date" className="form-label">
                Due Date <span style={{ color: 'var(--text-3)', fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>(optional)</span>
              </label>
              <input
                id="task-due-date"
                type="date"
                className="form-input"
                value={dueDate}
                onChange={e => setDueDate(e.target.value)}
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? 'Adding...' : 'Add Task'}
              </button>
              <a href="/" className="btn btn-ghost">Cancel</a>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
