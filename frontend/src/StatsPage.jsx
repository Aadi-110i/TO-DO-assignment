import { useState, useEffect } from 'react'
import axios from 'axios'
import Navbar from './Navbar.jsx'

export default function StatsPage() {
  const [todos, setTodos] = useState([])

  useEffect(() => {
    axios.get('http://localhost:3000/api/todos')
      .then(res => setTodos(res.data))
      .catch(err => console.error(err))
  }, [])

  const total = todos.length
  const active = todos.filter(t => !t.completed).length
  const completed = todos.filter(t => t.completed).length
  const pct = total ? Math.round((completed / total) * 100) : 0

  const today = new Date().toDateString()
  const doneToday = todos.filter(t => t.completed && t.doneAt && new Date(t.doneAt).toDateString() === today).length

  // Category breakdown
  const categories = ['work', 'personal', 'health', 'other']
  const catCounts = categories.map(c => ({
    name: c.charAt(0).toUpperCase() + c.slice(1),
    key: c,
    total: todos.filter(t => t.category === c).length,
    done: todos.filter(t => t.category === c && t.completed).length,
  }))

  // Priority breakdown
  const priorities = ['high', 'medium', 'low']
  const priCounts = priorities.map(p => ({
    name: p.charAt(0).toUpperCase() + p.slice(1),
    key: p,
    total: todos.filter(t => t.priority === p).length,
    done: todos.filter(t => t.priority === p && t.completed).length,
  }))

  // Overdue
  const overdue = todos.filter(t => !t.completed && t.dueDate && new Date(t.dueDate) < new Date()).length

  return (
    <div data-page="stats">
      <Navbar activePage="stats" />

      <main className="page" id="main">
        <header className="page-hero">
          <p className="page-eyebrow">Analytics</p>
          <h1 className="page-title">Task <span>Statistics</span></h1>
          <p className="page-subtitle">Overview of your productivity and task distribution.</p>
        </header>

        {/* Overview Stats */}
        <div className="stats-grid" role="list">
          <div className="stat-card" role="listitem">
            <span className="stat-label">Total Tasks</span>
            <span className="stat-value">{total}</span>
            <span className="stat-note">all time</span>
          </div>
          <div className="stat-card" role="listitem">
            <span className="stat-label">Active</span>
            <span className="stat-value">{active}</span>
            <span className="stat-note">in progress</span>
          </div>
          <div className="stat-card" role="listitem">
            <span className="stat-label">Completed</span>
            <span className="stat-value">{completed}</span>
            <span className="stat-note">{pct}% done</span>
          </div>
          <div className="stat-card" role="listitem">
            <span className="stat-label">Done Today</span>
            <span className="stat-value">{doneToday}</span>
            <span className="stat-note">today's progress</span>
          </div>
        </div>

        {/* Progress */}
        <div className="progress-block">
          <div className="progress-header">
            <span className="progress-label-text">Overall Completion</span>
            <span className="progress-pct">{pct}%</span>
          </div>
          <div className="progress-track" role="progressbar" aria-valuenow={pct} aria-valuemin="0" aria-valuemax="100">
            <div className="progress-fill" style={{ width: `${pct}%` }}></div>
          </div>
        </div>

        {/* Overdue callout */}
        {overdue > 0 && (
          <div className="callout" style={{ marginBottom: '2.5rem' }}>
            <div className="callout-icon" style={{ background: 'var(--high-bg)' }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="var(--high-txt)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '20px', height: '20px' }}>
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
            </div>
            <div className="callout-text">
              <p className="callout-title">Overdue Tasks</p>
              <p className="callout-body">{overdue} task{overdue !== 1 ? 's are' : ' is'} past the due date.</p>
            </div>
          </div>
        )}

        {/* Category Breakdown */}
        <div className="section-heading">
          <h2 className="section-title">By Category</h2>
        </div>
        <div className="stats-grid" role="list" style={{ marginBottom: '2.5rem' }}>
          {catCounts.map(c => (
            <div className="stat-card" key={c.key} role="listitem">
              <span className="stat-label">{c.name}</span>
              <span className="stat-value">{c.total}</span>
              <span className="stat-note">{c.done} completed</span>
            </div>
          ))}
        </div>

        {/* Priority Breakdown */}
        <div className="section-heading">
          <h2 className="section-title">By Priority</h2>
        </div>
        <div className="stats-grid" role="list" style={{ marginBottom: '2.5rem' }}>
          {priCounts.map(p => {
            const pctP = p.total ? Math.round((p.done / p.total) * 100) : 0
            return (
              <div className="stat-card" key={p.key} role="listitem">
                <span className="stat-label">{p.name}</span>
                <span className="stat-value">{p.total}</span>
                <span className="stat-note">{pctP}% done</span>
              </div>
            )
          })}
        </div>

        {total === 0 && (
          <div className="empty-state visible" role="status" style={{ marginTop: '2rem' }}>
            <div className="empty-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/>
              </svg>
            </div>
            <p className="empty-title">No data yet</p>
            <p className="empty-body"><a href="/add.html" style={{ color: 'var(--text-2)', textDecoration: 'underline' }}>Add a task</a> to start tracking stats.</p>
          </div>
        )}
      </main>
    </div>
  )
}
