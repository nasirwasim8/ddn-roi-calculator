import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Users, Server, TrendingDown, Zap, Database, ArrowRight, ChevronRight, Calculator } from 'lucide-react'

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3
      className="text-sm font-semibold mb-3 flex items-center gap-2"
      style={{ color: 'var(--text-primary)' }}
    >
      {children}
    </h3>
  )
}

function TalkingPoint({ icon: _icon, title, body }: { icon: string; title: string; body: string }) {
  return (
    <div
      className="p-3.5 rounded-xl border"
      style={{ background: 'var(--surface-secondary)', borderColor: 'var(--border-subtle)' }}
    >
      <p className="text-xs font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>{title}</p>
      <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{body}</p>
    </div>
  )
}

function StageRow({
  n,
  icon,
  label,
  who,
  detail,
  color,
  last = false,
}: {
  n: number
  icon: React.ReactNode
  label: string
  who: string
  detail: string
  color: string
  last?: boolean
}) {
  const [open, setOpen] = useState(false)
  return (
    <div>
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center gap-4 px-4 py-3.5 rounded-xl border text-left transition-all hover:brightness-105"
        style={{
          background: open ? `${color}08` : 'var(--surface-secondary)',
          borderColor: open ? `${color}40` : 'var(--border-subtle)',
        }}
      >
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 text-white"
          style={{ background: color }}
        >
          {n}
        </div>
        <span style={{ color }}>{icon}</span>
        <span className="font-medium text-sm flex-1" style={{ color: 'var(--text-primary)' }}>
          {label}
        </span>
        <span
          className="text-[10px] px-2 py-0.5 rounded font-mono hidden md:inline"
          style={{
            background: 'var(--surface-card)',
            color: 'var(--text-muted)',
            border: '1px solid var(--border-subtle)',
          }}
        >
          {who}
        </span>
        <ChevronRight
          className="w-4 h-4 shrink-0 transition-transform duration-200"
          style={{
            color: 'var(--text-muted)',
            transform: open ? 'rotate(90deg)' : 'rotate(0deg)',
          }}
        />
      </button>

      {!last && !open && (
        <div className="flex items-center justify-center py-0.5">
          <ArrowRight className="w-3 h-3 rotate-90" style={{ color: 'var(--border-default)' }} />
        </div>
      )}

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div
              className="mx-4 mt-2 mb-3 p-3.5 rounded-xl text-xs leading-relaxed"
              style={{
                background: 'var(--surface-card)',
                color: 'var(--text-secondary)',
                border: '1px solid var(--border-subtle)',
              }}
            >
              {detail}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

interface WhoBenefitsICPProps {
  onNavigateToCalculator?: () => void
}

export default function WhoBenefitsICP({ onNavigateToCalculator }: WhoBenefitsICPProps) {
  const ICPS = [
    {
      n: 1,
      label: 'MLOps / Infra Engineers',
      who: 'GPU utilization & cost per request',
      color: '#1A81AF',
      icon: <Server className="w-4 h-4" />,
      detail:
        'MLOps engineers care about GPU efficiency metrics: tokens/second, utilization%, cost/request. The demo shows concrete reduction in tokens processed per request and the before/after TTFT numbers. KV Cache directly reduces GPU cycles per turn — a metric they already track.',
    },
    {
      n: 2,
      label: 'CTOs / VP Engineering',
      who: 'Infrastructure budget & scale',
      color: '#ED2738',
      icon: <TrendingDown className="w-4 h-4" />,
      detail:
        'C-level executives need CapEx and OpEx numbers. The ROI Calculator translates token savings into DGX servers avoided ($300K each), power savings (kWh/year), and throughput multipliers (92× more users from same hardware). These are CFO-level conversations.',
    },
    {
      n: 3,
      label: 'AI Product Managers',
      who: 'User experience & latency',
      color: '#00C280',
      icon: <Zap className="w-4 h-4" />,
      detail:
        'Product managers measure TTFT (time-to-first-token) as a core UX metric. Sub-100ms TTFT on repeated queries feels instant to users. The Chat Observatory shows this in real-time — same question, 10× faster response on the second ask.',
    },
    {
      n: 4,
      label: 'AI Platform Engineers',
      who: 'vLLM prefix caching at enterprise scale',
      color: '#76B900',
      icon: <Database className="w-4 h-4" />,
      detail:
        'Platform engineers building on vLLM or TensorRT-LLM already know about prefix caching. The DDN story is: "Infinia replaces ephemeral GPU HBM with a persistent, shared object store that survives scaling events and serves your entire GPU fleet." This is a direct architectural upgrade to what they\'re already building.',
    },
    {
      n: 5,
      label: 'Finance / Procurement',
      who: 'Cloud vs on-prem ROI',
      color: '#f59e0b',
      icon: <Users className="w-4 h-4" />,
      detail:
        'Finance needs hard numbers with verifiable assumptions. The ROI Calculator shows the exact formula behind every KPI: servers avoided = ⌈requests/200K⌉ before caching minus after caching. Each assumption (DGX price, power draw, electricity rate) is visible and adjustable.',
    },
  ]

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Core principle banner */}
      <div
        className="p-6 rounded-2xl border"
        style={{ background: 'rgba(26,129,175,0.06)', borderColor: 'rgba(26,129,175,0.25)' }}
      >
        <div className="flex items-start gap-4">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 text-white font-bold shadow-sm"
            style={{ background: '#1A81AF' }}
          >
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-[#1A81AF]">
                Persona Alignment
              </span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#1A81AF]/15 text-[#1A81AF] border border-[#1A81AF]/30">
                5 Executive Profiles
              </span>
            </div>
            <h2 className="text-xl font-bold text-[var(--text-primary)]">
              Core Principle — Every persona sees a different ROI, all from the same architecture
            </h2>
            <p className="text-xs leading-relaxed text-[var(--text-secondary)] mt-2 max-w-4xl">
              The same DDN Infinia deployment delivers value across all tiers of the organization.
              Lead with the metric that resonates with each audience — then use the ROI Calculator
              to translate it into their operational language. The technology is unified; the business impact is multifaceted.
            </p>
          </div>
        </div>
      </div>

      {/* ICP pipeline (clickable) */}
      <div>
        <SectionTitle>
          <Users className="w-4 h-4" style={{ color: '#1A81AF' }} />
          Who Benefits Most — Ideal Customer Profiles (Click to expand)
        </SectionTitle>
        <div className="flex flex-col gap-1.5">
          {ICPS.map((icp, i) => (
            <StageRow key={icp.n} {...icp} last={i === ICPS.length - 1} />
          ))}
        </div>
      </div>

      {/* Demo route by persona */}
      <div>
        <SectionTitle>
          <ArrowRight className="w-4 h-4" style={{ color: '#76B900' }} /> Recommended Demo Route &amp; Proof Points by Audience
        </SectionTitle>
        <div className="overflow-x-auto rounded-xl border" style={{ borderColor: 'var(--border-subtle)' }}>
          <table className="w-full text-xs">
            <thead>
              <tr style={{ background: 'var(--surface-secondary)' }}>
                <th className="px-4 py-3 text-left font-semibold" style={{ color: 'var(--text-secondary)' }}>Audience</th>
                <th className="px-4 py-3 text-left font-semibold" style={{ color: 'var(--text-secondary)' }}>Lead With</th>
                <th className="px-4 py-3 text-left font-semibold" style={{ color: 'var(--text-secondary)' }}>Close With</th>
              </tr>
            </thead>
            <tbody>
              {[
                { audience: 'MLOps / Infra', lead: 'Token count reduction (Prefix Cache Hit Rate)', close: 'GPU-hours freed/year & throughput headroom', color: '#1A81AF' },
                { audience: 'CTO / VP Eng', lead: 'Throughput multiplier & concurrency scaling', close: 'CapEx avoided ($300K per DGX H100)', color: '#ED2738' },
                { audience: 'AI Product', lead: 'TTFT difference on HIT vs MISS (<100ms)', close: 'Session Resume across any node in the cluster', color: '#00C280' },
                { audience: 'Platform Eng', lead: 'NVIDIA Dynamo native container plugin & NIXL', close: 'Zero-copy RDMA bypassing CPU & POSIX layers', color: '#76B900' },
                { audience: 'Finance / Procurement', lead: 'Neocloud (NCP) 87% gross margin expansion', close: 'Transparent slider formulas & payback period', color: '#f59e0b' },
              ].map((row, i) => (
                <tr
                  key={row.audience}
                  style={{
                    background: i % 2 === 0 ? 'var(--surface-card)' : 'var(--surface-secondary)',
                    borderTop: '1px solid var(--border-subtle)',
                  }}
                >
                  <td className="px-4 py-3 font-semibold" style={{ color: row.color }}>{row.audience}</td>
                  <td className="px-4 py-3" style={{ color: 'var(--text-secondary)' }}>{row.lead}</td>
                  <td className="px-4 py-3 font-medium" style={{ color: 'var(--text-primary)' }}>{row.close}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Talking points */}
      <div>
        <SectionTitle><ArrowRight className="w-4 h-4" style={{ color: '#00C280' }} /> Core Executive Messaging</SectionTitle>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <TalkingPoint icon="🎯" title="Lead with useful tokens/second" body="Not raw tokens/second — useful tokens/second. How much of your GPU's compute is generating new business value vs re-reading context it already knows? That ratio is determined by your storage architecture." />
          <TalkingPoint icon="📊" title="Defensible & Transparent Math" body="Every calculation in the ROI model exposes its mathematical derivation: concurrency expansion, avoided node counts, power savings, and gross margin delta. No black-box projections." />
          <TalkingPoint icon="🔢" title="Dynamic Interactive Controls" body="Every assumption is visible and slider-controlled. Let customers plug in their real workload parameters — prompt lengths, concurrency, cluster size, and power cost. This builds instant credibility." />
          <TalkingPoint icon="🏢" title="Neoclouds & Contact Centers" body="Neocloud inference providers expand gross margin from 45% to 87%. Enterprise contact centers avoid millions in redundant GPU servers. Start with the preset closest to their scale." />
        </div>
      </div>

      {/* Interactive CTA to ROI Calculator */}
      {onNavigateToCalculator && (
        <div
          className="p-5 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{
            background: 'linear-gradient(135deg, rgba(26,129,175,0.06) 0%, rgba(237,39,56,0.06) 100%)',
            borderColor: 'var(--border-subtle)',
          }}
        >
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Calculator className="w-4 h-4 text-[#1A81AF]" />
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)]">
                Launch The Financial Simulation
              </span>
            </div>
            <p className="text-xs text-[var(--text-secondary)] max-w-xl">
              Select your persona preset (Neocloud, Enterprise Contact Center, Code Assistant, Multi-Turn Agent) and see immediate ROI metrics.
            </p>
          </div>
          <button
            onClick={onNavigateToCalculator}
            className="px-5 py-2.5 rounded-xl font-bold text-xs text-white shadow-sm flex items-center gap-2 shrink-0 transition-transform active:scale-95"
            style={{ background: 'var(--ddn-red)' }}
          >
            <span>Open ROI Calculator</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  )
}
