// @ts-nocheck
import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Save, Calendar, CheckCircle2, XCircle, Users, Clock, Edit2, Trash2, X } from 'lucide-react'
import toast from 'react-hot-toast'
import * as api from '../api'
import { useF1Shortcut } from '../hooks'
import { PageHeader } from '../components/PageHeader'
import { LoadingSkeleton } from '../components/LoadingSkeleton'
import { EmptyState } from '../components/EmptyState'
import { Modal } from '../components/Modal'
import { ConfirmDialog } from '../components/ConfirmDialog'

export default function AttendancePage() {
  const queryClient = useQueryClient()
  const [activeTab, setActiveTab] = useState<'daily' | 'history'>('daily')
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [historyWorkerId, setHistoryWorkerId] = useState('')

  // Edit modal state
  const [editRecord, setEditRecord] = useState<any>(null)
  const [editForm, setEditForm] = useState({ present: true, dailyPaid: 0 })

  // Delete confirm state
  const [deleteId, setDeleteId] = useState<string | null>(null)

  useF1Shortcut(() => {
    if (activeTab === 'daily') {
      handleSaveBulk()
    }
  })

  const { data: workers } = useQuery({ queryKey: ['workers'], queryFn: api.getWorkers })

  const { data: dailyAttendance, isLoading: loadingDaily } = useQuery({
    queryKey: ['attendance', 'daily', selectedDate],
    queryFn: () => api.getAttendance({ date: selectedDate })
  })

  const [bulkData, setBulkData] = useState<Record<string, { present: boolean, dailyPaid: number }>>({})

  useEffect(() => {
    if (workers) {
      const newBulk: any = {}
      workers.forEach((w: any) => {
        const record = dailyAttendance?.find((a: any) => a.workerId === w.id)
        newBulk[w.id] = {
          present: record ? record.present : false,
          dailyPaid: record ? Number(record.dailyPaid || 0) : 0
        }
      })
      setBulkData(newBulk)
    }
  }, [workers, dailyAttendance])

  // Bulk save
  const bulkMutation = useMutation({
    mutationFn: api.bulkAttendance,
    onSuccess: () => {
      toast.success('Attendance saved for ' + selectedDate)
      queryClient.invalidateQueries({ queryKey: ['attendance'] })
    },
    onError: () => toast.error('Failed to save attendance')
  })

  const handleSaveBulk = () => {
    const records = Object.entries(bulkData).map(([workerId, data]) => ({
      workerId,
      present: data.present,
      dailyPaid: Number(data.dailyPaid) || 0
    }))
    bulkMutation.mutate({ date: selectedDate, records })
  }

  // History query
  const { data: historyAttendance, isLoading: loadingHistory } = useQuery({
    queryKey: ['attendance', 'history', historyWorkerId],
    queryFn: () => api.getAttendance(historyWorkerId ? { workerId: historyWorkerId } : {}),
    enabled: activeTab === 'history'
  })

  // Update single record
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => api.updateAttendance(id, data),
    onSuccess: () => {
      toast.success('Attendance updated')
      queryClient.invalidateQueries({ queryKey: ['attendance'] })
      setEditRecord(null)
    },
    onError: () => toast.error('Failed to update attendance')
  })

  // Delete single record
  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.deleteAttendance(id),
    onSuccess: () => {
      toast.success('Attendance record deleted')
      queryClient.invalidateQueries({ queryKey: ['attendance'] })
      setDeleteId(null)
    },
    onError: () => toast.error('Failed to delete attendance')
  })

  const openEdit = (att: any) => {
    setEditRecord(att)
    setEditForm({ present: att.present, dailyPaid: att.dailyPaid || 0 })
  }

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!editRecord) return
    updateMutation.mutate({
      id: editRecord.id,
      data: {
        present: editForm.present,
        dailyPaid: Number(editForm.dailyPaid) || 0
      }
    })
  }

  const fmt = (v: number) => v?.toLocaleString('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) ?? '0.00'

  return (
    <div className="page-container">
      <PageHeader title="Attendance" />

      <div className="tabs">
        <button className={`tab ${activeTab === 'daily' ? 'active' : ''}`} onClick={() => setActiveTab('daily')}>
          Daily Entry
        </button>
        <button className={`tab ${activeTab === 'history' ? 'active' : ''}`} onClick={() => setActiveTab('history')}>
          History
        </button>
      </div>

      {/* ── Daily Entry Tab ─────────────────────────────────── */}
      {activeTab === 'daily' && (
        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <label style={{ fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
                <Calendar size={18} /> Date:
              </label>
              <input
                type="date"
                className="form-input"
                style={{ maxWidth: 200 }}
                value={selectedDate}
                onChange={e => setSelectedDate(e.target.value)}
              />
            </div>
            <button onClick={handleSaveBulk} className="btn btn-primary" disabled={bulkMutation.isPending || loadingDaily}>
              <Save size={18} /> Save All
            </button>
          </div>

          {loadingDaily ? (
            <LoadingSkeleton rows={4} />
          ) : !workers || workers.length === 0 ? (
            <EmptyState icon={<Users />} title="No workers found" message="Add workers first to record attendance." />
          ) : (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Worker</th>
                    <th style={{ textAlign: 'center' }}>Status</th>
                    <th>Daily Paid (LKR)</th>
                  </tr>
                </thead>
                <tbody>
                  {workers.map((w: any) => (
                    <tr key={w.id}>
                      <td>
                        <div style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{w.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{w.workerId} · {w.rateType}</div>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <button
                          onClick={() => setBulkData(prev => ({ ...prev, [w.id]: { ...prev[w.id], present: !prev[w.id]?.present } }))}
                          className="btn btn-sm"
                          style={{
                            width: 130, justifyContent: 'center',
                            background: bulkData[w.id]?.present ? 'rgba(34,197,94,0.12)' : 'rgba(239,68,68,0.08)',
                            color: bulkData[w.id]?.present ? 'var(--success)' : 'var(--danger)',
                            border: `1px solid ${bulkData[w.id]?.present ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.2)'}`
                          }}
                        >
                          {bulkData[w.id]?.present ? <><CheckCircle2 size={15} /> Present</> : <><XCircle size={15} /> Absent</>}
                        </button>
                      </td>
                      <td>
                        <input
                          type="number" min="0" step="100"
                          className="form-input"
                          style={{ maxWidth: 180 }}
                          value={bulkData[w.id]?.dailyPaid || 0}
                          onChange={e => setBulkData(prev => ({ ...prev, [w.id]: { ...prev[w.id], dailyPaid: Number(e.target.value) } }))}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ── History Tab ─────────────────────────────────────── */}
      {activeTab === 'history' && (
        <div className="glass-card" style={{ padding: 0 }}>
          {/* Filter bar */}
          <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <select
              className="form-select"
              style={{ maxWidth: 260 }}
              value={historyWorkerId}
              onChange={e => setHistoryWorkerId(e.target.value)}
            >
              <option value="">All Workers</option>
              {workers?.map((w: any) => <option key={w.id} value={w.id}>{w.name} ({w.workerId})</option>)}
            </select>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              {historyAttendance ? `${historyAttendance.length} record${historyAttendance.length !== 1 ? 's' : ''}` : ''}
            </span>
          </div>

          <div style={{ padding: '1rem' }}>
            {loadingHistory ? (
              <LoadingSkeleton rows={5} />
            ) : !historyAttendance || historyAttendance.length === 0 ? (
              <EmptyState icon={<Clock />} title="No attendance records" message="Try a different worker filter." />
            ) : (
              <div className="table-container" style={{ margin: 0, border: 'none' }}>
                <table>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Worker</th>
                      <th style={{ textAlign: 'center' }}>Status</th>
                      <th style={{ textAlign: 'right' }}>Daily Paid (LKR)</th>
                      <th style={{ textAlign: 'center', width: 100 }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {historyAttendance.map((att: any) => (
                      <tr key={att.id}>
                        <td style={{ whiteSpace: 'nowrap', fontWeight: 500 }}>
                          {new Date(att.date).toLocaleDateString('en-LK', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </td>
                        <td style={{ color: 'var(--text-primary)', fontWeight: 500 }}>
                          {att.worker?.name || '—'}
                          {att.worker?.workerId && (
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: '0.4rem' }}>
                              {att.worker.workerId}
                            </span>
                          )}
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          {att.present
                            ? <span className="badge badge-completed">Present</span>
                            : <span className="badge badge-rejected">Absent</span>
                          }
                        </td>
                        <td style={{ textAlign: 'right', color: att.dailyPaid > 0 ? 'var(--warning)' : 'var(--text-muted)' }}>
                          {att.dailyPaid > 0 ? `LKR ${fmt(att.dailyPaid)}` : '—'}
                        </td>
                        <td>
                          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.35rem' }}>
                            <button
                              className="btn btn-ghost btn-sm"
                              style={{ padding: '0.35rem' }}
                              title="Edit record"
                              onClick={() => openEdit(att)}
                            >
                              <Edit2 size={14} />
                            </button>
                            <button
                              className="btn btn-ghost btn-sm"
                              style={{ padding: '0.35rem', color: 'var(--danger)' }}
                              title="Delete record"
                              onClick={() => setDeleteId(att.id)}
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Edit Modal ──────────────────────────────────────── */}
      <Modal
        isOpen={!!editRecord}
        onClose={() => setEditRecord(null)}
        title="Edit Attendance Record"
        size="sm"
        footer={<>
          <button className="btn btn-ghost" onClick={() => setEditRecord(null)}>Cancel</button>
          <button className="btn btn-primary" form="edit-att-form" type="submit" disabled={updateMutation.isPending}>
            {updateMutation.isPending ? <><Loader2 size={16} className="animate-spin mr-2 inline" /> Saving…</> : 'Save Changes'}
          </button>
        </>}
      >
        {editRecord && (
          <form id="edit-att-form" onSubmit={handleSaveEdit}>
            <div style={{ marginBottom: '1rem', padding: '0.75rem', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              <strong style={{ color: 'var(--text-primary)' }}>{editRecord.worker?.name}</strong>
              {' · '}
              {new Date(editRecord.date).toLocaleDateString('en-LK', { day: '2-digit', month: 'long', year: 'numeric' })}
            </div>

            <div className="form-group">
              <label className="form-label">Status</label>
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.25rem' }}>
                <button
                  type="button"
                  className="btn btn-sm"
                  style={{
                    flex: 1, justifyContent: 'center',
                    background: editForm.present ? 'rgba(34,197,94,0.15)' : 'var(--surface-2)',
                    color: editForm.present ? 'var(--success)' : 'var(--text-secondary)',
                    border: `1px solid ${editForm.present ? 'rgba(34,197,94,0.4)' : 'var(--border)'}`,
                  }}
                  onClick={() => setEditForm(f => ({ ...f, present: true }))}
                >
                  <CheckCircle2 size={15} /> Present
                </button>
                <button
                  type="button"
                  className="btn btn-sm"
                  style={{
                    flex: 1, justifyContent: 'center',
                    background: !editForm.present ? 'rgba(239,68,68,0.1)' : 'var(--surface-2)',
                    color: !editForm.present ? 'var(--danger)' : 'var(--text-secondary)',
                    border: `1px solid ${!editForm.present ? 'rgba(239,68,68,0.3)' : 'var(--border)'}`,
                  }}
                  onClick={() => setEditForm(f => ({ ...f, present: false }))}
                >
                  <XCircle size={15} /> Absent
                </button>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Daily Paid (LKR)</label>
              <input
                type="number"
                min="0"
                step="100"
                className="form-input"
                value={editForm.dailyPaid}
                onChange={e => setEditForm(f => ({ ...f, dailyPaid: Number(e.target.value) }))}
              />
            </div>
          </form>
        )}
      </Modal>

      {/* ── Delete Confirm ──────────────────────────────────── */}
      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => deleteId && deleteMutation.mutate(deleteId)}
        title="Delete Attendance Record"
        message="Are you sure you want to delete this attendance record? This cannot be undone."
        isPending={deleteMutation.isPending}
      />
    </div>
  )
}