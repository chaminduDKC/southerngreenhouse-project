// @ts-nocheck
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ArrowLeft, Loader2, Save } from 'lucide-react'
import toast from 'react-hot-toast'
import * as api from '../api'

export default function InvoiceFormPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const isEdit = Boolean(id)

  const [formData, setFormData] = useState({
    clientId: '',
    projectId: '',
    quotationId: '',
    totalAmount: 0,
    amountDue: 0,
    dueDate: '',
    notes: '',
  })

  const { data: clients } = useQuery({ queryKey: ['clients'], queryFn: () => api.getClients() })
  const { data: allProjects } = useQuery({ queryKey: ['projects'], queryFn: api.getProjects })
  const { data: allQuotations } = useQuery({ queryKey: ['quotations'], queryFn: api.getQuotations })

  useEffect(() => {
    if (isEdit) {
      api.getInvoice(id!).then(i => {
        setFormData({
          clientId: i.clientId,
          projectId: i.projectId,
          quotationId: i.quotationId || '',
          totalAmount: i.totalAmount,
          amountDue: i.amountDue,
          dueDate: i.dueDate.split('T')[0],
          notes: i.notes || ''
        })
      })
    } else {
      setFormData(prev => ({ ...prev, dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] }))
    }
  }, [id, isEdit])

  const mutation = useMutation({
    mutationFn: (data: any) => isEdit ? api.updateInvoice(id!, data) : api.createInvoice(data),
    onSuccess: () => {
      toast.success(`Invoice ${isEdit ? 'updated' : 'created'}`)
      queryClient.invalidateQueries({ queryKey: ['invoices'] })
      navigate('/invoices')
    },
    onError: () => toast.error('An error occurred')
  })

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.clientId || !formData.projectId || !formData.dueDate) {
      return toast.error('Please fill required fields')
    }
    mutation.mutate(formData)
  }

  const getProjectOptions = () => {
    const options: JSX.Element[] = []
    allProjects?.forEach((p: any) => {
      options.push(<option key={p.id} value={p.id}>Project: {p.title}</option>)
      p.subProjects?.forEach((sp: any) => {
        options.push(<option key={sp.id} value={sp.id}>-- Sub: {sp.title}</option>)
        sp.children?.forEach((cp: any) => {
          options.push(<option key={cp.id} value={cp.id}>---- Child: {cp.title}</option>)
        })
      })
    })
    return options
  }

  const filteredQuotations = allQuotations?.filter((q: any) => q.clientId === formData.clientId) || []

  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button onClick={() => navigate('/invoices')} className="btn btn-ghost btn-sm">
            <ArrowLeft size={18} />
          </button>
          <h1 className="page-title">{isEdit ? 'Edit Invoice' : 'New Invoice'}</h1>
        </div>
      </div>

      <form onSubmit={handleSave} className="glass-card">
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Client *</label>
            <select
            autoFocus
              className="form-select" required
              value={formData.clientId}
              onChange={e => setFormData({ ...formData, clientId: e.target.value })}
            >
              <option value="">Select Client</option>
              {clients?.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Project *</label>
            <select
              className="form-select" required
              value={formData.projectId}
              onChange={e => setFormData({ ...formData, projectId: e.target.value })}
            >
              <option value="">Select Project/Sub/Child</option>
              {getProjectOptions()}
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Quotation (Optional)</label>
            <select
              className="form-select"
              value={formData.quotationId}
              onChange={e => {
                const qId = e.target.value
                const quote = allQuotations?.find((q: any) => q.id === qId)
                if (quote && !isEdit) {
                  setFormData({ ...formData, quotationId: qId, totalAmount: quote.total, amountDue: quote.total })
                } else {
                  setFormData({ ...formData, quotationId: qId })
                }
              }}
              disabled={!formData.clientId}
            >
              <option value="">Select Quotation</option>
              {filteredQuotations.map((q: any) => (
                <option key={q.id} value={q.id}>{q.id.slice(0, 8)} - {q.total?.toLocaleString('en-LK')}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Due Date *</label>
            <input
              type="date" required
              className="form-input"
              value={formData.dueDate}
              onChange={e => setFormData({ ...formData, dueDate: e.target.value })}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Total Amount *</label>
            <input
              type="number" step="0.01" required
              className="form-input"
              value={formData.totalAmount}
              onChange={e => setFormData({ ...formData, totalAmount: Number(e.target.value) })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Amount Due *</label>
            <input
              type="number" step="0.01" required
              className="form-input"
              value={formData.amountDue}
              onChange={e => setFormData({ ...formData, amountDue: Number(e.target.value) })}
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Notes</label>
          <textarea
            className="form-textarea"
            value={formData.notes}
            onChange={e => setFormData({ ...formData, notes: e.target.value })}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
          <button type="submit" className="btn btn-primary" disabled={mutation.isPending}>
            <Save size={18} /> {mutation.isPending ? <><Loader2 size={16} className="animate-spin mr-2 inline" /> Saving...</> : 'Save Invoice'}
          </button>
        </div>
      </form>
    </div>
  )
}