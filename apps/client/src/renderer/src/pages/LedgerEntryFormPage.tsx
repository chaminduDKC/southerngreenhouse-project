// @ts-nocheck
import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Plus, Trash2, Save, Loader2, CheckCircle2, XCircle, AlertTriangle } from 'lucide-react'
import toast from 'react-hot-toast'
import { TargetType } from '@sg/types'
import { LoadingSkeleton } from '../components/LoadingSkeleton'
import { Modal } from '../components/Modal'
import {
  useLastLedgerEntry,
  useLedgerEntry,
  useCreateLedgerEntry,
  useUpdateLedgerEntry,
  useWorkers,
  useEligibleAllocationTargets
} from '../hooks'

export default function LedgerEntryFormPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEditing = !!id

  const { data: lastEntry } = useLastLedgerEntry()
  const { data: existingEntry, isLoading: loadingExisting } = useLedgerEntry(id || '')
  const { data: workers } = useWorkers()
  const { data: targets } = useEligibleAllocationTargets()

  const createEntry = useCreateLedgerEntry()
  const updateEntry = useUpdateLedgerEntry()

  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [openingBalance, setOpeningBalance] = useState(0)
  const [paymentGivenToday, setPaymentGivenToday] = useState(0)
  const [balanceReturnedToday, setBalanceReturnedToday] = useState(0)
  const [workerAdvances, setWorkerAdvances] = useState([])
  const [allocatedProjects, setAllocatedProjects] = useState([])

  const [showCompletionModal, setShowCompletionModal] = useState(false)
  const [completionStatus, setCompletionStatus] = useState({})
  const [pendingPayload, setPendingPayload] = useState(null)

  useEffect(() => {
    if (isEditing && existingEntry) {
      setDate(existingEntry.date.split('T')[0])
      setOpeningBalance(existingEntry.openingBalance)
      setPaymentGivenToday(existingEntry.paymentGivenToday)
      setBalanceReturnedToday(existingEntry.balanceReturnedToday)
      setWorkerAdvances(existingEntry.workerAdvances || [])
      setAllocatedProjects(existingEntry.allocatedProjects || [])
    } else if (!isEditing && lastEntry !== undefined) {
      setOpeningBalance(lastEntry ? lastEntry.balanceReturnedToday : 0)
    }
  }, [existingEntry, lastEntry, isEditing])

  const workerPaymentsTotal = workerAdvances.reduce((sum, wa) => sum + (Number(wa.advanceAmount) || 0), 0)
  const cost = openingBalance + paymentGivenToday - balanceReturnedToday + workerPaymentsTotal
  const formatCurrency = (val) => (val || 0).toLocaleString('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

  const handleAddAdvance = () => setWorkerAdvances([...workerAdvances, { workerId: '', advanceAmount: 0, targetType: '', targetId: '' }])
  const handleRemoveAdvance = (index) => { const a = [...workerAdvances]; a.splice(index, 1); setWorkerAdvances(a) }
  const handleAdvanceChange = (index, field, value) => {
    const a = [...workerAdvances]
    a[index] = { ...a[index], [field]: value }
    if (field === 'targetType') a[index].targetId = ''
    setWorkerAdvances(a)
  }
  const handleAllocateProjectToggle = (target) => {
    const exists = allocatedProjects.find(p => p.targetId === target.id)
    if (exists) setAllocatedProjects(allocatedProjects.filter(p => p.targetId !== target.id))
    else setAllocatedProjects([...allocatedProjects, { targetType: target.targetType, targetId: target.id }])
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    for (const adv of workerAdvances) {
      if (!adv.workerId || Number(adv.advanceAmount) <= 0) return toast.error('Please fill in all worker advance details correctly.')
    }
    const cleanedWorkerAdvances = workerAdvances.map(adv => {
      const p: any = { workerId: adv.workerId, advanceAmount: Number(adv.advanceAmount) }
      if (adv.targetType && adv.targetType !== '') {
        p.targetType = adv.targetType
        if (adv.targetId && adv.targetId !== '') p.targetId = adv.targetId
      }
      return p
    })
    const cleanedAllocatedProjects = allocatedProjects.map(ap => ({
      targetType: ap.targetType,
      targetId: ap.targetId
    }))
    const payload = {
      date: new Date(date).toISOString(),
      openingBalance: Number(openingBalance),
      paymentGivenToday: Number(paymentGivenToday),
      balanceReturnedToday: Number(balanceReturnedToday),
      workerAdvances: cleanedWorkerAdvances,
      completedProjects: [],
      allocatedProjects: cleanedAllocatedProjects
    }
    if (cleanedAllocatedProjects.length > 0) {
      const initStatus: Record<string, boolean> = {}
      cleanedAllocatedProjects.forEach(p => {
        initStatus[p.targetId] = existingEntry?.completedProjects?.some(c => c.targetId === p.targetId) ?? false
      })
      setCompletionStatus(initStatus)
      setPendingPayload(payload)
      setShowCompletionModal(true)
    } else {
      await doSave(payload)
    }
  }

  const doSave = async (payload) => {
    try {
      if (isEditing) { await updateEntry.mutateAsync({ id, data: payload }); toast.success('Ledger updated') }
      else { await createEntry.mutateAsync(payload); toast.success('Ledger entry saved') }
      navigate('/ledger')
    } catch (err: any) { toast.error(err.message || 'Failed to save ledger entry') }
  }

  const handleConfirmCompletion = async () => {
    if (!pendingPayload) return
    const completedProjects = Object.entries(completionStatus)
      .filter(([, done]) => Boolean(done))
      .map(([targetId]) => {
        const found = allocatedProjects.find(p => p.targetId === targetId) || allTargetsToShow.find(t => t.id === targetId)
        return { targetType: found?.targetType, targetId }
      })
      .filter(p => Boolean(p.targetType))
    setShowCompletionModal(false)
    await doSave({ ...pendingPayload, completedProjects })
  }

  if (isEditing && loadingExisting) return <div className="page-container"><LoadingSkeleton rows={8} /></div>

  const getTargetsForType = (type) => targets?.filter(t => t.targetType === type) || []
  const completableTargets = targets?.filter(t => t.status !== 'COMPLETED') || []
  const allTargetsToShow = completableTargets.slice()
  if (isEditing && existingEntry) {
    existingEntry.allocatedProjects?.forEach(ap => {
      if (!allTargetsToShow.find(t => t.id === ap.targetId))
        allTargetsToShow.push({ id: ap.targetId, title: ap.targetTitle || ap.targetId, targetType: ap.targetType, status: 'COMPLETED' })
    })
    existingEntry.completedProjects?.forEach(cp => {
      if (!allTargetsToShow.find(t => t.id === cp.targetId))
        allTargetsToShow.push({ id: cp.targetId, title: cp.targetTitle || cp.targetId, targetType: cp.targetType, status: 'COMPLETED' })
    })
  }

  const currencyInputStyle = { position: 'relative' }
  const currencyPrefixStyle = { position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontSize: '0.85rem', pointerEvents: 'none' }
  const isSaving = createEntry.isPending || updateEntry.isPending

  return (
    <div className="page-container">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
        <button type="button" className="btn btn-ghost btn-sm" onClick={() => navigate('/ledger')}><ArrowLeft size={16} /> Back</button>
        <span>/</span>
        <span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{isEditing ? 'Edit Entry' : 'New Entry'}</span>
      </div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 700, color: '#fff' }}>{isEditing ? 'Edit Ledger Entry' : 'Create Daily Ledger Entry'}</h1>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', paddingBottom: '5.5rem' }}>
        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border)' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>Financial Summary</h2>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.6rem' }}>
              {workerPaymentsTotal > 0 && (
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  (incl. LKR {formatCurrency(workerPaymentsTotal)} worker payments)
                </span>
              )}
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--danger)', opacity: 0.75 }}>Derived Cost</span>
              <span style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--danger)' }}>LKR {formatCurrency(cost)}</span>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
            <div className="form-group"><label className="form-label">Date</label><input type="date" className="form-input" value={date} onChange={e => setDate(e.target.value)} required /></div>
            <div className="form-group">
              <label className="form-label">Opening Balance <span style={{ fontSize: '0.7rem', fontWeight: 400, color: 'var(--text-muted)', marginLeft: '0.3rem' }}>(Prev. day)</span></label>
              <div style={currencyInputStyle}><span style={currencyPrefixStyle}>LKR</span><input type="number" className="form-input" style={{ paddingLeft: '3.25rem', background: 'rgba(0,0,0,0.3)', color: 'var(--text-muted)' }} value={openingBalance} readOnly /></div>
            </div>
            <div className="form-group">
              <label className="form-label">Payment Given</label>
              <div style={currencyInputStyle}><span style={currencyPrefixStyle}>LKR</span><input type="number" autoFocus min="0" step="0.01" className="form-input" style={{ paddingLeft: '3.25rem' }} value={paymentGivenToday} onChange={e => setPaymentGivenToday(parseFloat(e.target.value) || 0)} required /></div>
            </div>
            <div className="form-group">
              <label className="form-label">Balance Returned</label>
              <div style={currencyInputStyle}><span style={currencyPrefixStyle}>LKR</span><input type="number" min="0" step="0.01" className="form-input" style={{ paddingLeft: '3.25rem' }} value={balanceReturnedToday} onChange={e => setBalanceReturnedToday(parseFloat(e.target.value) || 0)} required /></div>
            </div>
          </div>
        </div>

        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border)' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>Worker Payments</h2>
            <button type="button" className="btn btn-secondary btn-sm" onClick={handleAddAdvance}><Plus size={16} /> Add Worker</button>
          </div>
          {workerAdvances.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-sm)', border: '1px dashed var(--border-bright)', fontSize: '0.9rem' }}>No worker payments for today.</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {workerAdvances.map((adv, i) => (
                <div key={i} style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'flex-end', padding: '0.75rem', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
                  <div style={{ flex: '1 1 180px' }}>
                    <label style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '0.25rem', display: 'block' }}>Worker</label>
                    <select className="form-select" style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem' }} value={adv.workerId} onChange={e => handleAdvanceChange(i, 'workerId', e.target.value)} required>
                      <option value="">Select Worker...</option>
                      {workers?.map(w => <option key={w.id} value={w.id}>{w.name} ({w.workerId})</option>)}
                    </select>
                  </div>
                  <div style={{ flex: '1 1 140px' }}>
                    <label style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '0.25rem', display: 'block' }}>Amount (LKR)</label>
                    <input type="number" min="1" step="0.01" className="form-input" style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem' }} value={adv.advanceAmount || ''} onChange={e => handleAdvanceChange(i, 'advanceAmount', parseFloat(e.target.value) || 0)} required />
                  </div>
                  <div style={{ flex: '1 1 160px' }}>
                    <label style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '0.25rem', display: 'block' }}>Project Type (Optional)</label>
                    <select className="form-select" style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem' }} value={adv.targetType || ''} onChange={e => handleAdvanceChange(i, 'targetType', e.target.value)}>
                      <option value="">None</option>
                      <option value={TargetType.PROJECT}>Project</option>
                      <option value={TargetType.SUB_PROJECT}>Sub Project</option>
                      <option value={TargetType.CHILD_PROJECT}>Child Project</option>
                    </select>
                  </div>
                  <div style={{ flex: '1 1 180px' }}>
                    <label style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '0.25rem', display: 'block' }}>Target (Optional)</label>
                    <select className="form-select" style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem' }} value={adv.targetId || ''} onChange={e => handleAdvanceChange(i, 'targetId', e.target.value)} disabled={!adv.targetType}>
                      <option value="">Select Target...</option>
                      {getTargetsForType(adv.targetType).map(t => <option key={t.id} value={t.id}>{t.title}</option>)}
                    </select>
                  </div>
                  <div><button type="button" className="btn btn-ghost btn-sm" style={{ color: 'var(--danger)' }} onClick={() => handleRemoveAdvance(i)}><Trash2 size={18} /></button></div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="glass-card">
          <div style={{ marginBottom: '1rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border)' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>Projects Worked On Today</h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
              Select projects that received work today. Cost (LKR {formatCurrency(cost)}) will be split equally and added to their cumulative total.
              You will be asked which ones are <strong>completed</strong> when you save.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', maxHeight: 240, overflowY: 'auto', padding: '0.5rem', background: 'rgba(0,0,0,0.1)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
            {allTargetsToShow.length === 0 ? (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', color: 'var(--text-muted)', padding: '1rem' }}>No active projects found.</div>
            ) : allTargetsToShow.map(target => {
              const checked = !!allocatedProjects.find(p => p.targetId === target.id)
              return (
                <label key={`alloc-${target.id}`} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', padding: '0.75rem', background: checked ? 'var(--primary-glow)' : 'var(--surface)', border: `1px solid ${checked ? 'var(--primary)' : 'var(--border)'}`, borderRadius: 'var(--radius-sm)', cursor: 'pointer', transition: 'all 0.2s ease' }}>
                  <input type="checkbox" style={{ marginTop: '0.15rem', width: 16, height: 16, accentColor: 'var(--primary)' }} checked={checked} onChange={() => handleAllocateProjectToggle(target)} />
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--text-primary)', lineHeight: 1.3 }}>{target.title}</span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.25rem', textTransform: 'uppercase' }}>{target.targetType.replace('_', ' ')}</span>
                  </div>
                </label>
              )
            })}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', position: 'sticky', bottom: '1rem', padding: '1rem', background: 'rgba(17,24,39,0.85)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow-lg)', border: '1px solid var(--border-bright)', zIndex: 10 }}>
          <button type="button" className="btn btn-ghost" onClick={() => navigate('/ledger')}>Cancel</button>
          <button type="submit" className="btn btn-primary" disabled={isSaving}>
            {isSaving ? <><Loader2 size={16} className="animate-spin mr-2 inline" /> Saving...</> : <><Save size={18} /> {isEditing ? 'Save Changes' : 'Save Ledger Entry'}</>}
          </button>
        </div>
      </form>

      <Modal isOpen={showCompletionModal} onClose={() => setShowCompletionModal(false)} title="Are any of today's projects completed?" size="sm"
        footer={<>
          <button className="btn btn-ghost" onClick={() => setShowCompletionModal(false)} disabled={isSaving}>Cancel</button>
          <button className="btn btn-primary" onClick={handleConfirmCompletion} disabled={isSaving}>
            {isSaving ? <><Loader2 size={15} className="animate-spin mr-2 inline" /> Saving...</> : <><Save size={15} /> Confirm & Save</>}
          </button>
        </>}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 'var(--radius-sm)', padding: '0.75rem 1rem', marginBottom: '1.25rem', fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
          <AlertTriangle size={15} style={{ color: 'var(--accent)', flexShrink: 0, marginTop: 1 }} />
          <span>Projects <strong>not</strong> marked as completed will keep accumulating cost in future entries. Completed projects will be locked and marked done.</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          {allocatedProjects.map(alloc => {
            const target = allTargetsToShow.find(t => t.id === alloc.targetId)
            const done = completionStatus[alloc.targetId] ?? false
            return (
              <div key={alloc.targetId}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 1rem', background: done ? 'rgba(16,185,129,0.07)' : 'rgba(255,255,255,0.02)', border: `1px solid ${done ? 'rgba(16,185,129,0.3)' : 'var(--border)'}`, borderRadius: 'var(--radius-sm)', transition: 'all 0.2s ease', cursor: 'pointer', gap: '1rem' }}
                onClick={() => setCompletionStatus(prev => ({ ...prev, [alloc.targetId]: !prev[alloc.targetId] }))}
              >
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.9rem', lineHeight: 1.3 }}>{target?.title || alloc.targetId}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginTop: '0.2rem' }}>{alloc.targetType?.replace('_', ' ')}</div>
                </div>
                <div style={{ display: 'flex', gap: '0.4rem', flexShrink: 0 }}>
                  <button type="button" onClick={e => { e.stopPropagation(); setCompletionStatus(prev => ({ ...prev, [alloc.targetId]: true })) }} className="btn btn-sm"
                    style={{ padding: '0.3rem 0.65rem', gap: '0.35rem', background: done ? 'rgba(16,185,129,0.2)' : 'var(--surface-2)', color: done ? 'var(--success)' : 'var(--text-muted)', border: `1px solid ${done ? 'rgba(16,185,129,0.4)' : 'var(--border)'}`, fontSize: '0.78rem', fontWeight: 600 }}>
                    <CheckCircle2 size={13} /> Done
                  </button>
                  <button type="button" onClick={e => { e.stopPropagation(); setCompletionStatus(prev => ({ ...prev, [alloc.targetId]: false })) }} className="btn btn-sm"
                    style={{ padding: '0.3rem 0.65rem', gap: '0.35rem', background: !done ? 'rgba(99,102,241,0.1)' : 'var(--surface-2)', color: !done ? 'var(--accent)' : 'var(--text-muted)', border: `1px solid ${!done ? 'rgba(99,102,241,0.3)' : 'var(--border)'}`, fontSize: '0.78rem', fontWeight: 600 }}>
                    <XCircle size={13} /> In Progress
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </Modal>
    </div>
  )
}
