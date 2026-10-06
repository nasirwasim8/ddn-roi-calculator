import React from 'react'
import { HardDrive, Server, Trophy, Award, Zap, TrendingUp, RefreshCw, Cpu, Database, ArrowRight, Calculator } from 'lucide-react'

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
}

export default function StorageComparison({ onNavigateToCalculator }: StorageComparisonProps) {
  const ROWS = [
    { metric: 'Capacity', gpu: '~2–8 GB (shares VRAM with model weights)', infinia: 'Petabytes — unlimited sessions', winner: 'infinia' },
    { metric: 'Speed (read)', gpu: '< 1ms (on-chip HBM)', infinia: '< 1ms via GPU-Direct RDMA (NIXL)', winner: 'both' },
    { metric: 'Transfer protocol', gpu: 'N/A — memory-mapped on-chip', infinia: 'Zero-copy RDMA — bypasses CPU entirely', winner: 'infinia' },
    { metric: 'Persistence', gpu: '❌ Lost on session end or restart', infinia: '✅ Indefinite (S3/KV tier) — survives pod restart', winner: 'infinia' },
    { metric: 'Cross-GPU sharing', gpu: '❌ Node-local only', infinia: '✅ Any GPU node can fetch any session\'s KV state', winner: 'infinia' },
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

      {/* Comparison table */}
      <div>
        <SectionTitle>
          <Server className="w-4 h-4" style={{ color: '#1A81AF' }} /> Side-by-Side Comparison: GPU VRAM vs DDN Infinia
        </SectionTitle>
        <div className="overflow-x-auto rounded-xl border" style={{ borderColor: 'var(--border-subtle)' }}>
          <table className="w-full text-xs">
            <thead>
              <tr style={{ background: 'var(--surface-secondary)' }}>
                <th className="px-4 py-3.5 text-left font-semibold" style={{ color: 'var(--text-secondary)' }}>Feature</th>
                <th className="px-4 py-3.5 text-center font-semibold" style={{ color: '#76B900' }}>GPU VRAM Cache</th>
                <th className="px-4 py-3.5 text-center font-semibold" style={{ color: '#ED2738' }}>DDN Infinia</th>
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
                  <td className="px-4 py-3.5 font-semibold" style={{ color: 'var(--text-primary)' }}>{row.metric}</td>
                  <td
                    className="px-4 py-3.5 text-center"
                    style={{
                      color: (row.winner === 'gpu' || row.winner === 'both') ? '#76B900' : 'var(--text-secondary)',
                      background: (row.winner === 'gpu' || row.winner === 'both') ? 'rgba(118,185,0,0.06)' : undefined,
                    }}
                  >
                    {(row.winner === 'gpu' || row.winner === 'both') && <span className="mr-1">⭐</span>}{row.gpu}
                  </td>
                  <td
                    className="px-4 py-3.5 text-center font-medium"
                    style={{
                      color: (row.winner === 'infinia' || row.winner === 'both') ? '#ED2738' : 'var(--text-secondary)',
                      background: (row.winner === 'infinia' || row.winner === 'both') ? 'rgba(237,39,56,0.04)' : undefined,
                    }}
                  >
                    {(row.winner === 'infinia' || row.winner === 'both') && <span className="mr-1">⭐</span>}{row.infinia}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Bottom line summary */}
        <div className="mt-4 p-4 rounded-xl" style={{ background: 'rgba(237,39,56,0.05)', border: '1px solid rgba(237,39,56,0.15)' }}>
          <div className="text-sm font-semibold mb-1 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
            <Trophy className="w-4 h-4" style={{ color: '#ED2738' }} /> Bottom line for enterprise AI:
          </div>
          <div className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            With NIXL + GPU-Direct RDMA, DDN Infinia delivers <strong>&lt;1ms KV cache retrieval</strong> —
            the same speed class as GPU HBM, but with petabyte capacity and full persistence.
            The recompute tax of <strong>4,000–8,000ms per prefill is eliminated</strong> across your entire GPU fleet.
          </div>
        </div>

        {/* DDN Exclusivity Banner */}
        <div className="mt-4 rounded-xl overflow-hidden" style={{ border: '1px solid rgba(118,185,0,0.4)' }}>
          <div
            className="px-4 py-2.5 flex items-center gap-2"
            style={{ background: 'linear-gradient(90deg, rgba(118,185,0,0.15) 0%, rgba(118,185,0,0.05) 100%)' }}
          >
            <Award className="w-4 h-4 shrink-0" style={{ color: '#76B900' }} />
            <span className="text-xs font-black uppercase tracking-widest" style={{ color: '#76B900' }}>
              DDN — First Storage Vendor Natively in the NVIDIA Dynamo Container
            </span>
          </div>
          <div className="p-4 space-y-3" style={{ background: 'var(--surface-card)' }}>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              DDN is the <strong style={{ color: '#76B900' }}>first storage vendor</strong> to have its Infinia plugin
              natively bundled inside the <strong>NVIDIA NIXL package v1.3</strong> (NVIDIA Inference Xfer Library,
              released July 2026) — the transport layer that ships inside every official NVIDIA Dynamo container.
              Pull the Dynamo container, point it at Infinia, and KV cache acceleration is live with <strong>zero code changes</strong>.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { Icon: Zap,       stat: '< 1ms', label: 'KV retrieval',         sub: 'GPU-Direct RDMA vs 300–500ms S3 HTTP',      color: '#76B900' },
                { Icon: TrendingUp, stat: '25×',   label: 'Faster context load',  sub: '2.1s vs 57s baseline (Qwen3-32B, 131K ctx)', color: '#76B900' },
                { Icon: RefreshCw, stat: '100K+', label: 'AI calls / second',     sub: 'sustained concurrency at scale',             color: '#76B900' },
                { Icon: Cpu,       stat: '−90%',  label: 'CPU utilization',       sub: 'zero-copy RDMA bypasses CPU entirely',       color: '#76B900' },
              ].map(s => (
                <div
                  key={s.stat}
                  className="p-3 rounded-lg text-center"
                  style={{ background: 'rgba(118,185,0,0.06)', border: '1px solid rgba(118,185,0,0.15)' }}
                >
                  <div className="flex justify-center mb-1"><s.Icon className="w-5 h-5" style={{ color: s.color }} /></div>
                  <div className="font-black text-xl" style={{ color: '#76B900' }}>{s.stat}</div>
                  <div className="text-[11px] font-semibold mt-0.5" style={{ color: 'var(--text-secondary)' }}>{s.label}</div>
                  <div className="text-[10px] mt-0.5" style={{ color: 'var(--text-muted)' }}>{s.sub}</div>
                </div>
              ))}
            </div>
            <p className="text-[10px] leading-relaxed" style={{ color: 'var(--text-muted)' }}>
              Source: DDN.com · NVIDIA NIXL v1.3 (github.com/ai-dynamo/nixl) · UCX RDMA transport (InfiniBand / RoCE) ·
              75% reduction in input-token processing costs · 99% GPU utilization reported by DDN
            </p>
          </div>
        </div>
      </div>

      {/* Talking points */}
      <div>
        <SectionTitle><Database className="w-4 h-4" style={{ color: '#00C280' }} /> The Business Case</SectionTitle>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <TalkingPoint icon="⚡" title="70ms vs 4,000ms" body="The Infinia read overhead is 70ms. The prefill cost it avoids is 4,000–8,000ms. The tradeoff is 57× in your favour on every cache hit." />
          <TalkingPoint icon="🔗" title="Cross-GPU sharing is the key" body="GPU VRAM can't be shared between nodes. Infinia is a shared object store — any GPU in the cluster can serve any user's session without recomputation." />
          <TalkingPoint icon="💾" title="Storage cost is negligible" body="An 11MB KV state stored for 24 hours costs ~$0.000007. GPU VRAM costs $2.80/hour to run — and it can only hold dozens of sessions simultaneously." />
          <TalkingPoint icon="📈" title="Scales with your fleet" body="As you add GPU nodes, each one gains instant access to all cached sessions in Infinia. No warm-up, no replication, no coordination overhead." />
        </div>
      </div>

      {/* Interactive CTA to ROI Calculator */}
      {onNavigateToCalculator && (
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
