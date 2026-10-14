import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

export interface CustomerDetails {
  customerName: string
  organizationName: string
  preparedBy: string
  projectRef: string
  targetCluster: string
  notes: string
}

export interface RoiReportData {
  customer: CustomerDetails
  workloadName: string
  tierKey: string
  tierLabel: string
  tierType: string
  systemTokens: number
  dailyRequests: number
  avgNewTokens: number
  hitRate: number
  roi: {
    dailyHits: number
    dailyMisses: number
    gpuHoursSavedPerDay: number
    gpuHoursSavedMonthly: number
    gpuHoursSavedAnnually: number
    throughputMultiplier: number
    ttftColdMs: number
    ttftWarmMs: number
    ttftSpeedupX: number
    serversAvoided: number
    serversNeededWithout: number
    serversNeededWith: number
    capexAvoidance: number
    annualCapexAmortised: number
    powerSavedKWhAnnually: number
    powerSavedUsdAnnually: number
    totalSelfHostedAnnual: number
    gpuUtilFreedPct: number
    hourlyGpuRate: number
    annualNcpReclaimedValue: number
    ncpGrossMarginBefore: number
    ncpGrossMarginAfter: number
    ncpMarginExpansionPct: number
    monthlySavingsCloud: number
    annualSavingsCloud: number
    costNoCache: number
    costWithCache: number
    costReductionPct: number
  }
}

const fmt$ = (n: number) => {
  if (n >= 1e6) return `$${(n / 1e6).toFixed(2)}M`
  if (n >= 1e3) return `$${(n / 1e3).toFixed(1)}K`
  return `$${Math.round(n).toLocaleString()}`
}

const fmtNum = (n: number) => {
  if (n >= 1e6) return `${(n / 1e6).toFixed(1)}M`
  if (n >= 1e3) return `${(n / 1e3).toFixed(0)}K`
  return Math.round(n).toLocaleString()
}

