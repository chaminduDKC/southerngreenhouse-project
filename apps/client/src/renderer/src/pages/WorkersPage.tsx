import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Edit2, Trash2, HardHat, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import * as api from '../api'
import { RateType } from '@sg/types'
import { PageHeader } from '../components/PageHeader'
import { LoadingSkeleton } from '../components/LoadingSkeleton'
import { EmptyState } from '../components/EmptyState'
import { Modal } from '../components/Modal'
import { ConfirmDialog } from '../components/ConfirmDialog'
import { useF1Shortcut } from '../hooks'

export default function WorkersPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingWorker, setEditingWorker] = useState<any>(null)

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    rateType: 'DAILY' as RateType,
    rate: 0
  })

  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useF1Shortcut(() => openModal())

  const { data: workers, isLoading } = useQuery({
    queryKey: ['workers'],
    queryFn: api.getWorkers
  })

  const mutation = useMutation({
    mutationFn: (data: any) => editingWorker ? api.updateWorker(editingWorker.id, data) : api.createWorker(data),
    onSuccess: () => {
      toast.success(`Worker ${editingWorker ? 'updated' : 'created'}`)
      queryClient.invalidateQueries({ queryKey: ['workers'] })
      closeModal()
    },
    onError: () => toast.error('An error occurred')
  })

  const deleteMutation = useMutation({
    mutationFn: api.deleteWorker,
    onSuccess: () => {
      toast.success('Worker deleted')
      queryClient.invalidateQueries({ queryKey: ['workers'] })
      setIsConfirmOpen(false)
    },
    onError: () => toast.error('Failed to delete worker')
  })

  const openModal = (worker?: any) => {
    if (worker) {
      setEditingWorker(worker)
      setFormData({
        name: worker.name,
        phone: worker.phone,
        address: worker.address,
        rateType: worker.rateType,
        rate: worker.rate
      })
    } else {
      setEditingWorker(null)
      setFormData({ name: '', phone: '', address: '', rateType: RateType.DAILY, rate: 0 })
    }
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingWorker(null)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    mutation.mutate(formData)
  }

  const handleDelete = () => {
    if (deletingId) {
      deleteMutation.mutate(deletingId)
    }
  }

  return (
    <div>
      <PageHeader
        title="Workers"
        action={
          <button className="btn btn-primary" onClick={() => openModal()}>
            <Plus size={18} /> Add Worker
          </button>
        }
      />

      {isLoading ? (
        <LoadingSkeleton rows={5} />
      ) : !workers || workers.length === 0 ? (
        <EmptyState
          icon={<HardHat />}
          title="No workers found"
          message="Get started by adding your first worker."
        />
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Worker ID</th>
                <th>Name</th>
                <th>Phone</th>
                <th>Rate Type</th>
                <th>Rate (LKR)</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {workers.map((w: any) => (
                <tr key={w.id} style={{ cursor: 'pointer' }} onClick={() => navigate(`/workers/${w.id}`)}>
                  <td><span className="badge badge-worker-id">{w.workerId}</span></td>
                  <td style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{w.name}</td>
                  <td>{w.phone}</td>
                  <td>
                    <span className={`badge ${w.rateType === 'DAILY' ? 'badge-in-progress' : 'badge-active'}`}>
                      {w.rateType}
                    </span>
                  </td>
                  <td>{w.rate?.toLocaleString('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }} onClick={e => e.stopPropagation()}>
                      <button onClick={() => openModal(w)} className="btn btn-ghost btn-sm">
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => { setDeletingId(w.id); setIsConfirmOpen(true) }}
                        className="btn btn-ghost btn-sm"
                        style={{ color: 'var(--danger)' }}
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

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingWorker ? 'Edit Worker' : 'Add Worker'}
        footer={
          <>
            <button type="button" className="btn btn-ghost" onClick={closeModal}>Cancel</button>
            <button type="submit" form="worker-form" className="btn btn-primary" disabled={mutation.isPending}>
              {mutation.isPending ? <><Loader2 size={16} className="animate-spin mr-2 inline" /> Saving...</> : 'Save'}
            </button>
          </>
        }
      >
        <form id="worker-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Name</label>
            <input autoFocus required className="form-input" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label">Phone</label>
            <input required className="form-input" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label">Address</label>
            <textarea required className="form-textarea" value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Rate Type</label>
              <select className="form-select" value={formData.rateType} onChange={e => setFormData({ ...formData, rateType: e.target.value as RateType })}>
                <option value="DAILY">Daily</option>
                <option value="MONTHLY">Monthly</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Rate (LKR)</label>
              <input type="number" required className="form-input" value={formData.rate} onChange={e => setFormData({ ...formData, rate: Number(e.target.value) })} />
            </div>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Delete Worker"
        message="Are you sure you want to delete this worker? This will permanently delete the worker along with all their attendance records, salary history, and advance payment records."
        isPending={deleteMutation.isPending}
      />
    </div>
  )
}