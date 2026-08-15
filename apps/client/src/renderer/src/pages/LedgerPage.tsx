// @ts-nocheck
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Eye, Edit2, Trash2, BookOpen } from 'lucide-react'
import toast from 'react-hot-toast'
import { PageHeader } from '../components/PageHeader'
import { EmptyState } from '../components/EmptyState'
import { Modal } from '../components/Modal'
import { ConfirmDialog } from '../components/ConfirmDialog'
import { useLedger, useDeleteLedgerEntry, useF1Shortcut } from '../hooks'

export default function LedgerPage() {
  const navigate = useNavigate()
  const [page, setPage] = useState(1)

  const { data: pagedData, isLoading } = useLedger(page, 10)
  const deleteEntry = useDeleteLedgerEntry()

  const [selectedEntry, setSelectedEntry] = useState<any>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useF1Shortcut(() => navigate('/ledger/new'))

  const formatCurrency = (val: number) => (val || 0).toLocaleString('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

  const handleDelete = async () => {
    if (!deletingId) return
    try {
      await deleteEntry.mutateAsync(deletingId)
      toast.success('Deleted successfully')
      setDeletingId(null)
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete')
    }
  }

  const entries = pagedData?.data || []
  const totalPages = pagedData?.totalPages || 1

  return (
    <div className="page-container">
      <PageHeader
        title="Daily Ledger"
        action={
          <button className="btn btn-primary" onClick={() => navigate('/ledger/new')}>
            <Plus size={18} /> New Entry
          </button>
        }
      />

      <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
        {isLoading ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading ledger...</div>
        ) : entries.length === 0 ? (
          <EmptyState icon={<BookOpen />} title="No ledger entries found" message="Create your first entry to start tracking daily balances." />
        ) : (
          <div className="table-container" style={{ margin: 0, border: 'none' }}>
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th style={{ textAlign: 'right' }}>Opening Balance</th>
                  <th style={{ textAlign: 'right' }}>Payment Given</th>
                  <th style={{ textAlign: 'right' }}>Return</th>
                  <th style={{ textAlign: 'right' }}>Cost</th>
                  <th style={{ textAlign: 'center', width: 140 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {entries.map(entry => (
                  <tr
                    key={entry.id}
                    style={entry.isLatest ? { background: 'rgba(34,197,94,0.05)' } : undefined}
                  >
                    <td style={{ fontWeight: 500, color: 'var(--text-primary)', borderLeft: entry.isLatest ? '3px solid var(--success)' : undefined }}>
                      {new Date(entry.date).toLocaleDateString()}
                      {entry.isLatest && <span className="badge badge-active" style={{ marginLeft: '0.5rem', fontSize: '0.65rem' }}>Latest</span>}
                    </td>
                    <td style={{ textAlign: 'right' }}>LKR {formatCurrency(entry.openingBalance)}</td>
                    <td style={{ textAlign: 'right', color: 'var(--accent)' }}>LKR {formatCurrency(entry.paymentGivenToday)}</td>
                    <td style={{ textAlign: 'right', color: 'var(--success)' }}>LKR {formatCurrency(entry.balanceReturnedToday)}</td>
                    <td style={{ textAlign: 'right', fontWeight: 600, color: 'var(--danger)' }}>LKR {formatCurrency(entry.cost)}</td>
                    <td>
                      <div style={{ display: 'flex', justifyContent: 'center', gap: '0.25rem' }}>
                        <button className="btn btn-ghost btn-sm" style={{ padding: '0.4rem' }} onClick={() => setSelectedEntry(entry)} title="View">
                          <Eye size={16} />
                        </button>
                        {entry.isLatest && (
                          <>
                            <button className="btn btn-ghost btn-sm" style={{ padding: '0.4rem', color: 'var(--accent)' }} onClick={() => navigate(`/ledger/${entry.id}/edit`)} title="Edit">
                              <Edit2 size={16} />
                            </button>
                            <button className="btn btn-ghost btn-sm" style={{ padding: '0.4rem', color: 'var(--danger)' }} onClick={() => setDeletingId(entry.id)} title="Delete">
                              <Trash2 size={16} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {totalPages > 1 && (
          <div className="pagination" style={{ justifyContent: 'center' }}>
            <button className="btn btn-secondary btn-sm" disabled={page === 1} onClick={() => setPage(p => Math.max(1, p - 1))}>Prev</button>
            <span style={{ padding: '0 1rem', fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Page {page} of {totalPages}</span>
            <button className="btn btn-secondary btn-sm" disabled={page === totalPages} onClick={() => setPage(p => Math.min(totalPages, p + 1))}>Next</button>
          </div>
        )}
      </div>

      {/* View Modal */}
      <Modal
        isOpen={!!selectedEntry}
        onClose={() => setSelectedEntry(null)}
        title={selectedEntry ? `Ledger Entry: ${new Date(selectedEntry.date).toLocaleDateString()}` : ''}
        footer={<button className="btn btn-secondary" onClick={() => setSelectedEntry(null)}>Close</button>}
      >
        {selectedEntry && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(120px, 1fr))', gap: '1rem' }}>
              <div style={{ padding: '0.75rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Opening Balance</div>
                <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>LKR {formatCurrency(selectedEntry.openingBalance)}</div>
              </div>
              <div style={{ padding: '0.75rem', background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 'var(--radius-sm)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--accent)', marginBottom: '0.25rem' }}>Payment Given</div>
                <div style={{ fontWeight: 600, color: 'var(--accent)' }}>LKR {formatCurrency(selectedEntry.paymentGivenToday)}</div>
              </div>
              <div style={{ padding: '0.75rem', background: 'var(--primary-glow)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 'var(--radius-sm)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--success)', marginBottom: '0.25rem' }}>Balance Returned</div>
                <div style={{ fontWeight: 600, color: 'var(--success)' }}>LKR {formatCurrency(selectedEntry.balanceReturnedToday)}</div>
              </div>
              <div style={{ padding: '0.75rem', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 'var(--radius-sm)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--danger)', marginBottom: '0.25rem' }}>Total Cost</div>
                <div style={{ fontWeight: 600, color: 'var(--danger)' }}>LKR {formatCurrency(selectedEntry.cost)}</div>
              </div>
            </div>

            <div>
              <h3 style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.75rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border)' }}>
                Worker Advances
              </h3>
              {selectedEntry.workerAdvances && selectedEntry.workerAdvances.length > 0 ? (
                <table style={{ width: '100%', fontSize: '0.85rem' }}>
                  <thead>
                    <tr style={{ textAlign: 'left', color: 'var(--text-muted)', borderBottom: '1px solid var(--border)' }}>
                      <th style={{ paddingBottom: '0.5rem', fontWeight: 500 }}>Worker</th>
                      <th style={{ paddingBottom: '0.5rem', fontWeight: 500 }}>Project/Target</th>
                      <th style={{ paddingBottom: '0.5rem', fontWeight: 500, textAlign: 'right' }}>Advance Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedEntry.workerAdvances.map((adv: any, i: number) => (
                      <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                        <td style={{ padding: '0.5rem 0', color: 'var(--text-primary)' }}>{adv.workerName}</td>
                        <td style={{ padding: '0.5rem 0' }}>
                          {adv.targetTitle ? (
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                              <span className="chip">{adv.targetType?.replace('_', ' ')}</span>
                              <span style={{ color: 'var(--text-secondary)' }}>{adv.targetTitle}</span>
                            </span>
                          ) : '-'}
                        </td>
                        <td style={{ padding: '0.5rem 0', textAlign: 'right', fontWeight: 500, color: 'var(--warning)' }}>LKR {formatCurrency(adv.advanceAmount)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>No worker advances recorded.</div>
              )}
            </div>

            <div>
              <h3 style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.75rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border)' }}>
                Cost Allocation to Completed Projects
              </h3>
              {selectedEntry.allocatedProjects && selectedEntry.allocatedProjects.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {selectedEntry.allocatedProjects.map((p: any, i: number) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--primary)' }} />
                        <span className="chip">{p.targetType?.replace('_', ' ')}</span>
                        <span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{p.targetTitle || p.targetId}</span>
                      </div>
                      <div style={{ fontWeight: 600, color: 'var(--danger)' }}>
                        + LKR {formatCurrency(p.amount)}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>Cost was not allocated to any projects.</div>
              )}
            </div>

            {/* <div>
              <h3 style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.75rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border)' }}>
                Completed Projects
              </h3>
              {selectedEntry.completedProjects && selectedEntry.completedProjects.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {selectedEntry.completedProjects.map((p: any, i: number) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
                      <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--success)' }} />
                      <span className="chip">{p.targetType?.replace('_', ' ')}</span>
                      <span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{p.targetTitle || p.targetId}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>No projects marked as completed.</div>
              )}
            </div> */}
          </div>
        )}
      </Modal>

      <ConfirmDialog
        isOpen={!!deletingId}
        onClose={() => setDeletingId(null)}
        onConfirm={handleDelete}
        title="Delete Ledger Entry"
        message="Delete this ledger entry? This can only be done for the latest entry, and cannot be undone."
        isPending={deleteEntry.isPending}
      />
    </div>
  )
}