// @ts-nocheck
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
  useSubProject,
  useUpdateSubProject,
  useMarkSubProjectUsed,
  useSubProjectAllocations,
  useCreateChildProject,
  useDeleteChildProject,
  useProject,
  useAggregatedManualAllocations,
  useDeleteManualAllocation,
  useF1Shortcut
} from '../hooks'

export default function SubProjectDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const { data: subProject, isLoading } = useSubProject(id!)
  const { data: allocations, isLoading: allocLoading } = useSubProjectAllocations(id!)
  const { data: parentProject } = useProject(subProject?.projectId || '')

  const updateSubProject = useUpdateSubProject()
  const markUsed = useMarkSubProjectUsed()
  const createChildProject = useCreateChildProject()
  const deleteChildProject = useDeleteChildProject()

  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isAllocModalOpen, setIsAllocModalOpen] = useState(false)
  const [isChildModalOpen, setIsChildModalOpen] = useState(false)
  const [isMaterialsModalOpen, setIsMaterialsModalOpen] = useState(false)

  const [isMarkUsedConfirmOpen, setIsMarkUsedConfirmOpen] = useState(false)
  const [deletingChildId, setDeletingChildId] = useState<string | null>(null)

  const [formData, setFormData] = useState<any>({})

  useF1Shortcut(() => {
    setFormData({ title: '', location: '', value: 0, notes: '' })
    setIsChildModalOpen(true)
  })

  const { data: manualAllocations, refetch: refetchAllocations } = useAggregatedManualAllocations('SUB_PROJECT', id!)
  const deleteManualAlloc = useDeleteManualAllocation()
  const [isManualModalOpen, setIsManualModalOpen] = useState(false)
  const [editingManualItem, setEditingManualItem] = useState<any>(null)

  if (isLoading) {
    return (
      <div className="page-container">
        <LoadingSkeleton rows={6} />
      </div>
    )
  }

  if (!subProject) {
    return (
      <div className="page-container">
        <EmptyState icon={<PackageOpen />} title="Sub-project not found" message="This sub-project may have been deleted or the link is incorrect." />
      </div>
    )
  }

  const manualTargetOptions = [
    { id: id!, title: subProject?.title || 'Sub Project', targetType: 'SUB_PROJECT' as const }
  ];
  if (subProject?.children) {
    subProject.children.forEach((child: any) => {
      manualTargetOptions.push({ id: child.id, title: child.title, targetType: 'CHILD_PROJECT' as const })
    })
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
      await updateSubProject.mutateAsync({ id: id!, data: formData })
      toast.success('Sub-project updated')
      setIsEditModalOpen(false)
    } catch (err: any) {
      toast.error(err.message || 'Error updating')
    }
  }

  const handleCreateChild = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await createChildProject.mutateAsync({ ...formData, subProjectId: id! })
      toast.success('Child project created')
      setIsChildModalOpen(false)
    } catch (err: any) {
      toast.error(err.message || 'Error creating child project')
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

  const handleDeleteChild = async () => {
    if (!deletingChildId) return
    try {
      await deleteChildProject.mutateAsync(deletingChildId)
      toast.success('Deleted child project')
      setDeletingChildId(null)
    } catch (err: any) {
      toast.error(err.message || 'Error')
    }
  }

  return (
    <div className="page-container">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)', flexWrap: 'wrap' }}>
        <button className="btn btn-ghost btn-sm" onClick={() => navigate(`/projects/${subProject.projectId}`)}>
          <ArrowLeft size={16} /> Back
        </button>
        <span>/</span>
        <span style={{ cursor: 'pointer' }} onClick={() => navigate(`/projects/${subProject.projectId}`)}>
          {parentProject?.title || 'Project'}
        </span>
        <span>/</span>
        <span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{subProject.title}</span>
      </div>

      <div className="glass-card" style={{ marginBottom: '2rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
          <div>
            <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--accent)', letterSpacing: '0.05em', marginBottom: '0.35rem' }}>
              SUB-PROJECT
            </div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 700, color: '#fff', marginBottom: '0.5rem' }}>{subProject.title}</h1>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              <span className={`badge ${getStatusBadgeClass(subProject.status)}`}>{subProject.status}</span>
              <span>Location: <span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{subProject.location}</span></span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button className="btn btn-secondary" onClick={() => setIsAllocModalOpen(true)}>
              <PackageOpen size={16} /> View Allocations
            </button>
            <button className="btn btn-secondary" onClick={() => setIsMaterialsModalOpen(true)}>
              <PackageOpen size={16} /> View ww
            </button>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button
            className="btn btn-secondary"
            onClick={() => {
              setEditingManualItem(null)
              setIsManualModalOpen(true)
            }}
          >
            <Plus size={16} /> Add Material
          </button>
        </div>
            {subProject.status !== ProjectStatus.COMPLETED && (
              <button className="btn btn-secondary" style={{ color: 'var(--accent)', borderColor: 'rgba(99,102,241,0.3)' }} onClick={() => setIsMarkUsedConfirmOpen(true)}>
                <CheckCircle size={16} /> Mark All Used
              </button>
            )}
            <button
              className="btn btn-secondary"
              onClick={() => {
                setFormData({ title: subProject.title, location: subProject.location, value: subProject.value, notes: subProject.notes, status: subProject.status })
                setIsEditModalOpen(true)
              }}
            >
              <Edit2 size={16} /> Edit
            </button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(160px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
          <div className="stat-card glass-card">
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>Value</div>
            <div style={{ fontSize: '1.3rem', fontWeight: 600, color: 'var(--success)' }}>LKR {formatCurrency(subProject.value)}</div>
          </div>
          <div className="stat-card stat-danger glass-card">
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>Cost</div>
            <div style={{ fontSize: '1.3rem', fontWeight: 600, color: 'var(--danger)' }}>LKR {formatCurrency(subProject.cost)}</div>
          </div>
          <div className="stat-card stat-accent glass-card">
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>Children</div>
            <div style={{ fontSize: '1.3rem', fontWeight: 600, color: 'var(--text-primary)' }}>{subProject.children?.length || 0}</div>
          </div>
        </div>

        {subProject.notes && (
          <div style={{ background: 'rgba(0,0,0,0.15)', border: '1px solid var(--border)', padding: '1rem', borderRadius: 'var(--radius-sm)', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            <span style={{ display: 'block', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>Notes:</span>
            {subProject.notes}
          </div>
        )}
      </div>

     


      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#fff' }}>Child Projects</h2>
        <button
          className="btn btn-primary btn-sm"
          onClick={() => {
            setFormData({ title: '', location: '', value: 0, notes: '' })
            setIsChildModalOpen(true)
          }}
        >
          <Plus size={16} /> Add Child Project
        </button>
      </div>

      {(subProject.children?.length || 0) === 0 ? (
        <EmptyState icon={<PackageOpen />} title="No child projects found" message="Add a child project to break this sub-project down further." />
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Location</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {subProject.children.map(child => (
                <tr key={child.id} style={{ cursor: 'pointer' }} onClick={() => navigate(`/childprojects/${child.id}`)}>
                  <td style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{child.title}</td>
                  <td>{child.location}</td>
                  <td><span className={`badge ${getStatusBadgeClass(child.status)}`}>{child.status}</span></td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }} onClick={e => e.stopPropagation()}>
                      <button className="btn btn-ghost btn-sm" style={{ color: 'var(--accent)' }} onClick={() => navigate(`/childprojects/${child.id}`)}>
                        View
                      </button>
                      <button className="btn btn-ghost btn-sm" style={{ color: 'var(--danger)' }} onClick={() => setDeletingChildId(child.id)}>
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
        title="Edit Sub-project"
        footer={
          <>
            <button type="button" className="btn btn-ghost" onClick={() => setIsEditModalOpen(false)}>Cancel</button>
            <button type="submit" form="edit-subproject-form" className="btn btn-primary" disabled={updateSubProject.isPending}>
              {updateSubProject.isPending ? <><Loader2 size={16} className="animate-spin mr-2 inline" /> Saving...</> : 'Save Changes'}
            </button>
          </>
        }
      >
        <form id="edit-subproject-form" onSubmit={handleUpdate}>
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

      {/* Child Project Modal */}
      <Modal
        isOpen={isChildModalOpen}
        onClose={() => setIsChildModalOpen(false)}
        title="New Child Project"
        footer={
          <>
            <button type="button" className="btn btn-ghost" onClick={() => setIsChildModalOpen(false)}>Cancel</button>
            <button type="submit" form="new-child-form" className="btn btn-primary" disabled={createChildProject.isPending}>
              {createChildProject.isPending ? <><Loader2 size={16} className="animate-spin mr-2 inline" /> Saving...</> : 'Save'}
            </button>
          </>
        }
      >
        <form id="new-child-form" onSubmit={handleCreateChild}>
          <div className="form-group">
            <label className="form-label">Title</label>
            <input autoFocus type="text" className="form-input" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} required />
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
          <EmptyState icon={<PackageOpen />} title="No allocations found" message="No inventory has been allocated to this sub-project yet." />
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
        message="This will mark all allocated items as used and set this sub-project to COMPLETED. This action cannot be undone."
        isPending={markUsed.isPending}
      />
      
      {/* Materials Modal */}
      <Modal
        isOpen={isMaterialsModalOpen}
        onClose={() => setIsMaterialsModalOpen(false)}
        title="Sub-project Materialsww"
        size="lg"
        footer={<button className="btn btn-ghost" onClick={() => setIsMaterialsModalOpen(false)}>Close</button>}
      >
        

        {(manualAllocations?.length || 0) === 0 ? (
          <EmptyState icon={<PackageOpen />} title="No materials" message="Record materials used for this sub-project or its children." />
        ) : (
          <div className="table-container" style={{ maxHeight: '60vh', overflow: 'auto' }}>
            <table>
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Total Quantity</th>
                  <th>Breakdown</th>
                </tr>
              </thead>
              <tbody>
                {manualAllocations.map((item: any, idx: number) => (
                  <tr key={idx}>
                    <td style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{item.itemName}</td>
                    <td>{item.totalQuantity} {item.unit}</td>
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                        {item.breakdown.map((b: any, bIdx: number) => (
                          <div key={bIdx} style={{ fontSize: '0.85rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.05)', padding: '0.25rem 0.5rem', borderRadius: '4px' }}>
                            <span>
                              <span style={{ color: 'var(--text-secondary)', marginRight: '0.5rem' }}>[{b.targetType === 'SUB_PROJECT' ? 'Direct' : 'Child'}]</span>
                              {b.targetTitle}
                              {b.notes && <span style={{ color: 'var(--text-secondary)', marginLeft: '0.5rem', fontStyle: 'italic' }}>({b.notes})</span>}
                            </span>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <span style={{ fontWeight: 600 }}>{b.quantity} {item.unit}</span>
                              <button className="btn btn-ghost btn-sm" style={{ padding: '0.2rem', height: 'auto', minHeight: 'auto', color: 'var(--accent)' }} onClick={() => {
                                setEditingManualItem({ id: b.id, itemName: item.itemName, unit: item.unit, quantity: b.quantity, targetType: b.targetType, targetId: b.targetId, notes: b.notes });
                                setIsManualModalOpen(true);
                              }}>
                                <Edit2 size={12} />
                              </button>
                              <button className="btn btn-ghost btn-sm" style={{ padding: '0.2rem', height: 'auto', minHeight: 'auto', color: 'var(--danger)' }} onClick={async () => {
                                if (confirm('Delete this item?')) {
                                  await deleteManualAlloc.mutateAsync(b.id);
                                  toast.success('Deleted');
                                  refetchAllocations();
                                }
                              }}>
                                <Trash2 size={12} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Modal>

      <ManualAllocationModal
        isOpen={isManualModalOpen}
        onClose={() => setIsManualModalOpen(false)}
        targetType="SUB_PROJECT"
        targetId={id!}
        targetOptions={manualTargetOptions}
        editItem={editingManualItem}
      />

      <ConfirmDialog
        isOpen={!!deletingChildId}
        onClose={() => setDeletingChildId(null)}
        onConfirm={handleDeleteChild}
        title="Delete Child Project"
        message="Are you sure you want to delete this child project? This action cannot be undone."
        isPending={deleteChildProject.isPending}
      />
    </div>
  )
}
