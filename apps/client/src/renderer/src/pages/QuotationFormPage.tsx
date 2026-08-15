import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ArrowLeft, Plus, Trash2, Save, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import * as api from '../api'

export default function QuotationFormPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const isEdit = Boolean(id)

  const [formData, setFormData] = useState({
    clientId: '',
    projectId: '',
    validUntil: '',
    status: 'DRAFT',
    transportCost: 0,
    notes: '',
  })

  const [items, setItems] = useState<any[]>([{ id: Date.now(), inventoryItemId: '', description: '', qty: 1, unitPrice: 0 }])

  const { data: clients } = useQuery({ queryKey: ['clients'], queryFn: () => api.getClients() })
  const { data: projects } = useQuery({ queryKey: ['projects'], queryFn: api.getProjects })
  const { data: inventory } = useQuery({ queryKey: ['inventory'], queryFn: () => api.getInventory() })

  useEffect(() => {
    if (isEdit) {
      api.getQuotation(id!).then(q => {
        setFormData({
          clientId: q.clientId,
          projectId: q.projectId || '',
          validUntil: q.validUntil.split('T')[0],
          status: q.status,
          transportCost: q.transportCost || 0,
          notes: q.notes || ''
        })
        if (q.items?.length) {
          setItems(q.items.map((i: any) => ({ ...i, id: i.id || Date.now() + Math.random() })))
        }
      })
    } else {
      setFormData(prev => ({ ...prev, validUntil: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] }))
    }
  }, [id, isEdit])

  const mutation = useMutation({
    mutationFn: (data: any) => isEdit ? api.updateQuotation(id!, data) : api.createQuotation(data),
    onSuccess: () => {
      toast.success(`Quotation ${isEdit ? 'updated' : 'created'}`)
      queryClient.invalidateQueries({ queryKey: ['quotations'] })
      navigate('/quotations')
    },
    onError: () => toast.error('An error occurred')
  })

  const addItem = () => setItems([...items, { id: Date.now(), inventoryItemId: '', description: '', qty: 1, unitPrice: 0 }])
  const removeItem = (id: number) => {
    if (items.length > 1) setItems(items.filter(i => i.id !== id))
  }

  const updateItem = (index: number, field: string, value: any) => {
    const newItems = [...items]
    newItems[index][field] = value

    if (field === 'inventoryItemId' && value) {
      const invItem = inventory?.find((i: any) => i.id === value)
      if (invItem) {
        newItems[index].unitPrice = invItem.soldPrice || 0
        if (!newItems[index].description) newItems[index].description = invItem.name
      }
    }
    setItems(newItems)
  }

  const handleSave = () => {
    if (!formData.clientId) return toast.error('Client is required')
    if (!formData.validUntil) return toast.error('Valid Until date is required')

    const payload = {
      ...formData,
      items: items.map(i => ({
        inventoryItemId: i.inventoryItemId || undefined,
        description: i.description,
        qty: Number(i.qty),
        unitPrice: Number(i.unitPrice)
      }))
    }
    mutation.mutate(payload)
  }

  const subTotal = items.reduce((sum, item) => sum + (Number(item.qty) * Number(item.unitPrice)), 0)
  const grandTotal = subTotal + Number(formData.transportCost)

  const filteredProjects = projects?.filter((p: any) => p.clientId === formData.clientId) || projects

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto' }}>
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button onClick={() => navigate('/quotations')} className="btn btn-ghost btn-sm">
            <ArrowLeft size={18} />
          </button>
          <h1 className="page-title">{isEdit ? 'Edit Quotation' : 'New Quotation'}</h1>
        </div>
        <button onClick={handleSave} className="btn btn-primary" disabled={mutation.isPending}>
          <Save size={18} /> {mutation.isPending ? <><Loader2 size={16} className="animate-spin mr-2 inline" /> Saving...</> : 'Save'}
        </button>
      </div>

      <div className="glass-card">
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Client</label>
            <select
            autoFocus
              className="form-select"
              value={formData.clientId}
              onChange={e => setFormData({ ...formData, clientId: e.target.value })}
            >
              <option value="">Select Client</option>
              {clients?.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Project (Optional)</label>
            <select
              className="form-select"
              value={formData.projectId}
              onChange={e => setFormData({ ...formData, projectId: e.target.value })}
            >
              <option value="">Select Project</option>
              {filteredProjects?.map((p: any) => <option key={p.id} value={p.id}>{p.title}</option>)}
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Valid Until</label>
            <input
              type="date"
              className="form-input"
              value={formData.validUntil}
              onChange={e => setFormData({ ...formData, validUntil: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Status</label>
            <select
              className="form-select"
              value={formData.status}
              onChange={e => setFormData({ ...formData, status: e.target.value })}
            >
              <option value="DRAFT">Draft</option>
              <option value="SENT">Sent</option>
              <option value="ACCEPTED">Accepted</option>
              <option value="REJECTED">Rejected</option>
            </select>
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

        <div className="divider" />

        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text-primary)' }}>
            Line Items
          </h3>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Inventory Item</th>
                  <th style={{ width: 90 }}>Qty</th>
                  <th style={{ width: 140 }}>Unit Price</th>
                  <th style={{ width: 140 }}>Line Total</th>
                  <th style={{ width: 60 }}></th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr key={item.id}>
                    <td>
                      <input
                        className="form-input"
                        value={item.description}
                        onChange={e => updateItem(index, 'description', e.target.value)}
                        placeholder="Description"
                      />
                    </td>
                    <td>
                      <select
                        className="form-select"
                        value={item.inventoryItemId || ''}
                        onChange={e => updateItem(index, 'inventoryItemId', e.target.value)}
                      >
                        <option value="">Manual Entry</option>
                        {inventory?.map((inv: any) => <option key={inv.id} value={inv.id}>{inv.name}</option>)}
                      </select>
                    </td>
                    <td>
                      <input
                        type="number" min="1"
                        className="form-input"
                        style={{ textAlign: 'right' }}
                        value={item.qty}
                        onChange={e => updateItem(index, 'qty', e.target.value)}
                      />
                    </td>
                    <td>
                      <input
                        type="number" step="0.01"
                        className="form-input"
                        style={{ textAlign: 'right' }}
                        value={item.unitPrice}
                        onChange={e => updateItem(index, 'unitPrice', e.target.value)}
                      />
                    </td>
                    <td style={{ textAlign: 'right', fontWeight: 500, color: 'var(--text-primary)' }}>
                      {(Number(item.qty) * Number(item.unitPrice)).toLocaleString('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="btn btn-ghost btn-sm"
                        style={{ color: 'var(--danger)' }}
                        disabled={items.length === 1}
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ padding: '0.75rem 1rem', borderTop: '1px solid var(--border)' }}>
              <button onClick={addItem} className="btn btn-secondary btn-sm">
                <Plus size={16} /> Add Row
              </button>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '1.5rem', marginTop: '1.5rem', borderTop: '1px solid var(--border)' }}>
          <div style={{ width: 320, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
              <span>Subtotal:</span>
              <span>{subTotal.toLocaleString('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-secondary)' }}>
              <span>Transport Cost:</span>
              <input
                type="number"
                className="form-input"
                style={{ width: 130, textAlign: 'right', padding: '0.4rem 0.75rem' }}
                value={formData.transportCost}
                onChange={e => setFormData({ ...formData, transportCost: Number(e.target.value) })}
              />
            </div>
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              fontWeight: 700, fontSize: '1.1rem', paddingTop: '0.75rem',
              borderTop: '1px solid var(--border)', color: 'var(--text-primary)'
            }}>
              <span>Grand Total:</span>
              <span>{grandTotal.toLocaleString('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}