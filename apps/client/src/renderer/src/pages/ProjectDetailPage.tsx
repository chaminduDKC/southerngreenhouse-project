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
  useProject,
  useUpdateProject,
  useMarkProjectUsed,
  useProjectAllocations,
  useCreateSubProject,
  useDeleteSubProject,
  useAggregatedManualAllocations,
  useDeleteManualAllocation,
  useF1Shortcut
} from '../hooks'

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const { data: project, isLoading } = useProject(id!)
  const { data: allocations, isLoading: allocLoading } = useProjectAllocations(id!, 'projects')

  const updateProject = useUpdateProject()
  const markUsed = useMarkProjectUsed()
  const createSubProject = useCreateSubProject()
  const deleteSubProject = useDeleteSubProject()

  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isAllocModalOpen, setIsAllocModalOpen] = useState(false)
  const [isMaterialsModalOpen, setIsMaterialsModalOpen] = useState(false)
  const [isSubModalOpen, setIsSubModalOpen] = useState(false)

  const [isMarkUsedConfirmOpen, setIsMarkUsedConfirmOpen] = useState(false)
  const [deletingSubId, setDeletingSubId] = useState<string | null>(null)

  const [formData, setFormData] = useState<any>({})

  useF1Shortcut(() => {
    setFormData({ title: '', location: '', value: 0, notes: '' })
    setIsSubModalOpen(true)
  })

  const { data: manualAllocations } = useAggregatedManualAllocations('PROJECT', id!)
  const deleteManualAlloc = useDeleteManualAllocation()
  const [isManualModalOpen, setIsManualModalOpen] = useState(false)
  const [editingManualItem, setEditingManualItem] = useState<any>(null)

  const manualTargetOptions = [
    { id: id!, title: project?.title || 'Main Project', targetType: 'PROJECT' as const }
  ];
  if (project?.subProjects) {
    project.subProjects.forEach(sub => {
      manualTargetOptions.push({ id: sub.id, title: sub.title, targetType: 'SUB_PROJECT' as const })
      if (sub.children) {
        sub.children.forEach(child => {
          manualTargetOptions.push({ id: child.id, title: child.title, targetType: 'CHILD_PROJECT' as const })
        })
      }
    })
  }

  if (isLoading) {
    return (
      <div className="page-container">
        <LoadingSkeleton rows={6} />
      </div>
    )
  }

  if (!project) {
    return (
      <div className="page-container">
        <EmptyState icon={<PackageOpen />} title="Project not found" message="This project may have been deleted or the link is incorrect." />
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
      await updateProject.mutateAsync({ id: id!, data: formData })
      toast.success('Project updated')
      setIsEditModalOpen(false)
    } catch (err: any) {
      toast.error(err.message || 'Error updating project')
    }
  }

  const handleCreateSub = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await createSubProject.mutateAsync({ ...formData, projectId: id! })
      toast.success('Sub-project created')
      setIsSubModalOpen(false)
    } catch (err: any) {
      toast.error(err.message || 'Error creating sub-project')
    }
  }

  const handleMarkUsed = async () => {
    try {
      await markUsed.mutateAsync({ id: id!, targetType: 'projects' })
      toast.success('Marked as used')
      setIsMarkUsedConfirmOpen(false)
    } catch (err: any) {
      toast.error(err.message || 'Error')
    }
  }

  const handleDeleteSub = async () => {
    if (!deletingSubId) return
    try {
      await deleteSubProject.mutateAsync(deletingSubId)
      toast.success('Deleted sub-project')
      setDeletingSubId(null)
    } catch (err: any) {
      toast.error(err.message || 'Error')
    }
  }

  const margin = (project.value || 0) - (project.cost || 0)

  return (
    <div className="page-container">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
        <button className="btn btn-ghost btn-sm" onClick={() => navigate('/projects')}>
          <ArrowLeft size={16} /> Back
        </button>
        <span>/</span>
        <span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{project.title}</span>
      </div>

      <div className="glass-card" style={{ marginBottom: '2rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, right: 0, padding: '1.5rem', opacity: 0.06, pointerEvents: 'none', color: 'var(--primary)' }}>
          <PackageOpen size={120} />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', position: 'relative', zIndex: 1 }}>
          <div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 700, color: '#fff', marginBottom: '0.5rem' }}>{project.title}</h1>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              <span className={`badge ${getStatusBadgeClass(project.status)}`}>{project.status}</span>
              <span>Client: <span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{project.client?.name}</span></span>
              <span>Location: <span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{project.location}</span></span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button className="btn btn-secondary" onClick={() => setIsAllocModalOpen(true)}>
              <PackageOpen size={16} /> View Allocations
            </button>
            <button className="btn btn-secondary" onClick={() => setIsMaterialsModalOpen(true)}>
              <PackageOpen size={16} /> View Materials
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
            {project.status !== ProjectStatus.COMPLETED && (
              <button className="btn btn-secondary" style={{ color: 'var(--accent)', borderColor: 'rgba(99,102,241,0.3)' }} onClick={() => setIsMarkUsedConfirmOpen(true)}>
                <CheckCircle size={16} /> Mark All Used
              </button>
            )}
            <button
              className="btn btn-secondary"
              onClick={() => {
                setFormData({ title: project.title, location: project.location, value: project.value, notes: project.notes, status: project.status })
                setIsEditModalOpen(true)
              }}
            >
              <Edit2 size={16} /> Edit
            </button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(160px, 1fr))', gap: '1rem', marginBottom: '1rem', position: 'relative', zIndex: 1 }}>
          <div className="stat-card glass-card">
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>Total Value</div>
            <div style={{ fontSize: '1.3rem', fontWeight: 600, color: 'var(--success)' }}>LKR {formatCurrency(project.value)}</div>
          </div>
          <div className="stat-card stat-danger glass-card">
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>Total Cost</div>
            <div style={{ fontSize: '1.3rem', fontWeight: 600, color: 'var(--danger)' }}>LKR {formatCurrency(project.cost)}</div>
          </div>
          <div className="stat-card stat-accent glass-card">
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>Profit / Margin</div>
            <div style={{ fontSize: '1.3rem', fontWeight: 600, color: 'var(--accent)' }}>LKR {formatCurrency(margin)}</div>
          </div>
          <div className="stat-card glass-card">
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>Sub-projects</div>
            <div style={{ fontSize: '1.3rem', fontWeight: 600, color: 'var(--text-primary)' }}>{project.subProjects?.length || 0}</div>
          </div>
        </div>

        {project.notes && (
          <div style={{ background: 'rgba(0,0,0,0.15)', border: '1px solid var(--border)', padding: '1rem', borderRadius: 'var(--radius-sm)', fontSize: '0.9rem', color: 'var(--text-secondary)', position: 'relative', zIndex: 1 }}>
            <span style={{ display: 'block', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>Notes:</span>
            {project.notes}
          </div>
        )}
      </div>


      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#fff' }}>Sub-projects</h2>
        <button
          className="btn btn-primary btn-sm"
          onClick={() => {
            setFormData({ title: '', location: '', value: 0, notes: '' })
            setIsSubModalOpen(true)
          }}
        >
          <Plus size={16} /> Add Sub-project
        </button>
      </div>

      {(project.subProjects?.length || 0) === 0 ? (
        <EmptyState icon={<PackageOpen />} title="No sub-projects found" message="Add a sub-project to start breaking this project down." />
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Location</th>
                <th>Status</th>
                <th>Children</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {project.subProjects.map(sub => (
                <tr key={sub.id} style={{ cursor: 'pointer' }} onClick={() => navigate(`/subprojects/${sub.id}`)}>
                  <td style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{sub.title}</td>
                  <td>{sub.location}</td>
                  <td><span className={`badge ${getStatusBadgeClass(sub.status)}`}>{sub.status}</span></td>
                  <td>{sub.children?.length || 0}</td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }} onClick={e => e.stopPropagation()}>
                      <button className="btn btn-ghost btn-sm" style={{ color: 'var(--accent)' }} onClick={() => navigate(`/subprojects/${sub.id}`)}>
                        View
                      </button>
                      <button className="btn btn-ghost btn-sm" style={{ color: 'var(--danger)' }} onClick={() => setDeletingSubId(sub.id)}>
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

      {/* Edit Project Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Project"
        footer={
          <>
            <button type="button" className="btn btn-ghost" onClick={() => setIsEditModalOpen(false)}>Cancel</button>
            <button type="submit" form="edit-project-form" className="btn btn-primary" disabled={updateProject.isPending}>
              {updateProject.isPending ? <><Loader2 size={16} className="animate-spin mr-2 inline" /> Saving...</> : 'Save Changes'}
            </button>
          </>
        }
      >
        <form id="edit-project-form" onSubmit={handleUpdate}>
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

      {/* Sub Project Modal */}
      <Modal
        isOpen={isSubModalOpen}
        onClose={() => setIsSubModalOpen(false)}
        title="New Sub-project"
        footer={
          <>
            <button type="button" className="btn btn-ghost" onClick={() => setIsSubModalOpen(false)}>Cancel</button>
            <button type="submit" form="new-subproject-form" className="btn btn-primary" disabled={createSubProject.isPending}>
              {createSubProject.isPending ? <><Loader2 size={16} className="animate-spin mr-2 inline" /> Saving...</> : 'Save'}
            </button>
          </>
        }
      >
        <form id="new-subproject-form" onSubmit={handleCreateSub}>
          <div className="form-group">
            <label className="form-label">Title</label>
            <input type="text" className="form-input" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} required />
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
        title="Project Allocations"
        footer={<button className="btn btn-ghost" onClick={() => setIsAllocModalOpen(false)}>Close</button>}
      >
        {allocLoading ? (
          <LoadingSkeleton rows={4} />
        ) : (allocations?.length || 0) === 0 ? (
          <EmptyState icon={<PackageOpen />} title="No allocations found" message="No inventory has been allocated to this project yet." />
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
        message="This will mark all allocated items as used and set the project to COMPLETED. This action cannot be undone."
        isPending={markUsed.isPending}
      />

      <ConfirmDialog
        isOpen={!!deletingSubId}
        onClose={() => setDeletingSubId(null)}
        onConfirm={handleDeleteSub}
        title="Delete Sub-project"
        message="Are you sure you want to delete this sub-project? This action cannot be undone."
        isPending={deleteSubProject.isPending}
      />
      
      {/* Materials Modal */}
      <Modal
        isOpen={isMaterialsModalOpen}
        onClose={() => setIsMaterialsModalOpen(false)}
        title="Project Materials"
        size="lg"
        footer={<button className="btn btn-ghost" onClick={() => setIsMaterialsModalOpen(false)}>Close</button>}
      >
       

        {(manualAllocations?.length || 0) === 0 ? (
          <EmptyState icon={<PackageOpen />} title="No materials" message="Record materials used for this project or its sub-projects." />
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
                              <span style={{ color: 'var(--text-secondary)', marginRight: '0.5rem' }}>[{b.targetType.replace('_', ' ')}]</span>
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
        targetType="PROJECT"
        targetId={id!}
        targetOptions={manualTargetOptions}
        editItem={editingManualItem}
      />
    </div>
  )
}
