import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Edit2, CheckCircle, PackageOpen, Plus, Trash2, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { ProjectStatus } from '@sg/types'
import { LoadingSkeleton } from '../components/LoadingSkeleton'
import { EmptyState } from '../components/EmptyState'
import { Modal } from '../components/Modal'
import { ConfirmDialog } from '../components/ConfirmDialog'
import { ManualAllocationModal } from '../components/ManualAllocationModal'
import {
  useChildProject,
  useUpdateChildProject,
  useMarkChildProjectUsed,
  useChildProjectAllocations,
  useSubProject,
  useProject,
  useManualAllocations,
  useDeleteManualAllocation,
  useF1Shortcut
} from '../hooks'

export default function ChildProjectDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const { data: childProject, isLoading } = useChildProject(id!)
  const { data: allocations, isLoading: allocLoading } = useChildProjectAllocations(id!)

  const { data: subProject } = useSubProject(childProject?.subProjectId || '')
  const { data: project } = useProject(subProject?.projectId || '')

  const updateChildProject = useUpdateChildProject()
  const markUsed = useMarkChildProjectUsed()

  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isAllocModalOpen, setIsAllocModalOpen] = useState(false)
  const [isMarkUsedConfirmOpen, setIsMarkUsedConfirmOpen] = useState(false)

  const [formData, setFormData] = useState<any>({})
  
  const { data: manualAllocations, refetch: refetchAllocations } = useManualAllocations('CHILD_PROJECT', id!)
  const deleteManualAlloc = useDeleteManualAllocation()
  const [isManualModalOpen, setIsManualModalOpen] = useState(false)
  const [editingManualItem, setEditingManualItem] = useState<any>(null)

  useF1Shortcut(() => {
    setEditingManualItem(null)
    setIsManualModalOpen(true)
  })

  if (isLoading) {
    return (
      <div className="page-container">
        <LoadingSkeleton rows={6} />
      </div>
    )
  }

  if (!childProject) {
    return (
      <div className="page-container">
        <EmptyState icon={<PackageOpen />} title="Child project not found" message="This child project may have been deleted or the link is incorrect." />
      </div>
    )
  }

  const formatCurrency = (val: number) => (val || 0).toLocaleString('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

  const getStatusBadgeClass = (status: ProjectStatus) => {
    switch (status) {
      case ProjectStatus.ACTIVE: return 'badge-active'
      case ProjectStatus.IN_PROGRESS: return 'badge-in-progress'
      case ProjectStatus.COMPLETED: return 'badge-completed'
      case ProjectStatus.ON_HOLD: return 'badge-on-hold'
      default: return 'badge'
    }
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await updateChildProject.mutateAsync({ id: id!, data: formData })
      toast.success('Child project updated')
      setIsEditModalOpen(false)
    } catch (err: any) {
      toast.error(err.message || 'Error updating')
    }
  }

  const handleMarkUsed = async () => {
    try {
      await markUsed.mutateAsync(id!)
      toast.success('Marked as used')
      setIsMarkUsedConfirmOpen(false)
    } catch (err: any) {
      toast.error(err.message || 'Error')
    }
  }

  return (
    <div className="page-container">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)', flexWrap: 'wrap' }}>
        <button className="btn btn-ghost btn-sm" onClick={() => navigate(`/subprojects/${childProject.subProjectId}`)}>
          <ArrowLeft size={16} /> Back
        </button>
        <span>/</span>
        <span style={{ cursor: 'pointer' }} onClick={() => navigate(`/projects/${subProject?.projectId}`)}>
          {project?.title || 'Project'}
        </span>
        <span>/</span>
        <span style={{ cursor: 'pointer' }} onClick={() => navigate(`/subprojects/${childProject.subProjectId}`)}>
          {subProject?.title || 'Sub-project'}
        </span>
        <span>/</span>
        <span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{childProject.title}</span>
      </div>

      <div className="glass-card" style={{ marginBottom: '2rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
          <div>
            <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--accent)', letterSpacing: '0.05em', marginBottom: '0.35rem' }}>
              CHILD PROJECT
            </div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 700, color: '#fff', marginBottom: '0.5rem' }}>{childProject.title}</h1>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              <span className={`badge ${getStatusBadgeClass(childProject.status)}`}>{childProject.status}</span>
              <span>Location: <span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{childProject.location}</span></span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button className="btn btn-secondary" onClick={() => setIsAllocModalOpen(true)}>
              <PackageOpen size={16} /> View Allocations
            </button>
            {childProject.status !== ProjectStatus.COMPLETED && (
              <button className="btn btn-secondary" style={{ color: 'var(--accent)', borderColor: 'rgba(99,102,241,0.3)' }} onClick={() => setIsMarkUsedConfirmOpen(true)}>
                <CheckCircle size={16} /> Mark All Used
              </button>
            )}
            <button
              className="btn btn-secondary"
              onClick={() => {
                setFormData({ title: childProject.title, location: childProject.location, value: childProject.value, notes: childProject.notes, status: childProject.status })
                setIsEditModalOpen(true)
              }}
            >
              <Edit2 size={16} /> Edit
            </button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(160px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
          <div className="stat-card glass-card">
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>Value</div>
            <div style={{ fontSize: '1.3rem', fontWeight: 600, color: 'var(--success)' }}>LKR {formatCurrency(childProject.value)}</div>
          </div>
          <div className="stat-card stat-danger glass-card">
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>Cost</div>
            <div style={{ fontSize: '1.3rem', fontWeight: 600, color: 'var(--danger)' }}>LKR {formatCurrency(childProject.cost)}</div>
          </div>
        </div>

        {childProject.notes && (
          <div style={{ background: 'rgba(0,0,0,0.15)', border: '1px solid var(--border)', padding: '1rem', borderRadius: 'var(--radius-sm)', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            <span style={{ display: 'block', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>Notes:</span>
            {childProject.notes}
          </div>
        )}
      </div>

      {/* Manual Materials Section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#fff' }}>Manual Materials</h2>
        <button
          className="btn btn-primary btn-sm"
          onClick={() => {
            setEditingManualItem(null)
            setIsManualModalOpen(true)
          }}
        >
          <Plus size={16} /> Add Material
        </button>
      </div>

      {(manualAllocations?.length || 0) === 0 ? (
        <EmptyState icon={<PackageOpen />} title="No manual materials" message="Record materials directly used for this child project here." />
      ) : (
        <div className="table-container" style={{ marginBottom: '2rem' }}>
          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th>Quantity</th>
                <th>Notes</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {manualAllocations.map((item: any) => (
                <tr key={item.id}>
                  <td style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{item.itemName}</td>
                  <td>{item.quantity} {item.unit}</td>
                  <td style={{ color: 'var(--text-secondary)' }}>{item.notes || '-'}</td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                      <button className="btn btn-ghost btn-sm" style={{ color: 'var(--accent)' }} onClick={() => { setEditingManualItem(item); setIsManualModalOpen(true); }}>
                        Edit
                      </button>
                      <button className="btn btn-ghost btn-sm" style={{ color: 'var(--danger)' }} onClick={async () => {
                        if (confirm('Delete this item?')) {
                          await deleteManualAlloc.mutateAsync(item.id)
                          toast.success('Deleted')
                          refetchAllocations()
                        }
                      }}>
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

      {/* Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Child Project"
        footer={
          <>
            <button type="button" className="btn btn-ghost" onClick={() => setIsEditModalOpen(false)}>Cancel</button>
            <button type="submit" form="edit-child-form" className="btn btn-primary" disabled={updateChildProject.isPending}>
              {updateChildProject.isPending ? <><Loader2 size={16} className="animate-spin mr-2 inline" /> Saving...</> : 'Save Changes'}
            </button>
          </>
        }
      >
        <form id="edit-child-form" onSubmit={handleUpdate}>
          <div className="form-group">
            <label className="form-label">Title</label>
            <input type="text" className="form-input" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} required />
          </div>
          <div className="form-group">
            <label className="form-label">Status</label>
            <select className="form-select" value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })}>
              <option value={ProjectStatus.ACTIVE}>Active</option>
              <option value={ProjectStatus.IN_PROGRESS}>In Progress</option>
              <option value={ProjectStatus.COMPLETED}>Completed</option>
              <option value={ProjectStatus.ON_HOLD}>On Hold</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Location</label>
            <input type="text" className="form-input" value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} required />
          </div>
          <div className="form-group">
            <label className="form-label">Value (LKR)</label>
            <input type="number" min="0" step="0.01" className="form-input" value={formData.value} onChange={e => setFormData({ ...formData, value: parseFloat(e.target.value) || 0 })} required />
          </div>
          <div className="form-group">
            <label className="form-label">Notes</label>
            <textarea className="form-textarea" value={formData.notes} onChange={e => setFormData({ ...formData, notes: e.target.value })} rows={3} />
          </div>
        </form>
      </Modal>

      {/* Allocations Modal */}
      <Modal
        isOpen={isAllocModalOpen}
        onClose={() => setIsAllocModalOpen(false)}
        title="Allocations"
        footer={<button className="btn btn-ghost" onClick={() => setIsAllocModalOpen(false)}>Close</button>}
      >
        {allocLoading ? (
          <LoadingSkeleton rows={4} />
        ) : (allocations?.length || 0) === 0 ? (
          <EmptyState icon={<PackageOpen />} title="No allocations found" message="No inventory has been allocated to this child project yet." />
        ) : (
          <div className="table-container" style={{ maxHeight: '60vh', overflow: 'auto' }}>
            <table>
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Quantity</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {allocations.map((alloc: any) => (
                  <tr key={alloc.id}>
                    <td>{alloc.inventoryItem?.name}</td>
                    <td>{alloc.quantity} {alloc.inventoryItem?.unit}</td>
                    <td>
                      <span className={`badge ${alloc.status === 'USED' ? 'badge-completed' : 'badge-active'}`}>
                        {alloc.status}
                      </span>
                    </td>
                    <td>{new Date(alloc.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        isOpen={isMarkUsedConfirmOpen}
        onClose={() => setIsMarkUsedConfirmOpen(false)}
        onConfirm={handleMarkUsed}
        title="Mark All Items Used"
        message="This will mark all allocated items as used and set this child project to COMPLETED. This action cannot be undone."
        isPending={markUsed.isPending}
      />
      
      <ManualAllocationModal
        isOpen={isManualModalOpen}
        onClose={() => setIsManualModalOpen(false)}
        targetType="CHILD_PROJECT"
        targetId={id!}
        editItem={editingManualItem}
      />
    </div>
  )
}
