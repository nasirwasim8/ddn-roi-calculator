import { Sun, Moon } from 'lucide-react'
import { useTheme } from './contexts/ThemeContext'
import ROICalculator from './pages/ROICalculator'
import './styles/index.css'

export default function App() {
  const { theme, toggleTheme } = useTheme()

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>

      {/* ── Top Bar ── */}
      <header style={{
        borderBottom: '1px solid var(--border-subtle)',
        background: 'var(--surface-primary)',
        position: 'sticky', top: 0, zIndex: 50,
      }}>
        <div style={{
          maxWidth: 1280, margin: '0 auto', padding: '0 24px',
          height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          {/* Logo + title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <img
              src="/logo-ddn.svg"
              alt="DDN"
              style={{ height: 26, filter: theme === 'dark' ? 'brightness(1.4)' : 'none' }}
            />
            <div style={{ width: 1, height: 18, background: 'var(--border-subtle)' }} />
            <span style={{
              fontSize: 13, fontWeight: 700, letterSpacing: '0.08em',
              textTransform: 'uppercase', color: 'var(--text-muted)',
            }}>
              Infinia — Persistent AI Memory · ROI Calculator
            </span>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>

            {/* Light / Dark toggle */}
            <button
              onClick={toggleTheme}
              title={theme === 'dark' ? 'Switch to Light theme' : 'Switch to Dark theme'}
              style={{
                width: 34, height: 34, borderRadius: 8, cursor: 'pointer',
                border: '1px solid var(--border-subtle)',
                background: 'transparent',
                color: 'var(--text-secondary)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'background 0.2s',
              }}
            >
              {theme === 'dark'
                ? <Sun  style={{ width: 15, height: 15 }} />
                : <Moon style={{ width: 15, height: 15 }} />
              }
            </button>

            <button
              onClick={() => window.print()}
              style={{
                padding: '6px 14px', borderRadius: 8, fontSize: 12,
                fontWeight: 600, cursor: 'pointer',
                border: '1px solid var(--border-subtle)',
                background: 'transparent', color: 'var(--text-secondary)',
              }}
            >
              Export PDF
            </button>

            <button
              onClick={() =>
                navigator.clipboard.writeText(window.location.href)
                  .then(() => alert('Shareable link copied!'))
                  .catch(() => {})
              }
              style={{
                padding: '6px 14px', borderRadius: 8, fontSize: 12,
                fontWeight: 600, cursor: 'pointer',
                background: '#ED2738', color: '#fff', border: 'none',
              }}
            >
              Copy Link
            </button>
          </div>
        </div>
      </header>

      {/* ── Main ── */}
      <main style={{ maxWidth: 1280, margin: '0 auto', padding: '32px 24px' }}>
        <ROICalculator />
      </main>

      {/* ── Footer ── */}
      <footer style={{
        borderTop: '1px solid var(--border-subtle)',
        padding: '16px 24px',
        textAlign: 'center',
        fontSize: 11,
        color: 'var(--text-muted)',
      }}>
        <strong style={{ color: '#ED2738' }}>DDN Infinia</strong>{' '}
        · Persistent AI Memory · ROI Calculator v2.0 ·{' '}
        <a href="https://www.ddn.com" target="_blank" rel="noreferrer"
          style={{ color: '#ED2738', textDecoration: 'none' }}>
          ddn.com
        </a>
        <span style={{ margin: '0 8px', opacity: 0.3 }}>|</span>
        All calculations are estimates. Contact DDN for a tailored analysis.
      </footer>
    </div>
  )
}
