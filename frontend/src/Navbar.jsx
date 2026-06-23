export default function Navbar({ activePage }) {
  const links = [
    { href: '/', label: 'Tasks', page: 'tasks' },
    { href: '/add.html', label: 'Add Task', page: 'add', isAdd: true },
    { href: '/completed.html', label: 'Completed', page: 'completed' },
    { href: '/stats.html', label: 'Stats', page: 'stats' },
  ]

  return (
    <nav className="nav" role="navigation" aria-label="Main navigation">
      <div className="nav-inner">
        <a href="/" className="nav-brand" aria-label="Nexus home">
          <div className="nav-brand-mark" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </div>
          <span className="nav-brand-name">Nexus</span>
        </a>
        <div className="nav-links">
          {links.map(link => (
            <a
              key={link.page}
              href={link.href}
              className={`nav-link ${link.isAdd ? 'nav-link-add' : ''} ${activePage === link.page ? 'active' : ''}`}
              aria-current={activePage === link.page ? 'page' : undefined}
            >
              <span>{link.label}</span>
            </a>
          ))}
        </div>
      </div>
    </nav>
  )
}
