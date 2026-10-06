import React from 'react'
import { Trophy, RefreshCw, Layers, Award, ArrowRight, Calculator, CheckCircle2, ShieldCheck } from 'lucide-react'

function Tag({ children, color }: { children: React.ReactNode; color?: string }) {
  return (
    <span
      className="text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wide inline-flex items-center gap-1"
      style={{
        background: color ? `${color}18` : 'var(--surface-secondary)',
        color: color ?? 'var(--text-muted)',
        border: `1px solid ${color ? `${color}30` : 'var(--border-subtle)'}`,
      }}
    >
      {children}
    </span>
  )
}

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

interface CompetitiveBattlecardProps {
  onNavigateToCalculator?: () => void
}

export default function CompetitiveBattlecard({ onNavigateToCalculator }: CompetitiveBattlecardProps) {
  const comparisonRows = [
    {
      feature: "Fundamental storage architecture",
      infinia: "Distributed KV store",
      infiniaHighlight: true,
      weka: "Distributed filesystem",
      vast: "Element Store",
      note: "Infinia is designed from the silicon up as a distributed key-value store, not a filesystem adapted for AI."
    },
    {
      feature: "Public KV cache persistent interface",
      infinia: "Native Infinia / KV oriented path",
      infiniaHighlight: true,
      weka: "WekaFS",
      vast: "FS tier",
      note: "Direct key-addressable protocol bypassing POSIX layers."
    },
    {
      feature: "Filesystem required for documented KV path",
      infinia: "No, for direct Infinia NIXL path",
      infiniaHighlight: true,
      weka: "Yes",
      vast: "Yes in current documented implementations",
      note: "Eliminates mount points, inode limits, and directory locking entirely."
    },
    {
      feature: "LMCache support",
      infinia: "Yes",
      infiniaHighlight: false,
      weka: "Yes",
      vast: "Yes",
      note: "All three vendors support the open-source LMCache interface."
    },
    {
      feature: "Dynamo support",
      infinia: "Yes",
      infiniaHighlight: false,
      weka: "Yes",
      vast: "Yes",
      note: "Integrated with NVIDIA Dynamo inference framework."
    },
    {
      feature: "NIXL integration",
      infinia: "Native Infinia plugin",
      infiniaHighlight: true,
      weka: "Custom WEKA NIXL plugin",
      vast: "GDS / Dynamo paths documented",
      note: "DDN ships native plugin inside the official NVIDIA Dynamo container."
    },
    {
      feature: "GPU Direct Storage (GDS)",
      infinia: "Architecture can bypass conventional FS path",
      infiniaHighlight: true,
      weka: "Yes",
      vast: "Yes",
      note: "Direct DMA transfer between GPU HBM and storage media without host memory copies."
    },
    {
      feature: "RDMA transport",
      infinia: "jRPC/RDMA",
      infiniaHighlight: true,
      weka: "RDMA",
      vast: "NFS/RDMA",
      note: "Ultra-low-latency remote procedure calls over InfiniBand and RoCE."
    },
    {
      feature: "Persistent namespace model",
      infinia: "KV / object centric",
      infiniaHighlight: true,
      weka: "File centric",
      vast: "Unified Element Store exposed through FS for documented KV path",
      note: "Flat O(1) hash namespace eliminates directory tree traversals."
    },
    {
      feature: "Example access abstraction",
      infinia: "key → value",
      infiniaHighlight: true,
      weka: "path/file → bytes",
      vast: "path/file → bytes in documented KV implementations",
      note: "Infinia retrieves tensors directly by token SHA-256 hash."
    },
    {
      feature: "Current competitive differentiator",
      infinia: "Direct KV substrate",
      infiniaHighlight: true,
      weka: "Extremely optimized filesystem",
      vast: "Unified architecture with optimized NFS/RDMA",
      note: "Zero POSIX metadata overhead + resilient to high-churn cache eviction."
    },
  ]

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Executive banner */}
      <div
        className="p-6 rounded-2xl border"
        style={{
          background: 'linear-gradient(135deg, rgba(237,39,56,0.08) 0%, rgba(237,39,56,0.02) 100%)',
          borderColor: 'rgba(237,39,56,0.3)',
        }}
      >
        <div className="flex items-start gap-4">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 text-white font-bold shadow-md"
            style={{ background: 'var(--ddn-red)' }}
          >
            <Trophy className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--ddn-red)]">
                Competitive Architecture Battlecard
              </span>
              <Tag color="var(--ddn-red)">DDN Infinia vs WEKA vs VAST</Tag>
              <Tag color="#76B900">NVIDIA Dynamo NIXL Partner</Tag>
            </div>
            <h2 className="text-xl font-bold text-[var(--text-primary)]">
              Why Native Key-Value Substrates Dominate LLM KV Caching
            </h2>
            <p className="text-xs leading-relaxed text-[var(--text-secondary)] mt-2 max-w-4xl">
              File systems (WEKA) and Element Stores (VAST) were engineered to serve hierarchical directory paths and file-byte offsets.
              In LLM inference, context states are <strong>ephemeral, immutable tensor chunks indexed strictly by prefix token hash</strong>.
              Forcing a POSIX or file-emulation hierarchy on top of KV tensors introduces metadata serialization bottlenecks, inode thrashing,
              and garbage collection freezes under multi-tenant cloud load.
            </p>
          </div>
        </div>
      </div>

      {/* Architectural Pillars: 2-column deep dive */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Pillar 1: POSIX Metadata Tax */}
        <div
          className="p-5 rounded-2xl border flex flex-col justify-between"
          style={{ background: 'var(--surface-card)', borderColor: 'var(--border-subtle)' }}
        >
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold"
                style={{ background: 'rgba(237,39,56,0.15)', color: 'var(--ddn-red)' }}
              >
                <Layers className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-bold text-[var(--text-primary)]">1. Eliminating the POSIX Metadata Tax</h4>
            </div>
            <p className="text-xs leading-relaxed text-[var(--text-secondary)]">
              When an inference engine queries a token hash (e.g. <code className="px-1.5 py-0.5 rounded bg-[var(--surface-secondary)] text-[11px] font-mono">hash(prompt_tokens)</code>),
              a filesystem must traverse directory structures, manage inode tables, lock parent directories, and resolve POSIX file paths.
              This incurs a <strong>metadata serialization penalty</strong> on every lookup.
            </p>
            <div
              className="mt-3 p-3.5 rounded-xl text-xs font-mono leading-relaxed"
              style={{ background: 'var(--surface-secondary)', border: '1px solid var(--border-subtle)' }}
            >
              <div className="text-[10px] uppercase font-bold text-[var(--text-muted)] mb-1">Lookup Path Complexity:</div>
              <div className="text-[#ED2738]">❌ POSIX/Filesystem: Hash → Dir Path → Inode Lookup → File Lock → Offset Read</div>
              <div className="text-[#00C280] font-bold mt-1">✓ DDN Infinia: Hash → Direct Key-Value Lookup (O(1) Flat RDMA)</div>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t text-[11px] text-[var(--text-muted)]" style={{ borderColor: 'var(--border-subtle)' }}>
            <strong>Result:</strong> Zero inode locks, zero directory traversals, line-rate KV tensor delivery.
          </div>
        </div>

        {/* Pillar 2: High-Churn Cache Dynamics */}
        <div
          className="p-5 rounded-2xl border flex flex-col justify-between"
          style={{ background: 'var(--surface-card)', borderColor: 'var(--border-subtle)' }}
        >
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold"
                style={{ background: 'rgba(0,194,128,0.15)', color: '#00C280' }}>
                <RefreshCw className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-bold text-[var(--text-primary)]">2. High-Churn Cache Resilience</h4>
            </div>
            <p className="text-xs leading-relaxed text-[var(--text-secondary)]">
              KV caching is bursty: gigabytes of tensors are dumped immediately after prefill, and evicted rapidly as conversations expire.
              Standard object stores generate <strong>tombstones on delete</strong>, causing catastrophic background garbage collection (GC) latency spikes.
              Filesystems suffer from journal serialization and inode churn.
            </p>
            <div
              className="mt-3 p-3.5 rounded-xl text-xs font-mono leading-relaxed"
              style={{ background: 'var(--surface-secondary)', border: '1px solid var(--border-subtle)' }}
            >
              <div className="text-[10px] uppercase font-bold text-[var(--text-muted)] mb-1">Eviction &amp; Lifecycle Behavior:</div>
              <div className="text-[#ED2738]">❌ Standard Stores: Delete → Tombstone → GC Storm → Latency Spike</div>
              <div className="text-[#00C280] font-bold mt-1">✓ DDN Infinia: Atomic Key Deletion / Zero GC Jitter</div>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t text-[11px] text-[var(--text-muted)]" style={{ borderColor: 'var(--border-subtle)' }}>
            <strong>Result:</strong> Deterministic sub-100ms retrieval even under 90%+ cache turnover.
          </div>
        </div>
      </div>

      {/* The Battlecard Table */}
      <div>
        <SectionTitle>
          <Trophy className="w-4 h-4" style={{ color: 'var(--ddn-red)' }} />
          Architectural Comparison: DDN Infinia vs. WEKA vs. VAST Data
        </SectionTitle>

        <div
          className="overflow-x-auto rounded-2xl border shadow-sm"
          style={{ borderColor: 'var(--border-subtle)', background: 'var(--surface-card)' }}
        >
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr style={{ background: 'var(--surface-secondary)', borderBottom: '2px solid var(--border-subtle)' }}>
                <th className="p-3.5 font-bold uppercase tracking-wider text-[var(--text-muted)] w-1/4">
                  Feature / Dimension
                </th>
                <th className="p-3.5 font-bold text-center w-1/4" style={{ background: 'rgba(237,39,56,0.08)' }}>
                  <div className="text-sm font-extrabold text-[var(--ddn-red)]">DDN Infinia</div>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[var(--ddn-red)] text-white mt-1 inline-block">
                    Native KV Substrate
                  </span>
                </th>
                <th className="p-3.5 font-bold text-center w-1/4">
                  <div className="text-sm font-bold text-[var(--text-primary)]">WEKA</div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--surface-secondary)] text-[var(--text-muted)] border mt-1 inline-block">
                    Distributed Filesystem
                  </span>
                </th>
                <th className="p-3.5 font-bold text-center w-1/4">
                  <div className="text-sm font-bold text-[var(--text-primary)]">VAST Data</div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--surface-secondary)] text-[var(--text-muted)] border mt-1 inline-block">
                    Element Store
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              {comparisonRows.map((row, idx) => (
                <tr
                  key={row.feature}
                  style={{
                    borderTop: '1px solid var(--border-subtle)',
                    background: idx % 2 === 0 ? 'transparent' : 'var(--surface-secondary)',
                  }}
                >
                  {/* Feature name */}
                  <td className="p-3.5 font-semibold text-[var(--text-primary)] align-top">
                    {row.feature}
                    <div className="text-[10px] font-normal text-[var(--text-muted)] mt-0.5">{row.note}</div>
                  </td>

                  {/* DDN Infinia Column */}
                  <td
                    className="p-3.5 text-center align-top font-medium"
                    style={{
                      background: 'rgba(237,39,56,0.04)',
                      borderLeft: '1px solid var(--border-subtle)',
                      borderRight: '1px solid var(--border-subtle)',
                    }}
                  >
                    {row.infiniaHighlight ? (
                      <span className="inline-block px-2.5 py-1 rounded-md text-xs font-bold text-[var(--ddn-red)] bg-[rgba(237,39,56,0.1)] border border-[rgba(237,39,56,0.25)]">
                        {row.infinia}
                      </span>
                    ) : (
                      <span className="text-[var(--text-primary)]">{row.infinia}</span>
                    )}
                  </td>

                  {/* WEKA Column */}
                  <td
                    className="p-3.5 text-center align-top text-[var(--text-secondary)] border-r"
                    style={{ borderColor: 'var(--border-subtle)' }}
                  >
                    <span>{row.weka}</span>
                  </td>

                  {/* VAST Column */}
                  <td className="p-3.5 text-center align-top text-[var(--text-secondary)]">
                    <span>{row.vast}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Field Win Themes */}
      <div>
        <SectionTitle>
          <Award className="w-4 h-4" style={{ color: '#00C280' }} />
          Field Positioning &amp; Win Themes (How to Pitch Against Competitors)
        </SectionTitle>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl border bg-[var(--surface-card)]" style={{ borderColor: 'var(--border-subtle)' }}>
            <div className="text-xs font-bold text-[var(--ddn-red)] mb-1">1. "Don't Force a File System on a KV Workload"</div>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              LLMs access KV cache strictly by cryptographic prefix hashes, not directory paths. Filesystem vendors have to wrap every chunk in file creation, metadata locks, and POSIX syscalls. Infinia provides native O(1) key-to-value addressing.
            </p>
          </div>

          <div className="p-4 rounded-xl border bg-[var(--surface-card)]" style={{ borderColor: 'var(--border-subtle)' }}>
            <div className="text-xs font-bold text-[#00C280] mb-1">2. "Zero-Tax Direct Infinia NIXL Path"</div>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              DDN is the first partner shipping a native Infinia plugin directly inside the NVIDIA Dynamo container, bypassing conventional host filesystem bottlenecks with jRPC/RDMA GPU-Direct offload.
            </p>
          </div>

          <div className="p-4 rounded-xl border bg-[var(--surface-card)]" style={{ borderColor: 'var(--border-subtle)' }}>
            <div className="text-xs font-bold text-[#1A81AF] mb-1">3. "Built for Ephemeral Churn, Not Archival"</div>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              Under multi-tenant cloud serving, thousands of contexts are written and evicted per second. Standard object stores choke on tombstone garbage collection storms; Infinia executes atomic key lifecycles natively at line rate.
            </p>
          </div>
        </div>
      </div>

      {/* Interactive CTA to ROI Calculator */}
      {onNavigateToCalculator && (
        <div
          className="p-5 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{
            background: 'linear-gradient(135deg, rgba(237,39,56,0.06) 0%, rgba(118,185,0,0.06) 100%)',
            borderColor: 'var(--border-subtle)',
          }}
        >
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Calculator className="w-4 h-4 text-[var(--ddn-red)]" />
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)]">
                Quantify The Financial Advantage
              </span>
            </div>
            <p className="text-xs text-[var(--text-secondary)] max-w-xl">
              Translate the architectural speed, avoided recomputations, and concurrency gains of DDN Infinia into hard CapEx, OpEx, and gross margin metrics for your GPU cluster.
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
