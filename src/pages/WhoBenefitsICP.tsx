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
      label: 'MLOps & Infrastructure Engineers',
      who: 'GPU Compute Efficiency, Prefill Tax, & Tokens/Sec/Watt',
      color: '#1A81AF',
      icon: <Server className="w-4 h-4" />,
      detail:
        'MLOps teams track GPU compute saturation: TTFT (Time-To-First-Token), prefill compute vs decode efficiency, and tokens/sec/watt. Without persistent KV caching, 80%+ of GPU compute is repeatedly burned re-computing attention tensors for shared system prompts, tool definitions, and multi-turn context. DDN Infinia transforms this O(N²) prefill penalty into an O(1) RDMA retrieval, slashing prefill times from seconds to sub-100ms and freeing GPU compute for useful generative decode turns.',
    },
    {
      n: 2,
      label: 'CTOs & VP of Engineering',
      who: 'Capacity Scaling, Cluster Deferral, & Power Envelope',
      color: '#ED2738',
      icon: <TrendingDown className="w-4 h-4" />,
      detail:
        'Engineering leaders face strict power, thermal, and capital ceilings. Expanding an AI cluster by adding 8-way GPU servers incurs substantial capital costs (typically $300K–$400K+ fully configured per node) plus megawatts of scarce data center power. The ROI Calculator models how offloading KV state to persistent Infinia storage yields 2×–5× concurrent stream capacity on existing nodes, deferring multimillion-dollar cluster expansions and keeping deployments within existing power and cooling budgets.',
    },
    {
      n: 3,
      label: 'AI Product Managers',
      who: 'Perceived Latency (TTFT), Long Contexts, & User Experience',
      color: '#00C280',
      icon: <Zap className="w-4 h-4" />,
      detail:
        'Product managers optimize Time-To-First-Token (TTFT) and user retention. When users wait 3–6 seconds for an agent to re-ingest a 32K–128K document or system context, engagement drops. With Infinia KV caching, repeated turns and multi-agent workflows hit warm cache tensors in tens of milliseconds, providing immediate streaming response that feels conversational and responsive, while enabling richer, deeper context windows without UX penalties.',
    },
    {
      n: 4,
      label: 'AI Platform & Systems Architects',
      who: 'Distributed Prefix Caching, vLLM / Dynamo, & NIXL RDMA',
      color: '#76B900',
      icon: <Database className="w-4 h-4" />,
      detail:
        'Platform architects running vLLM, TensorRT-LLM, or NVIDIA Dynamo recognize the ceiling of node-local VRAM: GPU memory is volatile, node-confined, and evicts rapidly under concurrency. DDN Infinia extends local PagedAttention into a cluster-wide, persistent key-value tier. Leveraging zero-copy GPU-Direct RDMA via NVIDIA NIXL v1.3, any GPU node in the cluster instantly reuses KV states cached by any other node with zero host CPU serialization.',
    },
    {
      n: 5,
      label: 'Finance & Procurement Executives',
      who: 'CapEx Avoidance, Payback Period, & Neocloud Gross Margin',
      color: '#f59e0b',
      icon: <Users className="w-4 h-4" />,
      detail:
        'Finance teams require defensible, auditable math rather than fixed vendor claims. The ROI Calculator exposes every parameter: server node replacement cost, power draw per chassis, PUE, electricity tariff ($/kWh), or cloud GPU hourly rate ($/GPU-hr). For Neocloud inference providers, it models gross margin expansion from ~45% to ~87% by eliminating redundant GPU-hours, demonstrating cash-flow payback in under 6 months.',
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
                { audience: 'MLOps / Infra', lead: 'TTFT & Prefill Reduction (Cold vs Warm telemetry)', close: 'GPU-hours freed/year & decode compute density', color: '#1A81AF' },
                { audience: 'CTO / VP Eng', lead: 'Concurrency Multiplier (2×–5× stream headroom)', close: 'CapEx avoided (deferred node purchases) & power limits', color: '#ED2738' },
                { audience: 'AI Product', lead: 'Conversational Responsiveness (sub-100ms TTFT)', close: 'Long-context retention & multi-turn agent UX', color: '#00C280' },
                { audience: 'Platform Eng', lead: 'NVIDIA Dynamo NIXL container integration & RDMA', close: 'Cluster-wide cross-node KV sharing (bypassing POSIX)', color: '#76B900' },
                { audience: 'Finance / Neocloud', lead: 'Neocloud Gross Margin Expansion (45% → 87%)', close: 'Configurable TCO model & hardware payback timeline', color: '#f59e0b' },
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
          <TalkingPoint icon="🎯" title="Lead with useful tokens/second" body="Raw tokens/second is a deceptive vanity metric if 80% of the GPU compute is spent re-digesting the exact same system prompt or context window. What matters is useful generation tokens per second per dollar. Persistent KV cache maximizes this ratio by eliminating redundant prefill computation." />
          <TalkingPoint icon="📊" title="Production Stack with Live vLLM &amp; Infinia" body="This demo is powered by a production-grade inference stack: vLLM v1 engine with LMCache and DDN Infinia S3/RDMA storage substrate. Cold vs warm latency, token counts, and hit rates are live telemetry measured directly from GPU and storage calls — not static estimates." />
          <TalkingPoint icon="🔢" title="Completely Transparent &amp; Defensible Math" body="Every formula in the ROI Calculator is transparent and slider-controlled. Customers can adjust their exact hardware cost, cluster size, power tariffs, prompt lengths, and concurrency targets. Grounding the business case in their own numbers builds immediate confidence." />
          <TalkingPoint icon="🏢" title="Neocloud &amp; Enterprise Scale Scenarios" body="Whether modeling an enterprise contact center saving megawatts of power or a Neocloud inference provider scaling gross margins from 45% to 87% at $2.50/GPU-hr, the model proves that data architecture — not just raw GPU silicon — dictates AI economics." />
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
