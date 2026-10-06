import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HardDrive, Server, Trophy, Award, Zap, TrendingUp, RefreshCw, Cpu, Database, ArrowRight, Calculator, ExternalLink, ChevronDown, Play } from 'lucide-react'

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

interface StorageComparisonProps {
  onNavigateToCalculator?: () => void
  onOpenLiveDemo?: () => void
}

export default function StorageComparison({ onNavigateToCalculator, onOpenLiveDemo }: StorageComparisonProps) {
  const [tableOpen, setTableOpen] = useState(false)

  const ROWS = [
    { metric: 'Capacity', gpu: '~2–8 GB (shares VRAM with model weights)', infinia: 'Petabytes — unlimited sessions', winner: 'infinia' },
    { metric: 'Speed (read)', gpu: '< 1ms (on-chip HBM)', infinia: '< 1ms via GPU-Direct RDMA (NIXL)', winner: 'both' },
    { metric: 'Transfer protocol', gpu: 'N/A — memory-mapped on-chip', infinia: 'Zero-copy RDMA — bypasses CPU entirely', winner: 'infinia' },
    { metric: 'Persistence', gpu: 'Ephemeral — lost on session end or restart', infinia: 'Persistent (S3/KV tier) — survives pod restart', winner: 'infinia' },
    { metric: 'Cross-GPU sharing', gpu: 'Node-local only — isolated to single server', infinia: 'Cluster-wide — any GPU node can fetch any session', winner: 'infinia' },
    { metric: 'Cost per GB', gpu: '~$30–50/GB (H100 HBM amortized)', infinia: '~$0.002/GB/mo (enterprise NVMe KV tier)', winner: 'infinia' },
    { metric: 'Failure blast radius', gpu: 'Node failure = all in-flight KV lost', infinia: 'Replicated KV — any node resumes any session', winner: 'infinia' },
  ]

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Core principle banner */}
      <div
        className="p-6 rounded-2xl border"
        style={{ background: 'rgba(118,185,0,0.06)', borderColor: 'rgba(118,185,0,0.25)' }}
      >
        <div className="flex items-start gap-4">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 text-white font-bold shadow-sm"
            style={{ background: '#76B900' }}
          >
            <HardDrive className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-[#76B900]">
                Tiered Memory Architecture
              </span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#76B900]/15 text-[#76B900] border border-[#76B900]/30">
                HBM vs. Infinia RDMA
              </span>
            </div>
            <h2 className="text-xl font-bold text-[var(--text-primary)]">
              Core Principle — Speed on-chip. Scale in Infinia.
            </h2>
            <p className="text-xs leading-relaxed text-[var(--text-secondary)] mt-2 max-w-4xl">
              GPU HBM is fast but <strong>finite and volatile</strong>. DDN Infinia with NIXL delivers{' '}
              <strong>sub-1ms GPU-Direct RDMA transfers</strong> — matching HBM speed — while providing{' '}
              <strong>unlimited, persistent, shared</strong> KV storage across your entire GPU cluster.
              At scale (50K+ requests/day), Infinia is the only tier that is both fast enough and large enough.
            </p>
          </div>
        </div>
      </div>

      {/* ── HERO FOCUS: DDN Exclusivity in NVIDIA Dynamo Container ── */}
      <div
        className="rounded-2xl overflow-hidden border shadow-sm"
        style={{ borderColor: 'rgba(118,185,0,0.4)', background: 'var(--surface-card)' }}
      >
        <div
          className="px-5 py-3.5 flex flex-wrap items-center justify-between gap-3"
          style={{
            background: 'linear-gradient(90deg, rgba(118,185,0,0.18) 0%, rgba(118,185,0,0.06) 100%)',
            borderBottom: '1px solid rgba(118,185,0,0.25)',
          }}
        >
          <div className="flex items-center gap-2.5">
            <Award className="w-5 h-5 shrink-0" style={{ color: '#76B900' }} />
            <div>
              <span className="text-xs font-black uppercase tracking-widest text-[#76B900] block">
                NVIDIA Official Partner Integration
              </span>
              <span className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
                DDN — First Storage Vendor Natively in the NVIDIA Dynamo Container
              </span>
            </div>
          </div>

          {/* Official Blog Link Button */}
          <a
            href="https://www.ddn.com/blog/ddn-becomes-the-first-storage-vendor-natively-integrated-into-nvidia-kv-cache-management/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white transition-all shadow-sm hover:brightness-110 active:scale-95"
            style={{ background: '#76B900' }}
          >
            <span>Read Official NVIDIA Dynamo Announcement on DDN.com</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        <div className="p-5 space-y-4">
          <p className="text-xs leading-relaxed text-[var(--text-secondary)]">
            DDN is the <strong style={{ color: '#76B900' }}>first storage vendor</strong> to have its Infinia plugin
            natively bundled inside the <strong>NVIDIA NIXL package v1.3</strong> (NVIDIA Inference Xfer Library,
            released July 2026) — the transport layer that ships inside every official NVIDIA Dynamo container.
            Pull the Dynamo container, point it at Infinia, and KV cache acceleration is live with <strong>zero code changes</strong>.
          </p>

          {/* 4 Hero Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { Icon: Zap,        stat: '< 1ms',  label: 'KV Retrieval Latency',   sub: 'GPU-Direct RDMA vs 300–500ms S3 HTTP',      color: '#76B900' },
              { Icon: TrendingUp, stat: '25×',    label: 'Faster Context Load',    sub: '2.1s vs 57s baseline (Qwen3-32B, 131K ctx)', color: '#76B900' },
              { Icon: RefreshCw,  stat: '100K+',  label: 'AI Calls / Second',       sub: 'sustained multi-tenant concurrency',        color: '#76B900' },
              { Icon: Cpu,        stat: '−90%',   label: 'Host CPU Utilization',    sub: 'zero-copy RDMA bypasses CPU entirely',       color: '#76B900' },
            ].map((s) => (
              <div
                key={s.stat}
                className="p-3.5 rounded-xl text-center"
                style={{ background: 'rgba(118,185,0,0.06)', border: '1px solid rgba(118,185,0,0.18)' }}
              >
                <div className="flex justify-center mb-1"><s.Icon className="w-5 h-5" style={{ color: s.color }} /></div>
                <div className="font-black text-xl" style={{ color: '#76B900' }}>{s.stat}</div>
                <div className="text-[11px] font-bold mt-0.5" style={{ color: 'var(--text-primary)' }}>{s.label}</div>
                <div className="text-[10px] mt-0.5 leading-snug" style={{ color: 'var(--text-muted)' }}>{s.sub}</div>
              </div>
            ))}
          </div>

          <div
            className="p-3.5 rounded-xl text-[11px] leading-relaxed flex items-center justify-between gap-3 flex-wrap"
            style={{ background: 'var(--surface-secondary)', border: '1px solid var(--border-subtle)' }}
          >
            <span style={{ color: 'var(--text-muted)' }}>
              Source: DDN.com · NVIDIA NIXL v1.3 (github.com/ai-dynamo/nixl) · UCX RDMA transport (InfiniBand / RoCE) · 75% reduction in input-token processing costs · 99% GPU utilization reported by DDN
            </span>
            <a
              href="https://www.ddn.com/blog/ddn-becomes-the-first-storage-vendor-natively-integrated-into-nvidia-kv-cache-management/"
              target="_blank"
              rel="noreferrer"
              className="text-[#76B900] font-bold underline inline-flex items-center gap-1 shrink-0"
            >
              <span>View Press Release</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>

      {/* The Business Case Talking Points */}
      <div>
        <SectionTitle><Database className="w-4 h-4" style={{ color: '#00C280' }} /> The Business Case</SectionTitle>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <TalkingPoint icon="⚡" title="70ms vs 4,000ms" body="The Infinia read overhead is 70ms. The prefill cost it avoids is 4,000–8,000ms. The tradeoff is 57× in your favour on every cache hit." />
          <TalkingPoint icon="🔗" title="Cross-GPU sharing is the key" body="GPU VRAM can't be shared between nodes. Infinia is a shared object store — any GPU in the cluster can serve any user's session without recomputation." />
          <TalkingPoint icon="💾" title="Storage cost is negligible" body="An 11MB KV state stored for 24 hours costs ~$0.000007. GPU VRAM costs $2.80/hour to run — and it can only hold dozens of sessions simultaneously." />
          <TalkingPoint icon="📈" title="Scales with your fleet" body="As you add GPU nodes, each one gains instant access to all cached sessions in Infinia. No warm-up, no replication, no coordination overhead." />
        </div>
      </div>

      {/* Bottom line callout */}
      <div className="p-4 rounded-xl" style={{ background: 'rgba(237,39,56,0.05)', border: '1px solid rgba(237,39,56,0.15)' }}>
        <div className="text-sm font-semibold mb-1 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
          <Trophy className="w-4 h-4" style={{ color: '#ED2738' }} /> Bottom line for enterprise AI:
        </div>
        <div className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          With NIXL + GPU-Direct RDMA, DDN Infinia delivers <strong>&lt;1ms KV cache retrieval</strong> —
          the same speed class as GPU HBM, but with petabyte capacity and full persistence.
          The recompute tax of <strong>4,000–8,000ms per prefill is eliminated</strong> across your entire GPU fleet.
        </div>
      </div>

      {/* ── COLLAPSED BY DEFAULT: Side-by-Side Comparison Table at the Bottom (NO EMOJIS) ── */}
      <div className="pt-2">
        <button
          onClick={() => setTableOpen((o) => !o)}
          className="w-full flex items-center justify-between p-4 rounded-xl border text-left transition-all hover:brightness-105"
          style={{ background: 'var(--surface-secondary)', borderColor: 'var(--border-subtle)' }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold"
              style={{ background: 'rgba(26,129,175,0.15)', color: '#1A81AF' }}
            >
              <Server className="w-4 h-4" />
            </div>
            <div>
              <div className="text-sm font-bold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                Side-by-Side Comparison: GPU VRAM vs DDN Infinia
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[var(--surface-card)] text-[var(--text-muted)] border">
                  7 Technical Dimensions
                </span>
              </div>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">
                {tableOpen
                  ? 'Click to collapse comparison matrix'
                  : 'Click to expand side-by-side capacity, latency, persistence, and protocol comparison'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-[var(--text-muted)] hidden sm:inline">
              {tableOpen ? 'Collapse' : 'Expand Matrix'}
            </span>
            <ChevronDown
              className="w-5 h-5 transition-transform duration-200"
              style={{ color: 'var(--text-muted)', transform: tableOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
            />
          </div>
        </button>

        <AnimatePresence>
          {tableOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden mt-3"
            >
              <div className="overflow-x-auto rounded-xl border" style={{ borderColor: 'var(--border-subtle)' }}>
                <table className="w-full text-xs">
                  <thead>
                    <tr style={{ background: 'var(--surface-secondary)' }}>
                      <th className="px-4 py-3.5 text-left font-semibold" style={{ color: 'var(--text-secondary)' }}>
                        Feature
                      </th>
                      <th className="px-4 py-3.5 text-center font-semibold" style={{ color: '#76B900' }}>
                        GPU VRAM Cache
                      </th>
                      <th className="px-4 py-3.5 text-center font-semibold" style={{ color: '#ED2738' }}>
                        DDN Infinia
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {ROWS.map((row, i) => (
                      <tr
                        key={row.metric}
                        style={{
                          background: i % 2 === 0 ? 'var(--surface-card)' : 'var(--surface-secondary)',
                          borderTop: '1px solid var(--border-subtle)',
                        }}
                      >
                        <td className="px-4 py-3.5 font-semibold" style={{ color: 'var(--text-primary)' }}>
                          {row.metric}
                        </td>
                        <td
                          className="px-4 py-3.5 text-center"
                          style={{
                            color: row.winner === 'gpu' || row.winner === 'both' ? '#76B900' : 'var(--text-secondary)',
                            fontWeight: row.winner === 'gpu' || row.winner === 'both' ? 600 : 400,
                            background: row.winner === 'gpu' || row.winner === 'both' ? 'rgba(118,185,0,0.06)' : undefined,
                          }}
                        >
                          {row.gpu}
                        </td>
                        <td
                          className="px-4 py-3.5 text-center font-medium"
                          style={{
                            color: row.winner === 'infinia' || row.winner === 'both' ? '#ED2738' : 'var(--text-secondary)',
                            fontWeight: row.winner === 'infinia' || row.winner === 'both' ? 700 : 400,
                            background:
                              row.winner === 'infinia' || row.winner === 'both' ? 'rgba(237,39,56,0.06)' : undefined,
                          }}
                        >
                          {row.infinia}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Interactive CTA to ROI Calculator + Live Demo */}
      <div
        className="p-5 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-4"
        style={{
          background: 'linear-gradient(135deg, rgba(118,185,0,0.06) 0%, rgba(237,39,56,0.06) 100%)',
          borderColor: 'var(--border-subtle)',
        }}
      >
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Calculator className="w-4 h-4 text-[#76B900]" />
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)]">
              Calculate CapEx Avoidance &amp; Power Savings
            </span>
          </div>
          <p className="text-xs text-[var(--text-secondary)] max-w-xl">
            See how offloading KV state to DDN Infinia frees up GPU memory to boost concurrent streams and eliminate unneeded DGX servers.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          {onOpenLiveDemo && (
            <button
              onClick={onOpenLiveDemo}
              className="px-4 py-2.5 rounded-xl font-bold text-xs text-[var(--text-primary)] border border-[var(--border-subtle)] bg-[var(--surface-card)] hover:bg-[var(--surface-secondary)] flex items-center gap-2 transition-transform active:scale-95"
            >
              <Play className="w-3.5 h-3.5 text-[#ED2738]" fill="#ED2738" />
              <span>Watch Live Demo</span>
            </button>
          )}
          {onNavigateToCalculator && (
            <button
              onClick={onNavigateToCalculator}
              className="px-5 py-2.5 rounded-xl font-bold text-xs text-white shadow-sm flex items-center gap-2 transition-transform active:scale-95"
              style={{ background: 'var(--ddn-red)' }}
            >
              <span>Open ROI Calculator</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
