import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FileDown,
  X,
  Building2,
  User,
  Cpu,
  Bookmark,
  FileText,
  CheckCircle2,
  Sparkles,
  Download,
  ShieldCheck,
  RotateCcw
} from 'lucide-react'
import { generateRoiPdf, CustomerDetails, RoiReportData } from '../utils/pdfExport'

interface ExportPdfModalProps {
  isOpen: boolean
  onClose: () => void
  reportData: Omit<RoiReportData, 'customer'>
}

export const ExportPdfModal: React.FC<ExportPdfModalProps> = ({
  isOpen,
  onClose,
  reportData,
}) => {
  const [customer, setCustomer] = useState<CustomerDetails>({
    customerName: '',
    organizationName: '',
    preparedBy: 'DDN AI Solutions Architecture',
    projectRef: 'Inference Capacity & ROI Sizing',
    targetCluster: 'NVIDIA H100 / H200 / B200 HGX Cluster',
    notes: '',
  })

  const [isGenerating, setIsGenerating] = useState(false)
  const [downloadSuccess, setDownloadSuccess] = useState(false)

  if (!isOpen) return null

  const handleQuickFill = (type: 'ncp' | 'enterprise') => {
    if (type === 'ncp') {
      setCustomer({
        customerName: 'Marcus Vance (VP Cloud Infrastructure)',
        organizationName: 'HyperScale AI Cloud Provider',
        preparedBy: 'DDN AI Solutions Architecture',
        projectRef: 'NCP-GPUaaS-Sizing-2026',
        targetCluster: '64× NVIDIA HGX H100 (512 GPUs) InfiniBand NDR',
        notes: 'Targeting 90%+ cache hit rate on shared multi-tenant coding assistants and reasoning prompts. Objective: expand gross margins above 85% without adding server CapEx.',
      })
    } else {
      setCustomer({
        customerName: 'Sarah Jenkins (Chief Technology Officer)',
        organizationName: 'Global Tier-1 Enterprise Financial Services',
        preparedBy: 'DDN AI Solutions Architecture',
        projectRef: 'FIN-CORP-LLM-2026',
        targetCluster: '16× NVIDIA DGX H100 Cluster',
        notes: 'Workload evaluation for on-prem compliance document analysis and multi-turn financial research agents. Sub-100ms TTFT required at peak concurrency.',
      })
    }
  }

  const handleReset = () => {
    setCustomer({
      customerName: '',
      organizationName: '',
      preparedBy: 'DDN AI Solutions Architecture',
      projectRef: 'Inference Capacity & ROI Sizing',
      targetCluster: 'NVIDIA H100 / H200 / B200 HGX Cluster',
      notes: '',
    })
  }

  const handleGeneratePdf = () => {
    setIsGenerating(true)
    setDownloadSuccess(false)

    setTimeout(() => {
      try {
        generateRoiPdf({
          ...reportData,
          customer,
        })
        setDownloadSuccess(true)
        setTimeout(() => {
          setIsGenerating(false)
          onClose()
        }, 1200)
      } catch (err) {
        console.error('Error generating PDF:', err)
        alert('Failed to generate PDF. Please verify parameters.')
        setIsGenerating(false)
      }
    }, 250)
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

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm overflow-y-auto"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.18 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-2xl rounded-2xl border shadow-2xl overflow-hidden my-auto"
          style={{
            background: 'var(--surface-primary)',
            borderColor: 'var(--border-subtle)',
          }}
        >
          {/* Header */}
          <div
            className="px-5 py-4 flex items-center justify-between border-b"
            style={{
              borderColor: 'var(--border-subtle)',
              background: 'var(--surface-secondary)',
            }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center text-white shadow-sm shrink-0"
                style={{ background: 'var(--ddn-red)' }}
              >
                <FileDown className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-[var(--text-primary)] flex items-center gap-2">
                  <span>Export Executive Assessment (PDF)</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#ED2738]/15 text-[#ED2738] border border-[#ED2738]/30 font-semibold uppercase">
                    2-Page Executive Brief
                  </span>
                </h3>
                <p className="text-[11px] text-[var(--text-muted)] mt-0.5">
                  Branded report with customer details, infrastructure sizing, and official DDN disclaimers.
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-[var(--surface-card)] transition-colors text-[var(--text-muted)] hover:text-[var(--text-primary)]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-5 sm:p-6 space-y-4 max-h-[calc(88vh-130px)] overflow-y-auto">
            {/* Live Workload Snapshot */}
            <div
              className="p-3.5 rounded-xl border text-xs"
              style={{
                background: 'linear-gradient(135deg, rgba(237,39,56,0.04) 0%, rgba(118,185,0,0.04) 100%)',
                borderColor: 'var(--border-subtle)',
              }}
            >
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[var(--text-primary)]">{reportData.workloadName}</span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-[var(--surface-card)] border text-[var(--text-secondary)]">
                    {reportData.tierLabel}
                  </span>
                </div>
                <div className="font-mono text-[11px] font-bold text-[#76B900]">
                  {reportData.tierType === 'ncp'
                    ? `${fmt$(reportData.roi.annualNcpReclaimedValue)} Reclaimed Value`
                    : reportData.tierType === 'cloud_api'
                    ? `${fmt$(reportData.roi.annualSavingsCloud)} Annual Savings`
                    : `${fmt$(reportData.roi.totalSelfHostedAnnual)} Total Annual Value`}
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 font-mono text-[11px]">
                <div className="p-1.5 rounded bg-[var(--surface-card)]/80 border border-[var(--border-subtle)]/50">
                  <span className="text-[10px] text-[var(--text-muted)] block">Shared Prompt:</span>
                  <span className="font-bold text-[var(--text-primary)]">{fmtNum(reportData.systemTokens)} tokens</span>
                </div>
                <div className="p-1.5 rounded bg-[var(--surface-card)]/80 border border-[var(--border-subtle)]/50">
                  <span className="text-[10px] text-[var(--text-muted)] block">Daily Traffic:</span>
                  <span className="font-bold text-[var(--text-primary)]">{fmtNum(reportData.dailyRequests)} req/day</span>
                </div>
                <div className="p-1.5 rounded bg-[var(--surface-card)]/80 border border-[var(--border-subtle)]/50">
                  <span className="text-[10px] text-[var(--text-muted)] block">Hit Rate:</span>
                  <span className="font-bold text-[#00C280]">{reportData.hitRate}%</span>
                </div>
                <div className="p-1.5 rounded bg-[var(--surface-card)]/80 border border-[var(--border-subtle)]/50">
                  <span className="text-[10px] text-[var(--text-muted)] block">TTFT Speedup:</span>
                  <span className="font-bold text-[#76B900]">{reportData.roi.ttftSpeedupX}× faster</span>
                </div>
              </div>
            </div>

            {/* Quick Presets / Field Autofill */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
              <span className="text-xs font-semibold text-[var(--text-secondary)] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[var(--ddn-red)]" />
                Customer Info &amp; Deliverable Details
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => handleQuickFill('ncp')}
                  className="text-[11px] px-2.5 py-1 rounded-lg border bg-[var(--surface-card)] hover:bg-[var(--surface-secondary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                  style={{ borderColor: 'var(--border-subtle)' }}
                >
                  Fill Sample NCP
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickFill('enterprise')}
                  className="text-[11px] px-2.5 py-1 rounded-lg border bg-[var(--surface-card)] hover:bg-[var(--surface-secondary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                  style={{ borderColor: 'var(--border-subtle)' }}
                >
                  Fill Sample Enterprise
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="text-[11px] p-1 rounded-lg border bg-[var(--surface-card)] hover:bg-[var(--surface-secondary)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                  style={{ borderColor: 'var(--border-subtle)' }}
                  title="Reset form fields"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="text-xs font-semibold text-[var(--text-primary)] mb-1 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                  Prospect / Contact Name
                </label>
                <input
                  type="text"
                  value={customer.customerName}
                  onChange={(e) => setCustomer({ ...customer, customerName: e.target.value })}
                  placeholder="e.g. John Doe / Head of AI Infrastructure"
                  className="w-full text-xs px-3 py-2 rounded-xl border bg-[var(--surface-card)] text-[var(--text-primary)] placeholder-[var(--text-muted)] outline-none focus:ring-1 focus:ring-[var(--ddn-red)] transition-all"
                  style={{ borderColor: 'var(--border-subtle)' }}
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[var(--text-primary)] mb-1 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                  Organization / Enterprise
                </label>
                <input
                  type="text"
                  value={customer.organizationName}
                  onChange={(e) => setCustomer({ ...customer, organizationName: e.target.value })}
                  placeholder="e.g. Acme Cloud / Tier-1 Telecom"
                  className="w-full text-xs px-3 py-2 rounded-xl border bg-[var(--surface-card)] text-[var(--text-primary)] placeholder-[var(--text-muted)] outline-none focus:ring-1 focus:ring-[var(--ddn-red)] transition-all"
                  style={{ borderColor: 'var(--border-subtle)' }}
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[var(--text-primary)] mb-1 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                  Prepared By (DDN Author)
                </label>
                <input
                  type="text"
                  value={customer.preparedBy}
                  onChange={(e) => setCustomer({ ...customer, preparedBy: e.target.value })}
                  placeholder="DDN AI Solutions Architecture"
                  className="w-full text-xs px-3 py-2 rounded-xl border bg-[var(--surface-card)] text-[var(--text-primary)] placeholder-[var(--text-muted)] outline-none focus:ring-1 focus:ring-[var(--ddn-red)] transition-all"
                  style={{ borderColor: 'var(--border-subtle)' }}
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[var(--text-primary)] mb-1 flex items-center gap-1.5">
                  <Bookmark className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                  Project Reference / Tracking ID
                </label>
                <input
                  type="text"
                  value={customer.projectRef}
                  onChange={(e) => setCustomer({ ...customer, projectRef: e.target.value })}
                  placeholder="e.g. DDN-INF-2026-ROI"
                  className="w-full text-xs px-3 py-2 rounded-xl border bg-[var(--surface-card)] text-[var(--text-primary)] placeholder-[var(--text-muted)] outline-none focus:ring-1 focus:ring-[var(--ddn-red)] transition-all"
                  style={{ borderColor: 'var(--border-subtle)' }}
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-semibold text-[var(--text-primary)] mb-1 flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                  Target Cluster / Hardware Topology
                </label>
                <input
                  type="text"
                  value={customer.targetCluster}
                  onChange={(e) => setCustomer({ ...customer, targetCluster: e.target.value })}
                  placeholder="e.g. NVIDIA H100 / H200 / B200 HGX Cluster (8× GPUs per node)"
                  className="w-full text-xs px-3 py-2 rounded-xl border bg-[var(--surface-card)] text-[var(--text-primary)] placeholder-[var(--text-muted)] outline-none focus:ring-1 focus:ring-[var(--ddn-red)] transition-all"
                  style={{ borderColor: 'var(--border-subtle)' }}
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-semibold text-[var(--text-primary)] mb-1 flex items-center justify-between">
                  <span>Executive Notes &amp; Specific Workload Requirements (Optional)</span>
                  <span className="text-[10px] text-[var(--text-muted)] font-normal">Appears on Page 2</span>
                </label>
                <textarea
                  rows={2}
                  value={customer.notes}
                  onChange={(e) => setCustomer({ ...customer, notes: e.target.value })}
                  placeholder="Add specific SLA targets, context window requirements, model checkpoints (e.g. Llama-3.3-70B, DeepSeek-V3), or customer notes..."
                  className="w-full text-xs p-2.5 rounded-xl border bg-[var(--surface-card)] text-[var(--text-primary)] placeholder-[var(--text-muted)] outline-none focus:ring-1 focus:ring-[var(--ddn-red)] transition-all resize-none"
                  style={{ borderColor: 'var(--border-subtle)' }}
                />
              </div>
            </div>

            {/* Official Report Inclusions Checklist */}
            <div
              className="p-3 rounded-xl border text-xs space-y-1.5"
              style={{
                background: 'var(--surface-secondary)',
                borderColor: 'var(--border-subtle)',
              }}
            >
              <div className="font-bold text-[var(--text-primary)] flex items-center gap-1.5 text-[11px]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#00C280]" />
                <span>Executive Deliverable Specifications:</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[10.5px] text-[var(--text-secondary)]">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3 h-3 text-[#00C280] shrink-0" />
                  <span>Page 1: Executive brief, 4 KPI cards &amp; sizing tables</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3 h-3 text-[#00C280] shrink-0" />
                  <span>Page 2: Native KV vs POSIX architectural rationale</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3 h-3 text-[#00C280] shrink-0" />
                  <span>NVIDIA Dynamo &amp; NIXL RDMA zero-copy specifications</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3 h-3 text-[#00C280] shrink-0" />
                  <span>5 official DDN engineering &amp; legal disclaimers</span>
                </div>
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div
            className="px-5 py-3.5 flex items-center justify-between gap-3 border-t"
            style={{
              borderColor: 'var(--border-subtle)',
              background: 'var(--surface-secondary)',
            }}
          >
            <button
              type="button"
              onClick={onClose}
              disabled={isGenerating}
              className="px-4 py-2 rounded-xl text-xs font-semibold border bg-[var(--surface-card)] hover:bg-[var(--surface-secondary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors disabled:opacity-50"
              style={{ borderColor: 'var(--border-subtle)' }}
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleGeneratePdf}
              disabled={isGenerating}
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-white shadow-lg flex items-center gap-2 transition-all disabled:opacity-70 active:scale-98"
              style={{
                background: downloadSuccess
                  ? '#00C280'
                  : 'linear-gradient(135deg, var(--ddn-red) 0%, #B91C1C 100%)',
              }}
            >
              {downloadSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-white" />
                  <span>Generated &amp; Downloaded!</span>
                </>
              ) : isGenerating ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Building PDF Brief...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Download Executive PDF</span>
                </>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

export default ExportPdfModal
