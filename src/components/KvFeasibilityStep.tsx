import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, AlertTriangle, Zap, ArrowRight, RotateCcw, HelpCircle } from 'lucide-react'

// ─── Step 1: Interactive KV Reuse Feasibility Model ──────────────────────────
// Ported from the main KV-cache demo app ("When to Cache" page).
// Rule: KV reuse only helps when  T_lookup(G4) + T_transfer  <  T_recompute(GPU).

export interface FeasibilityResult {
  recomputeMs: number
  hitLatencyMs: number
  expectedTimeMs: number
  timeSavedPct: number
  hitRatePct: number
}

const SCENARIOS = {
  baseline:   { label: 'Standard Baseline',            recomputeMs: 800, lookupMs: 20,  transferMs: 150, hitRatePct: 80, color: '#1A81AF' },
  infinia:    { label: 'DDN Infinia + RoCE',           recomputeMs: 800, lookupMs: 2,   transferMs: 14,  hitRatePct: 85, color: '#00C280' },
  bottleneck: { label: 'Storage Bottleneck (No Gain)', recomputeMs: 500, lookupMs: 150, transferMs: 650, hitRatePct: 80, color: '#ED2738' },
} as const
type ScenarioKey = keyof typeof SCENARIOS

function Row({ label, hint, value, min, max, step, unit, color, onChange, ticks }: {
  label: string; hint: string; value: number; min: number; max: number; step: number
  unit: string; color: string; onChange: (v: number) => void; ticks: [string, string, string]
}) {
  const clamped = Math.min(Math.max(value, min), max)
  const pct = ((clamped - min) / (max - min)) * 100
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>{label}</div>
          <div className="text-xs md:text-sm" style={{ color: 'var(--text-muted)' }}>{hint}</div>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <input type="number" min={min} max={unit === '%' ? 100 : 10000} step={step} value={value}
            onChange={e => onChange(Math.max(unit === '%' ? 0 : 1, Math.min(unit === '%' ? 100 : 10000, Number(e.target.value))))}
            className="w-24 px-2 py-1.5 text-right font-mono font-bold text-base rounded-lg border focus:outline-none"
            style={{ background: 'var(--surface-secondary)', borderColor: 'var(--border-subtle)', color: 'var(--text-primary)' }} />
          <span className="text-sm" style={{ color: 'var(--text-muted)' }}>{unit}</span>
        </div>
      </div>
      <input type="range" min={min} max={max} step={step} value={clamped}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full h-2.5 rounded-full appearance-none cursor-pointer"
        style={{ background: `linear-gradient(to right, ${color} ${pct}%, var(--surface-secondary) ${pct}%)`, accentColor: color }} />
      <div className="flex justify-between text-xs" style={{ color: 'var(--text-muted)' }}>
        <span>{ticks[0]}</span><span>{ticks[1]}</span><span>{ticks[2]}</span>
      </div>
    </div>
  )
}

