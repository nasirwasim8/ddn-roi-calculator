import { useState, useEffect } from 'react'
import { Sun, Moon, Play, Calculator, Swords, HardDrive, Users, Share2, Printer, ExternalLink } from 'lucide-react'
import { useTheme } from './contexts/ThemeContext'
import ROICalculator from './pages/ROICalculator'
import CompetitiveBattlecard from './pages/CompetitiveBattlecard'
import StorageComparison from './pages/StorageComparison'
import WhoBenefitsICP from './pages/WhoBenefitsICP'
import './styles/index.css'

type TabId = 'calculator' | 'battlecard' | 'storage' | 'icp'

interface NavTab {
  id: TabId
  label: string
  shortLabel: string
  badge?: string
  badgeColor?: string
  icon: typeof Calculator
}

const TABS: NavTab[] = [
  {
    id: 'calculator',
    label: 'ROI Calculator',
    shortLabel: 'Calculator',
    icon: Calculator,
  },
  {
    id: 'battlecard',
    label: 'Why Native KV vs File/Object',
    shortLabel: 'Battlecard',
    badge: 'DDN vs WEKA vs VAST',
    badgeColor: '#ED2738',
    icon: Swords,
  },
  {
    id: 'storage',
    label: 'GPU vs Infinia Storage',
    shortLabel: 'GPU vs Infinia',
    badge: 'NVIDIA Dynamo NIXL',
    badgeColor: '#76B900',
    icon: HardDrive,
  },
  {
    id: 'icp',
    label: 'Who Benefits (ICP)',
    shortLabel: 'Who Benefits',
    badge: '5 Personas',
    badgeColor: '#1A81AF',
    icon: Users,
  },
]

