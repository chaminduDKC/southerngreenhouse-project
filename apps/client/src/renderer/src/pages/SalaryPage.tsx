import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Calculator, Save, Download, CheckCircle, Edit2, Plus, Minus, Loader2, DollarSign, History, Briefcase, TrendingDown, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import * as api from '../api'
import { useF1Shortcut } from '../hooks'
import { PageHeader } from '../components/PageHeader'
import { EmptyState } from '../components/EmptyState'
import { Modal } from '../components/Modal'
import { ConfirmDialog } from '../components/ConfirmDialog'
import { LoadingSkeleton } from '../components/LoadingSkeleton'
import { API_BASE_URL } from '@renderer/api/apiClient'

const fmt = (v: number) =>
  (v ?? 0).toLocaleString('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

export default function SalaryPage() {
  const queryClient = useQueryClient()

  const currentDate = new Date()
  const [month, setMonth] = useState(currentDate.getMonth() + 1)
  const [year,  setYear]  = useState(currentDate.getFullYear())

  const { data: workers }  = useQuery({ queryKey: ['workers'],  queryFn: api.getWorkers })
  const { data: salaries } = useQuery({ queryKey: ['salaries'], queryFn: api.getSalaries })

  const [calcRows,      setCalcRows]      = useState<any[]>([])
  const [isCalculating, setIsCalculating] = useState(false)

  useF1Shortcut(() => {
    calculateAll()
  })

  // Adjust modal state
  const [adjustRow,      setAdjustRow]      = useState<any>(null)
  const [addBonus,       setAddBonus]       = useState(0)
  const [addDeduction,   setAddDeduction]   = useState(0)
  const [addAdvance,     setAddAdvance]     = useState(0)

  // History modal state
  const [historyRow, setHistoryRow] = useState<any>(null)
  const { data: historyData, isLoading: historyLoading } = useQuery({
    queryKey: ['salary-history', historyRow?.id],
    queryFn: () => api.getSalaryHistory(historyRow!.id),
    enabled: !!historyRow?.id
  })

  const [savingWorkerId, setSavingWorkerId] = useState<string | null>(null)
  const [isSavingAll,    setIsSavingAll]    = useState(false)
  const [deletingRow,    setDeletingRow]    = useState<any>(null)
  const [isDeleting,     setIsDeleting]     = useState(false)

  // Keep calcRows in sync with saved salaries without discarding unsaved calculated rows
  useEffect(() => {
    if (salaries && workers) {
      const forPeriod = salaries.filter((s: any) => s.month === month && s.year === year)

      setCalcRows(prevRows => {
        if (prevRows.length > 0) {
          // Update existing rows with latest saved data, preserving unsaved rows
          return prevRows.map(row => {
            const saved = forPeriod.find((s: any) => s.workerId === row.workerId)
            if (saved) {
              return {
                ...row,
                ...saved,
                id: saved.id,
                isSaved: true,
                basePay: Number(saved.basePay),
                dailyPaid: Number(saved.dailyPaid ?? 0),
                advancesTotal: Number(saved.advancesTotal),
                bonuses: Number(saved.bonuses),
                deductions: Number(saved.deductions),
                netPay: Number(saved.netPay),
              }
            }
            return row
          })
        }

        // Initial load: populate saved records for the period
        const rows = workers
          .map((w: any) => {
            const existing = forPeriod.find((s: any) => s.workerId === w.id)
            if (existing) {
              return {
                ...existing,
                isSaved: true,
                workerName:  w.name,
                workerIdStr: w.workerId,
                basePay:      Number(existing.basePay),
                dailyPaid:    Number(existing.dailyPaid ?? 0),
                advancesTotal:Number(existing.advancesTotal),
                bonuses:      Number(existing.bonuses),
                deductions:   Number(existing.deductions),
                netPay:       Number(existing.netPay),
              }
            }
            return null
          })
          .filter(Boolean)

        return rows
      })
    }
  }, [salaries, month, year, workers])

  // Clear rows when period changes
  useEffect(() => { setCalcRows([]) }, [month, year])

  // ── Calculate ───────────────────────────────────────────
  const calculateAll = async () => {
    if (!workers) return
    setIsCalculating(true)
    try {
      const results: any[] = []
      for (const w of workers as any[]) {
        const result: any = await api.calculateSalary({ workerId: w.id, month, year })
        // If already saved for this period, merge saved adjustments (bonuses/deductions/advances)
        const saved = salaries?.find((s: any) => s.workerId === w.id && s.month === month && s.year === year)
        const dailyPaid    = Number(result.dailyPaid ?? 0)
        const advancesTotal = saved ? Number(saved.advancesTotal) : 0
        const bonuses      = saved ? Number(saved.bonuses)     : 0
        const deductions   = saved ? Number(saved.deductions)  : 0
        const netPay       = Number(result.basePay) + bonuses - deductions - dailyPaid - advancesTotal
        results.push({
          ...result,
          workerId:      w.id,
          workerName:    w.name,
          workerIdStr:   w.workerId,
          basePay:       Number(result.basePay),
          dailyPaid,
          advancesTotal,
          bonuses,
          deductions,
          netPay,
          id:            saved?.id,
          isSaved:       !!saved,
        })
      }
      setCalcRows(results)
      console.log(results)
    } catch {
      toast.error('Failed to calculate salaries')
    } finally {
      setIsCalculating(false)
    }
  }

  // ── Save (individual worker) ─────────────────────────────
  const handleSave = async (row: any) => {
    setSavingWorkerId(row.workerId)
    try {
      const saved: any = await api.saveSalary({
        workerId:      row.workerId,
        month, year,
        daysWorked:    row.daysWorked,
        basePay:       row.basePay,
        dailyPaid:     row.dailyPaid,
        bonuses:       row.bonuses,
        deductions:    row.deductions,
        advancesTotal: row.advancesTotal,
        netPay:        row.netPay,
      })
      toast.success(`Salary saved for ${row.workerName}`)
      setCalcRows(prev => prev.map(r => r.workerId === row.workerId ? { ...r, ...saved, isSaved: true, id: saved?.id || r.id } : r))
      queryClient.invalidateQueries({ queryKey: ['salaries'] })
    } catch {
      toast.error(`Failed to save salary for ${row.workerName}`)
    } finally {
      setSavingWorkerId(null)
    }
  }

  // ── Save All Unsaved ─────────────────────────────────────
  const handleSaveAll = async () => {
    const unsaved = calcRows.filter(r => !r.isSaved)
    if (unsaved.length === 0) return
    setIsSavingAll(true)
    let savedCount = 0
    try {
      for (const row of unsaved) {
        const saved: any = await api.saveSalary({
          workerId:      row.workerId,
          month, year,
          daysWorked:    row.daysWorked,
          basePay:       row.basePay,
          dailyPaid:     row.dailyPaid,
          bonuses:       row.bonuses,
          deductions:    row.deductions,
          advancesTotal: row.advancesTotal,
          netPay:        row.netPay,
        })
        savedCount++
        setCalcRows(prev => prev.map(r => r.workerId === row.workerId ? { ...r, ...saved, isSaved: true, id: saved?.id || r.id } : r))
      }
      toast.success(`Saved all ${savedCount} worker salaries`)
      queryClient.invalidateQueries({ queryKey: ['salaries'] })
    } catch {
      toast.error('Failed to save some salaries')
    } finally {
      setIsSavingAll(false)
    }
  }

  // ── Delete saved salary ──────────────────────────────────
  const handleDeleteSalary = async () => {
    if (!deletingRow?.id) return
    setIsDeleting(true)
    try {
      await api.deleteSalary(deletingRow.id)
      toast.success(`Salary deleted for ${deletingRow.workerName}`)
      setCalcRows(prev => prev.map(r => r.workerId === deletingRow.workerId ? {
        ...r,
        isSaved: false,
        id: undefined,
        dailyPaid: 0,
        advancesTotal: 0,
        bonuses: 0,
        deductions: 0,
        netPay: r.basePay
      } : r))
      setDeletingRow(null)
      queryClient.invalidateQueries({ queryKey: ['salaries'] })
      queryClient.invalidateQueries({ queryKey: ['ledger'] })
      queryClient.invalidateQueries({ queryKey: ['attendance'] })
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete salary')
    } finally {
      setIsDeleting(false)
    }
  }

  // ── Adjust (update saved record) ─────────────────────────
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => api.updateSalary(id, data),
    onSuccess: () => {
      toast.success('Salary updated')
      queryClient.invalidateQueries({ queryKey: ['salaries'] })
      setAdjustRow(null)
      setAddBonus(0)
      setAddDeduction(0)
      setAddAdvance(0)
    },
    onError: () => toast.error('Failed to update salary'),
  })

  const openAdjust = (row: any) => {
    setAdjustRow(row)
    setAddBonus(0)
    setAddDeduction(0)
    setAddAdvance(0)
  }

  // Accumulated preview inside the modal
  const adjustedBonuses      = (adjustRow?.bonuses      ?? 0) + addBonus
  const adjustedDeductions   = (adjustRow?.deductions   ?? 0) + addDeduction
  const adjustedAdvancesTotal = (adjustRow?.advancesTotal ?? 0) + addAdvance
  const adjustedNetPay       = (adjustRow?.basePay      ?? 0)
    + adjustedBonuses
    - adjustedDeductions
    - (adjustRow?.dailyPaid ?? 0)
    - adjustedAdvancesTotal

  const handleAdjustSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!adjustRow?.id) return
    updateMutation.mutate({
      id: adjustRow.id,
      data: {
        bonuses:       adjustedBonuses,
        deductions:    adjustedDeductions,
        advancesTotal: adjustedAdvancesTotal,
        netPay:        adjustedNetPay,
      },
    })
  }

  // ── Unsaved row inline editing ───────────────────────────
  const handleUpdateRow = (index: number, field: string, value: number) => {
    const rows = [...calcRows]
    rows[index][field] = value
    const r = rows[index]
    r.netPay = r.basePay + Number(r.bonuses || 0) - Number(r.deductions || 0) - r.dailyPaid - r.advancesTotal
    setCalcRows(rows)
  }

  // ── PDF download ─────────────────────────────────────────
  const downloadPaysheet = async (salaryId: string, workerName: string) => {
    try {
      const token = localStorage.getItem('sg_token') || ''
      const res = await fetch(`${API_BASE_URL}/salary/${salaryId}/pdf`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      const arrayBuffer = await res.arrayBuffer();
      const filename = `paysheet-${workerName}-${salaryId}.pdf`

      await window.electronAPI.savePDF('paysheets', filename, arrayBuffer)
        toast.success("PDF downloded to Documents/irriga/paysheets")
    } catch {
      toast.error('Failed to download paysheet')
    }
  }

  return (
    <div className="page-container">
      <PageHeader
        title="Salary Management"
        subtitle={`${new Date(year, month - 1).toLocaleString('default', { month: 'long' })} ${year}`}
      />

      {/* Period selector */}
      <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <label style={{ fontWeight: 500, color: 'var(--text-secondary)' }}>Period:</label>
          <select className="form-select" style={{ maxWidth: 170 }} value={month} onChange={e => setMonth(Number(e.target.value))}>
            {Array.from({ length: 12 }).map((_, i) => (
              <option key={i + 1} value={i + 1}>{new Date(0, i).toLocaleString('default', { month: 'long' })}</option>
            ))}
          </select>
          <select className="form-select" style={{ maxWidth: 120 }} value={year} onChange={e => setYear(Number(e.target.value))}>
            {[2024, 2025, 2026, 2027].map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
        <button onClick={calculateAll} className="btn btn-secondary" disabled={isCalculating || !workers || isSavingAll}>
          {isCalculating ? 'Calculating…' : <><Calculator size={18} /> Calculate All</>}
        </button>
        {calcRows.some(r => !r.isSaved) && (
          <button onClick={handleSaveAll} className="btn btn-primary" disabled={isSavingAll || isCalculating}>
            {isSavingAll ? <><Loader2 size={16} className="animate-spin mr-2 inline" /> Saving All…</> : <><Save size={18} /> Save All ({calcRows.filter(r => !r.isSaved).length})</>}
          </button>
        )}
        {calcRows.length > 0 && (
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginLeft: 'auto' }}>
            {calcRows.filter(r => r.isSaved).length}/{calcRows.length} saved
          </span>
        )}
      </div>

      {/* Table */}
      {calcRows.length > 0 ? (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Worker</th>
                <th style={{ textAlign: 'center' }}>Days</th>
                <th style={{ textAlign: 'right' }}>Base Pay</th>
                <th style={{ textAlign: 'right' }}>Daily Paid</th>
                <th style={{ textAlign: 'right' }}>Advances</th>
                <th style={{ textAlign: 'right' }}>Bonuses</th>
                <th style={{ textAlign: 'right' }}>Deductions</th>
                <th style={{ textAlign: 'right' }}>Net Pay</th>
                <th style={{ textAlign: 'center', width: 190 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {calcRows.map((row, i) => (
                <tr
                  key={row.workerId}
                  style={{
                    ...(row.isSaved ? { background: 'rgba(34,197,94,0.03)' } : {}),
                    cursor: row.isSaved ? 'pointer' : 'default'
                  }}
                  onClick={(e) => {
                    // Only open history if click is not on a button/input
                    if ((e.target as HTMLElement).closest('button, input')) return
                    if (row.isSaved) setHistoryRow(row)
                  }}
                  title={row.isSaved ? 'Click to view payment history' : undefined}
                >
                  <td>
                    <div style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{row.workerName}</div>
                  </td>
                  <td style={{ textAlign: 'center', fontWeight: 600 }}>{row.daysWorked}</td>
                  <td style={{ textAlign: 'right' }}>LKR {fmt(row.basePay)}</td>

                  {/* Daily Paid — from ledger entries, read-only */}
                  <td style={{ textAlign: 'right', color: 'var(--warning)' }}>
                    {(row.dailyPaid ?? 0) > 0 ? `LKR ${fmt(row.dailyPaid)}` : '—'}
                  </td>

                  {/* Advances — manually added via adjust modal, editable inline if unsaved */}
                  <td style={{ textAlign: 'right' }}>
                    {row.isSaved ? (
                      <span style={{ color: 'var(--warning)', fontWeight: 500 }}>
                        {(row.advancesTotal ?? 0) > 0 ? `LKR ${fmt(row.advancesTotal)}` : '—'}
                      </span>
                    ) : (
                      <input
                        type="number" min="0" step="100"
                        className="form-input"
                        style={{ textAlign: 'right', color: 'var(--warning)', fontWeight: 500, maxWidth: 130 }}
                        value={row.advancesTotal}
                        onChange={e => handleUpdateRow(i, 'advancesTotal', Number(e.target.value))}
                      />
                    )}
                  </td>

                  {/* Bonuses — editable if unsaved, read-only if saved */}
                  <td style={{ textAlign: 'right' }}>
                    {row.isSaved ? (
                      <span style={{ color: 'var(--success)', fontWeight: 500 }}>
                        {row.bonuses > 0 ? `LKR ${fmt(row.bonuses)}` : '—'}
                      </span>
                    ) : (
                      <input
                        type="number" min="0" step="100"
                        className="form-input"
                        style={{ textAlign: 'right', color: 'var(--success)', fontWeight: 500, maxWidth: 130 }}
                        value={row.bonuses}
                        onChange={e => handleUpdateRow(i, 'bonuses', Number(e.target.value))}
                      />
                    )}
                  </td>

                  {/* Deductions — editable if unsaved, read-only if saved */}
                  <td style={{ textAlign: 'right' }}>
                    {row.isSaved ? (
                      <span style={{ color: row.deductions > 0 ? 'var(--danger)' : 'var(--text-muted)', fontWeight: 500 }}>
                        {row.deductions > 0 ? `LKR ${fmt(row.deductions)}` : '—'}
                      </span>
                    ) : (
                      <input
                        type="number" min="0" step="100"
                        className="form-input"
                        style={{ textAlign: 'right', color: 'var(--danger)', fontWeight: 500, maxWidth: 130 }}
                        value={row.deductions}
                        onChange={e => handleUpdateRow(i, 'deductions', Number(e.target.value))}
                      />
                    )}
                  </td>

                  <td style={{ textAlign: 'right', fontWeight: 700, fontSize: '1.05rem', color: 'var(--primary)' }}>
                    {row.basePay === 0 ? `LKR ${fmt(row.bonuses - row.deductions)}` :  `LKR ${fmt(row.netPay)}`}
                    
                  </td>

                  <td style={{ textAlign: 'center' }}>
                    {row.isSaved ? (
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem' }}>
                        <CheckCircle size={16} color="var(--success)" title="Saved" />
                        <button
                          className="btn btn-ghost btn-sm"
                          style={{ color: 'var(--accent)', padding: '0.3rem 0.5rem' }}
                          onClick={() => openAdjust(row)}
                          title="Add bonus / deduction / advance"
                        >
                          <Edit2 size={14} /> Adjust
                        </button>
                        <button
                          className="btn btn-ghost btn-sm"
                          style={{ padding: '0.3rem' }}
                          onClick={() => downloadPaysheet(row.id, row.workerName)}
                          title="Download Paysheet PDF"
                        >
                          <Download size={14} />
                        </button>
                        <button
                          className="btn btn-ghost btn-sm"
                          style={{ padding: '0.3rem', color: 'var(--danger)' }}
                          onClick={() => setDeletingRow(row)}
                          title="Delete Salary Record"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleSave(row)}
                        className="btn btn-primary btn-sm"
                        style={{ width: '100%' }}
                        disabled={savingWorkerId === row.workerId || isSavingAll}
                      >
                        {savingWorkerId === row.workerId ? (
                          <><Loader2 size={13} className="animate-spin mr-1 inline" /> Saving…</>
                        ) : (
                          <><Save size={14} /> Save</>
                        )}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : !isCalculating && (
        <EmptyState
          icon={<Calculator />}
          title="No Salary Data Loaded"
          message={`Click "Calculate All" to load salary data for ${new Date(year, month - 1).toLocaleString('default', { month: 'long', year: 'numeric' })}`}
        />
      )}

      {/* ── Adjust Modal ─────────────────────────────────────── */}
      <Modal
        isOpen={!!adjustRow}
        onClose={() => { setAdjustRow(null); setAddBonus(0); setAddDeduction(0); setAddAdvance(0) }}
        title={`Adjust — ${adjustRow?.workerName}`}
        size="sm"
        footer={<>
          <button className="btn btn-ghost" onClick={() => { setAdjustRow(null); setAddBonus(0); setAddDeduction(0); setAddAdvance(0) }}>Cancel</button>
          <button className="btn btn-primary" form="adjust-form" type="submit" disabled={updateMutation.isPending}>
            {updateMutation.isPending ? <><Loader2 size={16} className="animate-spin mr-2 inline" /> Saving…</> : 'Apply & Save'}
          </button>
        </>}
      >
        {adjustRow && (
          <form id="adjust-form" onSubmit={handleAdjustSubmit}>
            {/* Current summary */}
            <div style={{
              background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius-sm)', padding: '0.9rem 1rem', marginBottom: '1.25rem',
              display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem 1.5rem', fontSize: '0.85rem'
            }}>
              <div style={{ color: 'var(--text-muted)' }}>Base Pay</div>
              <div style={{ textAlign: 'right', fontWeight: 600 }}>LKR {fmt(adjustRow.basePay)}</div>
              <div style={{ color: 'var(--warning)' }}>Daily Paid (Ledger)</div>
              <div style={{ textAlign: 'right', color: 'var(--warning)' }}>— LKR {fmt(adjustRow.dailyPaid ?? 0)}</div>
              <div style={{ color: 'var(--warning)' }}>Current Advances</div>
              <div style={{ textAlign: 'right', color: 'var(--warning)' }}>— LKR {fmt(adjustRow.advancesTotal)}</div>
              <div style={{ color: 'var(--success)' }}>Current Bonuses</div>
              <div style={{ textAlign: 'right', color: 'var(--success)', fontWeight: 600 }}>LKR {fmt(adjustRow.bonuses)}</div>
              <div style={{ color: 'var(--danger)' }}>Current Deductions</div>
              <div style={{ textAlign: 'right', color: 'var(--danger)', fontWeight: 600 }}>LKR {fmt(adjustRow.deductions)}</div>
            </div>

            {/* Add advance */}
            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <DollarSign size={14} color="var(--warning)" /> Add Advance (LKR)
              </label>
              <input
                autoFocus
                type="number" min="0" step="100"
                className="form-input"
                value={addAdvance}
                onChange={e => setAddAdvance(Number(e.target.value))}
                placeholder="0"
              />
              {addAdvance > 0 && (
                <div style={{ fontSize: '0.78rem', color: 'var(--warning)', marginTop: '0.25rem' }}>
                  Total advances will be: LKR {fmt(adjustedAdvancesTotal)}
                </div>
              )}
            </div>

            {/* Add bonus */}
            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Plus size={14} color="var(--success)" /> Add Bonus (LKR)
              </label>
              <input
                type="number" min="0" step="100"
                className="form-input"
                value={addBonus}
                onChange={e => setAddBonus(Number(e.target.value))}
                placeholder="0"
              />
              {addBonus > 0 && (
                <div style={{ fontSize: '0.78rem', color: 'var(--success)', marginTop: '0.25rem' }}>
                  Total bonuses will be: LKR {fmt(adjustedBonuses)}
                </div>
              )}
            </div>

            {/* Add deduction */}
            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Minus size={14} color="var(--danger)" /> Add Deduction (LKR)
              </label>
              <input
                type="number" min="0" step="100"
                className="form-input"
                value={addDeduction}
                onChange={e => setAddDeduction(Number(e.target.value))}
                placeholder="0"
              />
              {addDeduction > 0 && (
                <div style={{ fontSize: '0.78rem', color: 'var(--danger)', marginTop: '0.25rem' }}>
                  Total deductions will be: LKR {fmt(adjustedDeductions)}
                </div>
              )}
            </div>

            {/* Live net pay preview */}
            <div style={{
              background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.2)',
              borderRadius: 'var(--radius-sm)', padding: '0.9rem 1rem', marginTop: '0.25rem',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center'
            }}>
              <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>New Net Pay</span>
              <span style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--primary)' }}>
               LKR {adjustRow.basePay === 0  ? adjustedBonuses - adjustedDeductions : fmt(adjustedNetPay)}
                
              </span>
            </div>
          </form>
        )}
      </Modal>
      {/* ── History Modal ─────────────────────────────────────── */}
      <Modal
        isOpen={!!historyRow}
        onClose={() => setHistoryRow(null)}
        title={`Payment History — ${historyRow?.workerName}`}
        size="md"
        footer={<button className="btn btn-ghost" onClick={() => setHistoryRow(null)}>Close</button>}
      >
        {historyRow && (
          <div>
            {/* Period badge */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: '0.75rem',
              marginBottom: '1.5rem', flexWrap: 'wrap'
            }}>
              <span style={{
                background: 'rgba(99,102,241,0.12)', color: 'var(--primary)',
                borderRadius: 'var(--radius-sm)', padding: '0.3rem 0.75rem',
                fontSize: '0.85rem', fontWeight: 600
              }}>
                {new Date(historyRow.year, historyRow.month - 1).toLocaleString('default', { month: 'long', year: 'numeric' })}
              </span>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                {historyRow.daysWorked} days worked
              </span>
            </div>

            {historyLoading ? (
              <LoadingSkeleton rows={4} />
            ) : (
              <>
                {/* Daily Paid section */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                    marginBottom: '0.75rem', paddingBottom: '0.5rem',
                    borderBottom: '1px solid var(--border)'
                  }}>
                    <History size={15} color="var(--warning)" />
                    <span style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.9rem' }}>
                      Daily Paid via Ledger
                    </span>
                    <span style={{
                      marginLeft: 'auto', fontWeight: 700,
                      color: 'var(--warning)', fontSize: '0.9rem'
                    }}>
                      LKR {fmt(historyData?.dailyPaidHistory?.reduce((s: number, r: any) => s + r.amount, 0) ?? 0)}
                    </span>
                  </div>

                  {!historyData?.dailyPaidHistory?.length ? (
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textAlign: 'center', padding: '1rem 0' }}>
                      No daily paid records this month
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                      {historyData.dailyPaidHistory.map((entry: any, idx: number) => (
                        <div key={idx} style={{
                          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                          padding: '0.6rem 0.85rem',
                          background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)',
                          borderRadius: 'var(--radius-sm)', gap: '1rem'
                        }}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem', minWidth: 0 }}>
                            <span style={{ fontWeight: 500, color: 'var(--text-primary)', fontSize: '0.875rem' }}>
                              {new Date(entry.date).toLocaleDateString('en-LK', { day: '2-digit', month: 'short', year: 'numeric' })}
                            </span>
                            {entry.targetTitle && (
                              <span style={{
                                fontSize: '0.75rem', color: 'var(--text-muted)',
                                display: 'flex', alignItems: 'center', gap: '0.3rem'
                              }}>
                                <Briefcase size={11} /> {entry.targetTitle}
                              </span>
                            )}
                          </div>
                          <span style={{ fontWeight: 700, color: 'var(--warning)', whiteSpace: 'nowrap', fontSize: '0.9rem' }}>
                            LKR {fmt(entry.amount)}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Advances section */}
                <div>
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                    marginBottom: '0.75rem', paddingBottom: '0.5rem',
                    borderBottom: '1px solid var(--border)'
                  }}>
                    <TrendingDown size={15} color="var(--danger)" />
                    <span style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.9rem' }}>
                      Advances (Manual)
                    </span>
                    <span style={{
                      marginLeft: 'auto', fontWeight: 700,
                      color: (historyData?.advancesTotal ?? 0) > 0 ? 'var(--danger)' : 'var(--text-muted)',
                      fontSize: '0.9rem'
                    }}>
                      LKR {fmt(historyData?.advancesTotal ?? 0)}
                    </span>
                  </div>
                  <div style={{
                    padding: '0.75rem 0.85rem',
                    background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-sm)', fontSize: '0.85rem',
                    color: (historyData?.advancesTotal ?? 0) > 0 ? 'var(--text-secondary)' : 'var(--text-muted)'
                  }}>
                    {(historyData?.advancesTotal ?? 0) > 0
                      ? `Total advance deduction for this period: LKR ${fmt(historyData.advancesTotal)}`
                      : 'No advances recorded for this period'}
                  </div>
                </div>

                {/* Net pay summary */}
                <div style={{
                  marginTop: '1.5rem',
                  background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.2)',
                  borderRadius: 'var(--radius-sm)', padding: '0.9rem 1rem',
                  display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem 1rem', fontSize: '0.85rem'
                }}>
                  <div style={{ color: 'var(--text-muted)' }}>Base Pay</div>
                  <div style={{ textAlign: 'right', fontWeight: 600 }}>LKR {fmt(historyRow.basePay)}</div>
                  {historyRow.bonuses > 0 && <>
                    <div style={{ color: 'var(--success)' }}>Bonuses</div>
                    <div style={{ textAlign: 'right', color: 'var(--success)', fontWeight: 600 }}>+ LKR {fmt(historyRow.bonuses)}</div>
                  </>}
                  {historyRow.deductions > 0 && <>
                    <div style={{ color: 'var(--danger)' }}>Deductions</div>
                    <div style={{ textAlign: 'right', color: 'var(--danger)', fontWeight: 600 }}>— LKR {fmt(historyRow.deductions)}</div>
                  </>}
                  <div style={{ color: 'var(--warning)' }}>Daily Paid</div>
                  <div style={{ textAlign: 'right', color: 'var(--warning)', fontWeight: 600 }}>— LKR {fmt(historyRow.dailyPaid ?? 0)}</div>
                  {(historyRow.advancesTotal ?? 0) > 0 && <>
                    <div style={{ color: 'var(--warning)' }}>Advances</div>
                    <div style={{ textAlign: 'right', color: 'var(--warning)', fontWeight: 600 }}>— LKR {fmt(historyRow.advancesTotal)}</div>
                  </>}
                  <div style={{ color: 'var(--text-primary)', fontWeight: 700, borderTop: '1px solid var(--border)', paddingTop: '0.4rem' }}>Net Pay</div>
                  <div style={{ textAlign: 'right', color: 'var(--primary)', fontWeight: 800, fontSize: '1.05rem', borderTop: '1px solid var(--border)', paddingTop: '0.4rem' }}>LKR {fmt(historyRow.netPay)}</div>
                </div>
              </>
            )}
          </div>
        )}
      </Modal>

      {/* ── Delete Confirmation Dialog ────────────────────────── */}
      <ConfirmDialog
        isOpen={!!deletingRow}
        onClose={() => setDeletingRow(null)}
        onConfirm={handleDeleteSalary}
        title={`Delete Salary Record — ${deletingRow?.workerName}`}
        message={`Are you sure you want to delete the salary record for ${deletingRow?.workerName} (${month}/${year})? This will also remove the corresponding worker advances in the daily ledger and reset attendance daily paid for this month.`}
        isPending={isDeleting}
      />
    </div>
  )
}