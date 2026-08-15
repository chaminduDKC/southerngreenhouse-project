import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Edit2, Trash2, Download, FileText } from 'lucide-react'
import toast from 'react-hot-toast'
import * as api from '../api'
import { useF1Shortcut } from '../hooks'
import { PageHeader } from '../components/PageHeader'
import { LoadingSkeleton } from '../components/LoadingSkeleton'
import { EmptyState } from '../components/EmptyState'
import { ConfirmDialog } from '../components/ConfirmDialog'
import { API_BASE_URL } from '@renderer/api/apiClient'

export default function QuotationsPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [statusFilter, setStatusFilter] = useState<string>('ALL')

  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useF1Shortcut(() => navigate('/quotations/new'))

  const { data: quotations, isLoading } = useQuery({
    queryKey: ['quotations'],
    queryFn: api.getQuotations
  })

  const deleteMutation = useMutation({
    mutationFn: api.deleteQuotation,
    onSuccess: () => {
      toast.success('Quotation deleted')
      queryClient.invalidateQueries({ queryKey: ['quotations'] })
      setIsConfirmOpen(false)
    },
    onError: () => toast.error('Failed to delete quotation')
  })

  const downloadPDF = async ( docId: string) => {
    try{

      const token = localStorage.getItem('sg_token') || ''
      const res = await fetch(`${API_BASE_URL}/quotations/${docId}/pdf`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const arrayBuffer = await res.arrayBuffer()
      const filename = `${"quotations".slice(0, -1)}-${docId}.pdf`
      
      const savedPath = await window.electronAPI.savePDF("quotations", filename, arrayBuffer)
      console.log('Saved to:', savedPath)
      toast.success(`PDF downloded to Documents/irriga/quotations`)
    }  catch (error) {
      toast.error('Failed to download PDF')
    }
  }
  

  const handleDelete = () => {
    if (deletingId) {
      deleteMutation.mutate(deletingId)
    }
  }

  const filtered = quotations?.filter((q: any) => statusFilter === 'ALL' || q.status === statusFilter) || []

  return (
    <div>
      <PageHeader
        title="Quotations"
        action={
          <button className="btn btn-primary" onClick={() => navigate('/quotations/new')}>
            <Plus size={18} /> New Quotation
          </button>
        }
      />

      <div style={{ marginBottom: '1.5rem' }}>
        <select
          className="form-select"
          style={{ maxWidth: 200 }}
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
        >
          <option value="ALL">All Status</option>
          <option value="DRAFT">Draft</option>
          <option value="SENT">Sent</option>
          <option value="ACCEPTED">Accepted</option>
          <option value="REJECTED">Rejected</option>
        </select>
      </div>

      {isLoading ? (
        <LoadingSkeleton rows={5} />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<FileText />}
          title="No quotations found"
          message={statusFilter !== 'ALL' ? 'Try a different status filter.' : 'Get started by creating your first quotation.'}
        />
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Client</th>
                <th>Project</th>
                <th>Valid Until</th>
                <th>Total</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((q: any, i: number) => (
                <tr key={q.id} style={{ cursor: 'pointer' }} onClick={() => navigate(`/quotations/${q.id}/edit`)}>
                  <td>{i + 1}</td>
                  <td style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{q.client?.name || '-'}</td>
                  <td>{q.project?.title || '-'}</td>
                  <td>{new Date(q.validUntil).toLocaleDateString()}</td>
                  <td>{q.total?.toLocaleString('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                  <td>
                    <span className={`badge badge-${q.status.toLowerCase()}`}>{q.status}</span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }} onClick={e => e.stopPropagation()}>
                      <button onClick={() => downloadPDF(q.id)} className="btn btn-ghost btn-sm" title="Download PDF">
                        <Download size={16} />
                      </button>
                      <button onClick={() => navigate(`/quotations/${q.id}/edit`)} className="btn btn-ghost btn-sm" title="Edit">
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => { setDeletingId(q.id); setIsConfirmOpen(true) }}
                        className="btn btn-ghost btn-sm"
                        style={{ color: 'var(--danger)' }}
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Delete Quotation"
        message="Are you sure you want to delete this quotation? This action cannot be undone."
        isPending={deleteMutation.isPending}
      />
    </div>
  )
}