export function KvFeasibilityStep({ onContinue }: { onContinue: (r: FeasibilityResult) => void }) {
  const [recomputeMs, setRecomputeMs] = useState<number>(SCENARIOS.baseline.recomputeMs)
  const [lookupMs, setLookupMs]       = useState<number>(SCENARIOS.baseline.lookupMs)
  const [transferMs, setTransferMs]   = useState<number>(SCENARIOS.baseline.transferMs)
  const [hitRatePct, setHitRatePct]   = useState<number>(SCENARIOS.baseline.hitRatePct)

  // ── Model (identical to main app) ──
  const hitLatencyMs    = lookupMs + transferMs
  const hitRate         = hitRatePct / 100
  const expectedTimeMs  = hitRate * hitLatencyMs + (1 - hitRate) * recomputeMs
  const timeSavedMs     = recomputeMs - expectedTimeMs
  const timeSavedPct    = recomputeMs > 0 ? (timeSavedMs / recomputeMs) * 100 : 0
  const isBeneficial    = expectedTimeMs < recomputeMs
  const hitIsBeneficial = hitLatencyMs < recomputeMs
  const maxScaleMs      = Math.max(recomputeMs, hitLatencyMs, expectedTimeMs, 100)

  const apply = (k: ScenarioKey) => {
    const s = SCENARIOS[k]
    setRecomputeMs(s.recomputeMs); setLookupMs(s.lookupMs); setTransferMs(s.transferMs); setHitRatePct(s.hitRatePct)
  }
  const activeKey = (Object.keys(SCENARIOS) as ScenarioKey[]).find(k => {
    const s = SCENARIOS[k]
    return s.recomputeMs === recomputeMs && s.lookupMs === lookupMs && s.transferMs === transferMs && s.hitRatePct === hitRatePct
  })

  const verdictColor = isBeneficial ? '#76B900' : '#ED2738'
  const bars = [
    { label: 'Full Recompute', ms: recomputeMs, bg: '#ED2738', text: `${recomputeMs} ms (GPU prefill)` },
    { label: 'Cache Hit Retrieval', ms: hitLatencyMs, bg: hitIsBeneficial ? '#00C280' : '#ED2738',
      text: hitIsBeneficial ? `${hitLatencyMs} ms (${Math.round((1 - hitLatencyMs / recomputeMs) * 100)}% faster than GPU)` : `${hitLatencyMs} ms (slower than GPU)` },
    { label: 'Expected Average', ms: expectedTimeMs, bg: isBeneficial ? 'linear-gradient(90deg,#1A81AF,#00C280)' : '#ED2738',
      text: `${expectedTimeMs.toFixed(0)} ms (${timeSavedPct >= 0 ? `${timeSavedPct.toFixed(1)}% saved` : `${Math.abs(timeSavedPct).toFixed(1)}% penalty`})` },
  ]

  return (
    <div className="card-elevated p-6 md:p-8 space-y-6" style={{ borderTop: `3px solid ${verdictColor}` }}>
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4 pb-4 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-1.5 text-sm font-bold px-3 py-1 rounded-full mb-2"
            style={{ background: 'rgba(118,185,0,0.14)', color: '#76B900', border: '1px solid rgba(118,185,0,0.45)' }}>
            <HelpCircle className="w-4 h-4" style={{ color: '#76B900' }} /> Step 1 · Interactive KV Reuse Feasibility Model
          </div>
          <h3 className="text-xl md:text-2xl font-extrabold" style={{ color: 'var(--text-primary)' }}>
            Does KV cache reuse actually help your workload?
          </h3>
          <p className="text-sm md:text-base mt-1" style={{ color: 'var(--text-muted)' }}>
            Retrieving cached KV state only pays off when storage lookup + transfer is faster than letting the GPU recompute it.
            Adjust the four inputs or pick a scenario.
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {(Object.keys(SCENARIOS) as ScenarioKey[]).map(k => {
            const s = SCENARIOS[k]; const on = activeKey === k
            return (
              <button key={k} onClick={() => apply(k)}
                className="px-2.5 py-1 rounded-lg text-xs font-semibold border transition-colors cursor-pointer flex items-center gap-1"
                style={{ background: on ? `${s.color}22` : 'var(--surface-secondary)', borderColor: on ? s.color : 'var(--border-subtle)', color: s.color }}>
                {k === 'infinia' && <Zap className="w-3 h-3" />}{k === 'bottleneck' && <AlertTriangle className="w-3 h-3" />}{s.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Inputs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Row label="GPU recompute time" hint="Time for the GPU to rebuild KV state from scratch (prefill)" value={recomputeMs}
          min={50} max={5000} step={10} unit="ms" color="#ED2738" onChange={setRecomputeMs}
          ticks={['50 ms (short prompt)', '800 ms (baseline)', '5,000 ms (32K+ context)']} />
        <Row label="RDMA direct single-hop lookup" hint="DDN Infinia + NVIDIA Dynamo: KV blocks located and fetched over GPU-Direct RDMA in a single hop, no CPU in the path" value={lookupMs}
          min={1} max={3000} step={1} unit="ms" color="#1A81AF" onChange={setLookupMs}
          ticks={['1 ms (Infinia RDMA single hop)', '20 ms (baseline)', '3,000 ms (multi-hop / slow object store)']} />
        <Row label="KV transfer & restore" hint="Zero-copy transfer from DDN Infinia into GPU HBM" value={transferMs}
          min={2} max={5000} step={2} unit="ms" color="#1A81AF" onChange={setTransferMs}
          ticks={['8 ms (GPU-Direct RoCE)', '150 ms (baseline)', '5,000 ms (slow TCP / WAN)']} />
        <Row label="Cache hit rate" hint="Share of requests that reuse a stored prefix or document" value={hitRatePct}
          min={0} max={100} step={1} unit="%" color="#00C280" onChange={setHitRatePct}
          ticks={['0% (no sharing)', '80% (baseline)', '100% (static prompt)']} />
      </div>

      {/* Latency bars */}
      <div className="space-y-3">
        <div className="text-sm font-bold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Latency comparison</div>
        {bars.map(b => (
          <div key={b.label} className="flex items-center gap-3">
            <span className="w-48 shrink-0 text-base font-bold" style={{ color: 'var(--text-primary)' }}>{b.label}</span>
            <div className="flex-1 h-11 rounded-lg overflow-hidden" style={{ background: 'var(--surface-secondary)' }}>
              <div className="h-full rounded-lg transition-all duration-500 flex items-center px-3 text-sm md:text-base font-mono font-bold text-white whitespace-nowrap"
                style={{ width: `${Math.max(Math.min((b.ms / maxScaleMs) * 100, 100), 22)}%`, background: b.bg }}>{b.text}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Verdict + gate */}
      <AnimatePresence mode="wait">
        <motion.div key={isBeneficial ? 'yes' : 'no'} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
          className="rounded-xl p-5 border flex flex-col md:flex-row md:items-center justify-between gap-4"
          style={{ background: `${verdictColor}12`, borderColor: `${verdictColor}66` }}>
          <div className="space-y-1">
            <div className="flex items-center gap-2 font-extrabold text-base md:text-lg" style={{ color: verdictColor }}>
              {isBeneficial ? <CheckCircle2 className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
              {isBeneficial
                ? `YES: KV cache helps (${timeSavedPct.toFixed(1)}% lower average latency)`
                : 'NO GAIN: recomputing is faster than retrieving'}
            </div>
            <p className="text-sm md:text-base" style={{ color: 'var(--text-secondary)' }}>
              RDMA single-hop lookup <strong>{lookupMs} ms</strong> + transfer <strong>{transferMs} ms</strong> = <strong>{hitLatencyMs} ms</strong> per hit,
              vs. <strong>{recomputeMs} ms</strong> GPU recompute.{' '}
              {isBeneficial
                ? <>Average request time drops from <strong>{recomputeMs} ms</strong> to <strong>{expectedTimeMs.toFixed(0)} ms</strong>. Continue to size the business value.</>
                : <>Each hit adds <strong>{Math.abs(hitLatencyMs - recomputeMs)} ms</strong>. Retrieval must be faster than recompute, e.g. a GPU-Direct RDMA fabric like DDN Infinia.</>}
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {!isBeneficial && (
              <button onClick={() => apply('infinia')}
                className="px-4 py-2.5 rounded-xl text-xs font-bold border flex items-center gap-2 cursor-pointer"
                style={{ borderColor: '#00C280', color: '#00C280', background: 'transparent' }}>
                <RotateCcw className="w-3.5 h-3.5" /> Try DDN Infinia fabric
              </button>
            )}
            <button disabled={!isBeneficial}
              onClick={() => onContinue({ recomputeMs, hitLatencyMs, expectedTimeMs, timeSavedPct, hitRatePct })}
              className="px-5 py-2.5 rounded-xl text-sm font-bold text-white flex items-center gap-2 transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              style={{ background: isBeneficial ? 'linear-gradient(135deg,#76B900,#5C9100)' : '#6b7280' }}
              title={isBeneficial ? 'Continue to the ROI model' : 'KV reuse must beat recompute before ROI applies'}>
              Step 2: Estimate ROI <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </AnimatePresence>

      <p className="text-xs md:text-sm" style={{ color: 'var(--text-muted)' }}>
        <strong>Rule:</strong> if T<sub>RDMA lookup</sub> + T<sub>transfer</sub> ≥ T<sub>recompute</sub>(GPU), caching produces no gain.
        Memory tiers: G1 GPU HBM · G2 host DRAM · G3 local NVMe · G4 shared/networked storage.
      </p>
    </div>
  )
}