export default function App() {
  const { theme, toggleTheme } = useTheme()
  const [activeTab, setActiveTab] = useState<TabId>('calculator')
  const [copied, setCopied] = useState(false)

  // Initialize and synchronize activeTab with URL hash
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '') as TabId
      if (['calculator', 'battlecard', 'storage', 'icp'].includes(hash)) {
        setActiveTab(hash)
      }
    }

    handleHashChange()
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  const switchTab = (id: TabId) => {
    setActiveTab(id)
    window.location.hash = id
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleCopyLink = () => {
    const shareUrl = `${window.location.origin}${window.location.pathname}#${activeTab}`
    navigator.clipboard.writeText(shareUrl)
      .then(() => {
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      })
      .catch(() => {})
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg-primary)' }}>
      {/* ── Top Header ── */}
      <header
        style={{
          borderBottom: '1px solid var(--border-subtle)',
          background: 'var(--surface-primary)',
          position: 'sticky',
          top: 0,
          zIndex: 50,
          backdropFilter: 'blur(12px)',
        }}
      >
        <div
          style={{
            maxWidth: 1320,
            margin: '0 auto',
            padding: '0 20px',
            height: 60,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 16,
          }}
        >
          {/* Logo & Product Title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
            <a
              href="https://www.ddn.com"
              target="_blank"
              rel="noreferrer"
              style={{ display: 'flex', alignItems: 'center' }}
            >
              <img
                src="/logo-ddn.svg"
                alt="DDN"
                style={{ height: 26, filter: theme === 'dark' ? 'brightness(1.4)' : 'none' }}
              />
            </a>
            <div style={{ width: 1, height: 20, background: 'var(--border-subtle)' }} />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 800,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  color: 'var(--text-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                Infinia <span style={{ color: 'var(--ddn-red)', fontWeight: 900 }}>·</span> Persistent AI Memory
              </span>
              <span style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 500 }}>
                Enterprise &amp; Neocloud Decision Suite
              </span>
            </div>
          </div>

          {/* Action buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
            {/* Light / Dark toggle */}
            <button
              onClick={toggleTheme}
              title={theme === 'dark' ? 'Switch to Light theme' : 'Switch to Dark theme'}
              style={{
                width: 36,
                height: 36,
                borderRadius: 9,
                cursor: 'pointer',
                border: '1px solid var(--border-subtle)',
                background: 'var(--surface-secondary)',
                color: 'var(--text-secondary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.15s ease',
              }}
            >
              {theme === 'dark' ? (
                <Sun style={{ width: 16, height: 16, color: '#f59e0b' }} />
              ) : (
                <Moon style={{ width: 16, height: 16 }} />
              )}
            </button>

                        {/* Live Demo button */}
            <button
              onClick={() => {
                switchTab('calculator')
                setTimeout(() => {
                  window.dispatchEvent(new CustomEvent('open-demo-modal'))
                }, 50)
              }}
              title="Watch Live Cluster Demonstration & Telemetry"
              style={{
                padding: '7px 14px',
                borderRadius: 9,
                fontSize: 12,
                fontWeight: 700,
                cursor: 'pointer',
                background: 'rgba(237,39,56,0.12)',
                color: 'var(--ddn-red)',
                border: '1px solid rgba(237,39,56,0.3)',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                transition: 'all 0.15s ease',
              }}
            >
              <Play style={{ width: 13, height: 13 }} fill="currentColor" />
              <span>Live Demo</span>
            </button>

{/* Print / Export */}
            <button
              onClick={() => window.print()}
              title="Print or Save as PDF"
              className="hidden sm:inline-flex"
              style={{
                padding: '7px 14px',
                borderRadius: 9,
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
                border: '1px solid var(--border-subtle)',
                background: 'var(--surface-secondary)',
                color: 'var(--text-secondary)',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <Printer style={{ width: 14, height: 14 }} />
              <span>Export PDF</span>
            </button>

            {/* Copy Link */}
            <button
              onClick={handleCopyLink}
              title="Copy shareable link to this view"
              style={{
                padding: '7px 15px',
                borderRadius: 9,
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
                background: copied ? '#00C280' : 'var(--ddn-red)',
                color: '#fff',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                transition: 'all 0.2s ease',
              }}
            >
              <Share2 style={{ width: 14, height: 14 }} />
              <span>{copied ? 'Copied!' : 'Copy Link'}</span>
            </button>
          </div>
        </div>

        {/* ── Secondary Navigation Bar (Tabs) ── */}
        <div
          style={{
            borderTop: '1px solid var(--border-subtle)',
            background: 'var(--surface-secondary)',
          }}
        >
          <div
            style={{
              maxWidth: 1320,
              margin: '0 auto',
              padding: '0 20px',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              overflowX: 'auto',
              scrollbarWidth: 'none',
              WebkitOverflowScrolling: 'touch',
            }}
          >
            {TABS.map((tab) => {
              const isActive = activeTab === tab.id
              const Icon = tab.icon

              return (
                <button
                  key={tab.id}
                  onClick={() => switchTab(tab.id)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '12px 14px',
                    fontSize: 13,
                    fontWeight: isActive ? 700 : 500,
                    color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                    borderBottom: isActive ? '2px solid var(--ddn-red)' : '2px solid transparent',
                    background: 'transparent',
                    borderTop: 'none',
                    borderLeft: 'none',
                    borderRight: 'none',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.15s ease',
                    marginBottom: -1,
                  }}
                >
                  <Icon
                    style={{
                      width: 16,
                      height: 16,
                      color: isActive ? 'var(--ddn-red)' : 'var(--text-muted)',
                    }}
                  />
                  <span>{tab.label}</span>

                  {tab.badge && (
                    <span
                      style={{
                        fontSize: 10,
                        fontWeight: 700,
                        letterSpacing: '0.04em',
                        padding: '1px 7px',
                        borderRadius: 999,
                        background: isActive
                          ? `${tab.badgeColor}20`
                          : 'var(--surface-card)',
                        color: tab.badgeColor ?? 'var(--text-muted)',
                        border: `1px solid ${tab.badgeColor}40`,
                      }}
                    >
                      {tab.badge}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </header>

      {/* ── Main Content Area ── */}
      <main style={{ maxWidth: 1320, margin: '0 auto', padding: '32px 20px', flex: 1, width: '100%' }}>
        {activeTab === 'calculator' && <ROICalculator />}
        {activeTab === 'battlecard' && (
          <CompetitiveBattlecard onNavigateToCalculator={() => switchTab('calculator')} />
        )}
        {activeTab === 'storage' && (
          <StorageComparison
            onNavigateToCalculator={() => switchTab('calculator')}
            onOpenLiveDemo={() => {
              switchTab('calculator')
              setTimeout(() => window.dispatchEvent(new CustomEvent('open-demo-modal')), 50)
            }}
          />
        )}
        {activeTab === 'icp' && (
          <WhoBenefitsICP onNavigateToCalculator={() => switchTab('calculator')} />
        )}
      </main>

      {/* ── Footer ── */}
      <footer
        style={{
          borderTop: '1px solid var(--border-subtle)',
          padding: '24px 20px',
          background: 'var(--surface-primary)',
          fontSize: 12,
          color: 'var(--text-muted)',
          marginTop: 'auto',
        }}
      >
        <div
          style={{
            maxWidth: 1320,
            margin: '0 auto',
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
            alignItems: 'center',
            textAlign: 'center',
          }}
        >
          {/* Quick links to sections */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, justifyContent: 'center' }}>
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => switchTab(t.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: activeTab === t.id ? 'var(--ddn-red)' : 'var(--text-secondary)',
                  fontSize: 12,
                  fontWeight: activeTab === t.id ? 700 : 500,
                  cursor: 'pointer',
                  padding: 0,
                }}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div>
            <strong style={{ color: 'var(--ddn-red)' }}>DDN Infinia</strong> · Persistent AI Memory &amp; KV Cache Storage ·{' '}
            <a
              href="https://www.ddn.com"
              target="_blank"
              rel="noreferrer"
              style={{ color: 'var(--ddn-red)', textDecoration: 'none', fontWeight: 600 }}
            >
              ddn.com
            </a>
            <span style={{ margin: '0 8px', opacity: 0.3 }}>|</span>
            Official NVIDIA Dynamo &amp; NIXL v1.3 Storage Partner. All calculations are configurable estimates.
          </div>
        </div>
      </footer>
    </div>
  )
}
