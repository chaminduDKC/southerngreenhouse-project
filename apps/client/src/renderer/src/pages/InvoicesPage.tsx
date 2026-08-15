import { useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Edit2, Trash2, Download, Receipt } from 'lucide-react'
import toast from 'react-hot-toast'
import * as api from '../api'
import { useF1Shortcut } from '../hooks'
import { PageHeader } from '../components/PageHeader'
import { LoadingSkeleton } from '../components/LoadingSkeleton'
import { EmptyState } from '../components/EmptyState'
import { ConfirmDialog } from '../components/ConfirmDialog'
import { useState } from 'react'
import { API_BASE_URL } from '@renderer/api/apiClient'

export default function InvoicesPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useF1Shortcut(() => navigate('/invoices/new'))

  const { data: invoices, isLoading } = useQuery({
    queryKey: ['invoices'],
    queryFn: api.getInvoices
  })

  const deleteMutation = useMutation({
    mutationFn: api.deleteInvoice,
    onSuccess: () => {
      toast.success('Invoice deleted')
      queryClient.invalidateQueries({ queryKey: ['invoices'] })
      setIsConfirmOpen(false)
    },
    onError: () => toast.error('Failed to delete invoice')
  })

  const downloadPDF = async (id: string) => {
    try {
      const token = localStorage.getItem('sg_token') || ''
      const res = await fetch(`${API_BASE_URL}/invoices/${id}/pdf`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const arrayBuffer = await res.arrayBuffer()
      const filename = `${"invoices".slice(0, -1)}-${id}.pdf`

      const savedPath = await window.electronAPI.savePDF("invoices", filename, arrayBuffer)
      console.log('Saved to:', savedPath)
      toast.success(`PDF downloded to Documents/irriga/invoices`)
    } catch (error) {
      toast.error('Failed to download PDF')
    }
  }

  const handleDelete = () => {
    if (deletingId) {
      deleteMutation.mutate(deletingId)
    }
  }

  return (
    <div>
      <PageHeader
        title="Invoices"
        action={
          <button className="btn btn-primary" onClick={() => navigate('/invoices/new')}>
            <Plus size={18} /> New Invoice
          </button>
        }
      />

      {isLoading ? (
        <LoadingSkeleton rows={5} />
      ) : !invoices || invoices.length === 0 ? (
        <EmptyState
          icon={<Receipt />}
          title="No invoices found"
          message="Get started by creating your first invoice."
        />
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Client</th>
                <th>Project</th>
                <th>Total Amount</th>
                <th>Amount Due</th>
                <th>Due Date</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv: any, i: number) => {
                const isOverdue = new Date(inv.dueDate) < new Date() && inv.amountDue > 0
                const isPaid = inv.amountDue === 0
                return (
                  <tr
                    key={inv.id}
                    className={isOverdue ? 'overdue-row' : ''}
                    style={{ cursor: 'pointer' }}
                    onClick={() => navigate(`/invoices/${inv.id}/edit`)}
                  >
                    <td>{i + 1}</td>
                    <td style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{inv.client?.name || '-'}</td>
                    <td>{inv.project?.title || '-'}</td>
                    <td>{inv.totalAmount?.toLocaleString('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                    <td style={{ fontWeight: 500, color: 'var(--text-primary)' }}>
                      {inv.amountDue?.toLocaleString('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td>{new Date(inv.dueDate).toLocaleDateString()}</td>
                    <td>
                      {isOverdue ? (
                        <span className="badge badge-rejected">Overdue</span>
                      ) : isPaid ? (
                        <span className="badge badge-completed">Paid</span>
                      ) : (
                        <span className="badge badge-on-hold">Pending</span>
                      )}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }} onClick={e => e.stopPropagation()}>
                        <button onClick={() => downloadPDF(inv.id)} className="btn btn-ghost btn-sm" title="Download PDF">
                          <Download size={16} />
                        </button>
                        <button onClick={() => navigate(`/invoices/${inv.id}/edit`)} className="btn btn-ghost btn-sm" title="Edit">
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => { setDeletingId(inv.id); setIsConfirmOpen(true) }}
                          className="btn btn-ghost btn-sm"
                          style={{ color: 'var(--danger)' }}
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Delete Invoice"
        message="Are you sure you want to delete this invoice? This action cannot be undone."
        isPending={deleteMutation.isPending}
      />
    </div>
  )
}