export function generateRoiPdf(data: RoiReportData) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'letter',
  })

  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  const margin = 14
  const contentWidth = pageWidth - margin * 2

  // ── Color Palette ────────────────────────────────────────────────────────────
  const RED: [number, number, number] = [237, 39, 56]
  const NVIDIA_GREEN: [number, number, number] = [118, 185, 0]
  const DARK_SLATE: [number, number, number] = [15, 23, 42]
  const TEXT_MAIN: [number, number, number] = [30, 41, 59]
  const TEXT_MUTED: [number, number, number] = [100, 116, 139]
  const BG_LIGHT: [number, number, number] = [248, 250, 252]
  const BORDER_LIGHT: [number, number, number] = [226, 232, 240]

  // ── PAGE 1: EXECUTIVE BRIEFING & ROI ANALYSIS ─────────────────────────────
  
  // Top brand color accent bar
  doc.setFillColor(...RED)
  doc.rect(0, 0, pageWidth * 0.65, 3.5, 'F')
  doc.setFillColor(...NVIDIA_GREEN)
  doc.rect(pageWidth * 0.65, 0, pageWidth * 0.35, 3.5, 'F')

  let y = 14

  // Brand Header
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(16)
  doc.setTextColor(...DARK_SLATE)
  doc.text('DDN INFINIA™', margin, y)

  doc.setFontSize(8)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...NVIDIA_GREEN)
  doc.text('NVIDIA DYNAMO / NIXL ACCELERATED', margin + 46, y - 0.5)

  // Document Title
  y += 7
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...RED)
  doc.text('EXECUTIVE AI INFERENCE ROI & CAPACITY SIZING', margin, y)

  y += 4.5
  doc.setFontSize(8.5)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(...TEXT_MUTED)
  doc.text('High-Performance External KV Cache Substrate for Enterprise & Neocloud GPU Clusters', margin, y)

  // Metadata / Customer Info Card (Top Right / Full width split)
  y += 6
  doc.setFillColor(...BG_LIGHT)
  doc.setDrawColor(...BORDER_LIGHT)
  doc.roundedRect(margin, y, contentWidth, 23, 2, 2, 'FD')

  const col1X = margin + 4
  const col2X = margin + (contentWidth / 3) + 2
  const col3X = margin + (contentWidth * 2 / 3) + 2

  doc.setFontSize(7.5)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...TEXT_MUTED)
  doc.text('PROSPECT / CUSTOMER:', col1X, y + 5)
  doc.text('PREPARED BY:', col2X, y + 5)
  doc.text('ASSESSMENT DATE:', col3X, y + 5)

  doc.setFontSize(8.5)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...DARK_SLATE)
  const custName = data.customer.customerName || 'Enterprise AI Infrastructure Team'
  const orgName = data.customer.organizationName ? ` (${data.customer.organizationName})` : ''
  doc.text(`${custName}${orgName}`, col1X, y + 10)
  doc.text(data.customer.preparedBy || 'DDN AI Solutions Architecture Team', col2X, y + 10)
  doc.text(new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }), col3X, y + 10)

  doc.setFontSize(7.5)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...TEXT_MUTED)
  doc.text('TARGET HARDWARE / CLUSTER:', col1X, y + 16)
  doc.text('WORKLOAD ARCHETYPE:', col2X, y + 16)
  doc.text('PROJECT REFERENCE:', col3X, y + 16)

  doc.setFontSize(8.5)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(...DARK_SLATE)
  doc.text(data.customer.targetCluster || 'NVIDIA H100 / H200 / B200 HGX Cluster', col1X, y + 20.5)
  doc.text(data.tierLabel, col2X, y + 20.5)
  doc.text(data.customer.projectRef || 'GTC 2026 Production Sizing', col3X, y + 20.5)

  y += 28

  // ── Executive Summary Callout Box ──────────────────────────────────────────
  doc.setFillColor(254, 242, 242) // subtle red tint
  doc.setDrawColor(...RED)
  doc.setLineWidth(0.8)
  doc.roundedRect(margin, y, contentWidth, 19, 2, 2, 'FD')
  doc.setLineWidth(0.2) // reset line width

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(8.5)
  doc.setTextColor(...RED)
  doc.text('EXECUTIVE SUMMARY & BUSINESS VALUE PROPOSITION', margin + 4, y + 4.5)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(7.8)
  doc.setTextColor(...TEXT_MAIN)
  
  let summaryText = ''
  if (data.tierType === 'ncp') {
    summaryText = `At a production scale of ${data.dailyRequests.toLocaleString()} daily requests with a ${data.systemTokens.toLocaleString()}-token context and ${data.hitRate}% cache hit rate, DDN Infinia eliminates ${data.roi.dailyHits.toLocaleString()} prefill recomputations daily. By removing the GPU prefill bottleneck, your cluster achieves a ${data.roi.throughputMultiplier.toFixed(1)}× tenant concurrency multiplier, reclaiming ${Math.round(data.roi.gpuHoursSavedAnnually).toLocaleString()} GPU compute hours annually (${fmt$(data.roi.annualNcpReclaimedValue)} reclaimed compute value) and expanding inference gross margins from ${data.roi.ncpGrossMarginBefore}% to ${data.roi.ncpGrossMarginAfter}%.`
  } else if (data.tierType === 'cloud_api') {
    summaryText = `For workloads processing ${data.dailyRequests.toLocaleString()} requests/day across ${data.systemTokens.toLocaleString()} context tokens, consuming commercial APIs without persistent caching costs ${fmt$(data.roi.costNoCache)} daily. Transitioning prompt reuse to self-hosted open models backed by DDN Infinia eliminates ${data.hitRate}% of token charges, generating net enterprise savings of ${fmt$(data.roi.monthlySavingsCloud)} per month (${fmt$(data.roi.annualSavingsCloud)} annually) with an immediate payback horizon.`
  } else {
    summaryText = `For an enterprise GPU fleet handling ${data.dailyRequests.toLocaleString()} daily queries with a ${data.systemTokens.toLocaleString()}-token shared prompt, DDN Infinia prevents ${data.roi.dailyHits.toLocaleString()} daily prefill cycles. This reclaims ${Math.round(data.roi.gpuHoursSavedAnnually).toLocaleString()} GPU hours/year, avoiding the purchase of ${data.roi.serversAvoided} dedicated DGX servers (${fmt$(data.roi.capexAvoidance)} CapEx avoidance) and saving ${Math.round(data.roi.powerSavedKWhAnnually).toLocaleString()} kWh (${fmt$(data.roi.powerSavedUsdAnnually)}) in annual data center power and cooling.`
  }

  const splitSummary = doc.splitTextToSize(summaryText, contentWidth - 8)
  doc.text(splitSummary, margin + 4, y + 9.5)

  y += 24

  // ── 4 KPI Callout Cards ────────────────────────────────────────────────────
  const cardGap = 3
  const cardW = (contentWidth - cardGap * 3) / 4
  const cardH = 20

  interface KpiItem {
    label: string
    val: string
    sub: string
    color: [number, number, number]
  }

  let kpiItems: KpiItem[] = []

  if (data.tierType === 'ncp') {
    kpiItems = [
      { label: 'ANNUAL RECLAIMED VALUE', val: fmt$(data.roi.annualNcpReclaimedValue), sub: '@ $2.50/GPU-hr market', color: NVIDIA_GREEN },
      { label: 'CONCURRENCY GAIN', val: `${data.roi.throughputMultiplier.toFixed(1)}×`, sub: 'More tenants / DGX', color: RED },
      { label: 'GROSS MARGIN JUMP', val: `${data.roi.ncpGrossMarginBefore}% → ${data.roi.ncpGrossMarginAfter}%`, sub: `+${data.roi.ncpMarginExpansionPct.toFixed(1)}% expansion`, color: NVIDIA_GREEN },
      { label: 'TTFT SPEEDUP', val: `${data.roi.ttftSpeedupX}×`, sub: `${data.roi.ttftWarmMs}ms vs ${data.roi.ttftColdMs}ms`, color: DARK_SLATE },
    ]
  } else if (data.tierType === 'cloud_api') {
    kpiItems = [
      { label: 'ANNUAL INVOICE SAVINGS', val: fmt$(data.roi.annualSavingsCloud), sub: 'Commercial API reduction', color: NVIDIA_GREEN },
      { label: 'MONTHLY NET SAVINGS', val: fmt$(data.roi.monthlySavingsCloud), sub: 'Recurring bottom-line impact', color: RED },
      { label: 'COST REDUCTION', val: `-${data.roi.costReductionPct.toFixed(1)}%`, sub: 'Token bill elimination', color: NVIDIA_GREEN },
      { label: 'TTFT SPEEDUP', val: `${data.roi.ttftSpeedupX}×`, sub: `${data.roi.ttftWarmMs}ms vs ${data.roi.ttftColdMs}ms`, color: DARK_SLATE },
    ]
  } else {
    kpiItems = [
      { label: 'TOTAL ANNUAL BENEFIT', val: fmt$(data.roi.totalSelfHostedAnnual), sub: 'Amortized CapEx + OpEx', color: NVIDIA_GREEN },
      { label: 'CAPEX AVOIDANCE', val: fmt$(data.roi.capexAvoidance), sub: `${data.roi.serversAvoided} DGX servers avoided`, color: RED },
      { label: 'POWER & COOLING SAVED', val: `${fmtNum(data.roi.powerSavedKWhAnnually)} kWh`, sub: `${fmt$(data.roi.powerSavedUsdAnnually)} annual OpEx saved`, color: NVIDIA_GREEN },
      { label: 'TTFT SPEEDUP', val: `${data.roi.ttftSpeedupX}×`, sub: `${data.roi.ttftWarmMs}ms vs ${data.roi.ttftColdMs}ms`, color: DARK_SLATE },
    ]
  }

  kpiItems.forEach((kpi, idx) => {
    const kX = margin + idx * (cardW + cardGap)
    doc.setFillColor(...BG_LIGHT)
    doc.setDrawColor(...BORDER_LIGHT)
    doc.roundedRect(kX, y, cardW, cardH, 2, 2, 'FD')

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(6.5)
    doc.setTextColor(...TEXT_MUTED)
    doc.text(kpi.label, kX + cardW / 2, y + 4.5, { align: 'center' })

    doc.setFontSize(10.5)
    doc.setTextColor(...kpi.color)
    doc.text(kpi.val, kX + cardW / 2, y + 11.5, { align: 'center' })

    doc.setFontSize(6.5)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(...TEXT_MUTED)
    doc.text(kpi.sub, kX + cardW / 2, y + 16.5, { align: 'center' })
  })

  y += cardH + 6

  // ── Table 1: Workload Parameters & Sizing Input ────────────────────────────
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(9)
  doc.setTextColor(...DARK_SLATE)
  doc.text('1. WORKLOAD SIZING & ASSUMPTIONS', margin, y)
  y += 2

  autoTable(doc, {
    startY: y,
    margin: { left: margin, right: margin },
    theme: 'plain',
    head: [['Parameter', 'Evaluated Value', 'Architectural & Operational Impact']],
    body: [
      ['Shared Context / System Prompt', `${data.systemTokens.toLocaleString()} tokens`, 'Indexed by cryptographic prefix hash; loaded sub-15ms via Infinia S3/NIXL fastpath'],
      ['Daily Request Volume', `${data.dailyRequests.toLocaleString()} requests / day`, 'Total enterprise conversational, agentic, or RAG inference queries'],
      ['Average Response / Output', `${data.avgNewTokens.toLocaleString()} tokens`, 'Autoregressive generation required; same compute across cached & uncached paths'],
      ['Observed / Modeled Hit Rate', `${data.hitRate}% hit rate`, `${data.roi.dailyHits.toLocaleString()} daily requests skip prefill entirely; only ${data.roi.dailyMisses.toLocaleString()} cold prefill`],
      ['Effective GPU Concurrency', `${data.roi.throughputMultiplier.toFixed(1)}× multiplier`, 'Eliminating prefill computation frees GPU HBM and compute cores for new requests'],
      ['Time-To-First-Token (TTFT)', `${data.roi.ttftWarmMs}ms warm vs ${data.roi.ttftColdMs}ms cold`, `${data.roi.ttftSpeedupX}× faster response delivery; deterministic interactive user experience`],
    ],
    headStyles: {
      fillColor: DARK_SLATE,
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 7.5,
      cellPadding: 2,
    },
    bodyStyles: {
      fontSize: 7.2,
      textColor: TEXT_MAIN,
      cellPadding: 1.8,
      lineColor: BORDER_LIGHT,
      lineWidth: 0.2,
    },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 55 },
      1: { fontStyle: 'bold', textColor: RED, cellWidth: 45 },
      2: { textColor: TEXT_MAIN },
    },
  })

  y = (doc as any).lastAutoTable.finalY + 6

  // ── Table 2: Detailed Financial & Infrastructure Impact ─────────────────────
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(9)
  doc.setTextColor(...DARK_SLATE)
  doc.text('2. DETAILED INFRASTRUCTURE & ECONOMIC IMPACT', margin, y)
  y += 2

  let impactRows: string[][] = []

  if (data.tierType === 'ncp') {
    impactRows = [
      ['Daily Prefill Recomputations Eliminated', `${data.roi.dailyHits.toLocaleString()} requests/day`, 'Raw GPU time saved on redundant prompt processing'],
      ['Annual GPU Compute Hours Reclaimed', `${Math.round(data.roi.gpuHoursSavedAnnually).toLocaleString()} hours / year`, 'Directly converts idle prefill spinning into sellable inference capacity'],
      ['Reclaimed Capacity Revenue Value', `${fmt$(data.roi.annualNcpReclaimedValue)} / year`, 'Valued conservatively at $2.50/GPU-hour spot H100 SXM5 cloud market rate'],
      ['Uncached Inference Gross Margin', `${data.roi.ncpGrossMarginBefore}% gross margin`, 'High prefill recomputation burns GPU cycles without additional user billing'],
      ['Infinia Accelerated Gross Margin', `${data.roi.ncpGrossMarginAfter}% gross margin`, 'Instant zero-cost prefix lookup drives margin expansion on high-volume prompts'],
      ['Net Margin Advantage', `+${data.roi.ncpMarginExpansionPct.toFixed(1)}% percentage points`, 'Pure operational leverage without purchasing additional physical servers'],
    ]
  } else if (data.tierType === 'cloud_api') {
    impactRows = [
      ['Daily Token Spend Without Caching', `${fmt$(data.roi.costNoCache)} / day`, 'Baseline invoice on serverless commercial token APIs (GPT-4o/Claude Sonnet class)'],
      ['Daily Spend With Infinia Self-Hosting', `${fmt$(data.roi.costWithCache)} / day`, 'Cached prefix tokens retrieved for $0.00 compute cost from on-prem storage'],
      ['Monthly Commercial Invoice Reduction', `${fmt$(data.roi.monthlySavingsCloud)} / month`, 'Net monthly recurring reduction in external API invoices'],
      ['Annualized Enterprise TCO Savings', `${fmt$(data.roi.annualSavingsCloud)} / year`, 'Direct bottom-line savings replacing serverless API consumption'],
      ['Total Cost Reduction Percentage', `-${data.roi.costReductionPct.toFixed(1)}%`, 'Proportion of total enterprise inference billing eliminated'],
      ['Full Infrastructure Payback Horizon', '< 4 Months', 'Typical CapEx payback period when acquiring on-prem NVIDIA + DDN infrastructure'],
    ]
  } else {
    impactRows = [
      ['DGX Servers Required (Without Cache)', `${data.roi.serversNeededWithout} × 8-way H100 Servers`, 'Hardware required to handle peak prefill volume without persistent caching'],
      ['DGX Servers Required (With Infinia)', `${data.roi.serversNeededWith} × 8-way H100 Servers`, 'Hardware needed when prefix caching offloads 85%+ of prefill compute'],
      ['Dedicated DGX Servers Avoided', `${data.roi.serversAvoided} DGX Servers Avoided`, 'Direct CapEx hardware purchase avoidance at next cluster expansion'],
      ['Total Hardware CapEx Avoidance', `${fmt$(data.roi.capexAvoidance)} capital avoided`, 'Valued at standard $300,000 per 8× H100 SXM5 enterprise server baseline'],
      ['Amortized Annual CapEx Benefit', `${fmt$(data.roi.annualCapexAmortised)} / year`, 'Based on standard enterprise 3-year hardware depreciation schedule'],
      ['Annual Electricity & Cooling OpEx Saved', `${fmt$(data.roi.powerSavedUsdAnnually)} / year`, `${fmtNum(data.roi.powerSavedKWhAnnually)} kWh avoided @ $0.10/kWh (6,400W server draw)`],
      ['Total Annual Self-Hosted Enterprise Value', `${fmt$(data.roi.totalSelfHostedAnnual)} / year`, 'Combined amortized CapEx hardware avoidance plus annual power reduction'],
    ]
  }

  autoTable(doc, {
    startY: y,
    margin: { left: margin, right: margin },
    theme: 'plain',
    head: [['Financial / Capacity Dimension', 'Modeled Value', 'Accounting & Economic Basis']],
    body: impactRows,
    headStyles: {
      fillColor: DARK_SLATE,
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 7.5,
      cellPadding: 2,
    },
    bodyStyles: {
      fontSize: 7.2,
      textColor: TEXT_MAIN,
      cellPadding: 1.8,
      lineColor: BORDER_LIGHT,
      lineWidth: 0.2,
    },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 65 },
      1: { fontStyle: 'bold', textColor: NVIDIA_GREEN, cellWidth: 45 },
      2: { textColor: TEXT_MAIN },
    },
  })

  // ── Footer Page 1 ─────────────────────────────────────────────────────────
  doc.setFontSize(7)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(...TEXT_MUTED)
  doc.text('DDN Infinia™ · Confidential & Proprietary · Prepared for Customer Technical & Financial Evaluation', margin, pageHeight - 7)
  doc.text('Page 1 of 2', pageWidth - margin - 12, pageHeight - 7)

  // ── PAGE 2: ARCHITECTURE ADVANTAGE & OFFICIAL DISCLAIMERS ─────────────────
  doc.addPage()

  // Top color bar
  doc.setFillColor(...RED)
  doc.rect(0, 0, pageWidth * 0.65, 3.5, 'F')
  doc.setFillColor(...NVIDIA_GREEN)
  doc.rect(pageWidth * 0.65, 0, pageWidth * 0.35, 3.5, 'F')

  y = 15

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(13)
  doc.setTextColor(...DARK_SLATE)
  doc.text('ARCHITECTURAL COMPETITIVE ADVANTAGE & METHODOLOGY', margin, y)

  y += 5
  doc.setFontSize(8)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(...TEXT_MUTED)
  doc.text('Why Native Distributed Key-Value Substrates Outperform POSIX Filesystems for AI Inference', margin, y)

  y += 7

  // Architecture Pillars
  const archPillars = [
    {
      title: '1. Flat O(1) Key-to-Value Addressing vs. POSIX Inode Bottlenecks',
      desc: 'LLMs access KV cache strictly by cryptographic prefix hashes (e.g. hash(prompt_tokens)), never directory paths. Traditional file systems (WEKA, NFS, GPFS) force every 256-token chunk into directory hierarchies, incurring directory locking, inode allocations, and metadata server (MDS) traversals. DDN Infinia provides a native distributed KV substrate with flat O(1) hashing, eliminating the metadata serialization tax entirely.'
    },
    {
      title: '2. NVIDIA Dynamo & NIXL GPU-Direct RDMA Zero-Copy Path',
      desc: 'DDN is the first partner shipping a native Infinia plugin directly inside the NVIDIA Dynamo inference container. Using NVIDIA Inference Transfer Library (NIXL), KV tensors transfer directly from Infinia storage nodes to GPU High Bandwidth Memory (HBM) over RDMA/RoCE at sub-15ms latency, with 0% host CPU involvement and zero kernel context switching.'
    },
    {
      title: '3. Built for Extreme Eviction Churn & Multi-Tenant Multi-Model Serving',
      desc: 'In multi-tenant AI serving, thousands of context chunks are created, evicted, and expired every second. Standard element stores and cloud object stores choke under tombstone garbage collection (GC) storms, creating massive latency jitter. Infinia handles atomic key lifecycles and garbage collection in hardware at wire speed, ensuring deterministic sub-100ms retrieval even under 90%+ cache turnover.'
    }
  ]

  archPillars.forEach(p => {
    doc.setFillColor(...BG_LIGHT)
    doc.setDrawColor(...BORDER_LIGHT)
    doc.roundedRect(margin, y, contentWidth, 23, 2, 2, 'FD')

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(8.5)
    doc.setTextColor(...DARK_SLATE)
    doc.text(p.title, margin + 4, y + 5)

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(7.5)
    doc.setTextColor(...TEXT_MAIN)
    const splitP = doc.splitTextToSize(p.desc, contentWidth - 8)
    doc.text(splitP, margin + 4, y + 10)

    y += 26
  })

  y += 4

  // Notes section if provided
  if (data.customer.notes) {
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(8.5)
    doc.setTextColor(...DARK_SLATE)
    doc.text('PROJECT NOTES & SPECIFIC REQUIREMENTS:', margin, y)
    y += 4
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(7.5)
    doc.setTextColor(...TEXT_MAIN)
    const splitNotes = doc.splitTextToSize(data.customer.notes, contentWidth)
    doc.text(splitNotes, margin, y)
    y += splitNotes.length * 4 + 4
  }

  // ── Official DDN Legal & Engineering Disclaimers ───────────────────────────
  doc.setFillColor(241, 245, 249) // Slate-100
  doc.setDrawColor(...BORDER_LIGHT)
  const discH = 50
  doc.roundedRect(margin, y, contentWidth, discH, 2, 2, 'FD')

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(8)
  doc.setTextColor(...DARK_SLATE)
  doc.text('OFFICIAL DDN DISCLAIMERS, MODELING ASSUMPTIONS & SIZING NOTICE', margin + 4, y + 5.5)

  const disclaimers = [
    '1. Hardware & Sizing Baselines: Calculations are modeled on an 8× NVIDIA H100 SXM5 DGX server ($300,000 baseline acquisition cost, 6,400W total chassis power draw, 10,000 tokens/sec prefill throughput for 70B-class enterprise foundation models using vLLM / TensorRT-LLM with chunked prefill).',
    '2. Workload & Latency Variability: Modeled Time-To-First-Token (TTFT), GPU-hour savings, and CapEx avoidance are estimates based on input parameters. Actual production results depend on real-world prompt token distributions, prefix cache hit consistency, GPU cluster interconnect topology, and specific model quantization formats.',
    '3. Power & Facility Rates: OpEx power calculations assume an average industrial electricity rate of $0.10/kWh and standard Power Usage Effectiveness (PUE) cooling margins. Actual utility tariffs and data center PUE ratios will influence specific facility savings.',
    '4. Commercial API Pricing: Build vs. Buy comparisons are benchmarked against publicly published serverless model API rates ($2.50 per 1M input tokens, $10.00 per 1M output tokens for GPT-4o / Claude 3.5 Sonnet class models as of July 2026).',
    '5. Proprietary & Confidential: This assessment is generated exclusively for the named recipient organization for preliminary capacity planning and financial feasibility evaluation. It does not constitute a formal binding commercial quotation. Copyright © 2026 DataDirect Networks, Inc. (DDN). All rights reserved.'
  ]

  let discY = y + 10
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(6.8)
  doc.setTextColor(...TEXT_MUTED)

  disclaimers.forEach(d => {
    const splitD = doc.splitTextToSize(d, contentWidth - 8)
    doc.text(splitD, margin + 4, discY)
    discY += splitD.length * 3.2 + 1
  })

  // ── Footer Page 2 ─────────────────────────────────────────────────────────
  doc.setFontSize(7)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(...TEXT_MUTED)
  doc.text('DDN Infinia™ · Confidential & Proprietary · Prepared for Customer Technical & Financial Evaluation', margin, pageHeight - 7)
  doc.text('Page 2 of 2', pageWidth - margin - 12, pageHeight - 7)

  // Clean filename
  const safeCustomer = (data.customer.customerName || 'Customer').replace(/[^a-zA-Z0-9_-]/g, '_')
  const safeDate = new Date().toISOString().slice(0, 10)
  const filename = `DDN_Infinia_ROI_Assessment_${safeCustomer}_${safeDate}.pdf`

  doc.save(filename)
}
