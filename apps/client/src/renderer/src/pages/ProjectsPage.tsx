// @ts-nocheck
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Edit2, Trash2, ChevronDown, ChevronRight, Folder, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { ProjectStatus } from '@sg/types'
import { PageHeader } from '../components/PageHeader'
import { LoadingSkeleton } from '../components/LoadingSkeleton'
import { EmptyState } from '../components/EmptyState'
import { Modal } from '../components/Modal'
import { ConfirmDialog } from '../components/ConfirmDialog'
import {
  useProjects,
  useCreateProject,
  useUpdateProject,
  useDeleteProject,
  useCreateSubProject,
  useUpdateSubProject,
  useDeleteSubProject,
  useCreateChildProject,
  useUpdateChildProject,
  useDeleteChildProject,
  useClients,
  useF1Shortcut
} from '../hooks'

const STATUS_FILTERS = ['ALL', ProjectStatus.ACTIVE, ProjectStatus.IN_PROGRESS, ProjectStatus.COMPLETED, ProjectStatus.ON_HOLD]

const statusBadge = (status: ProjectStatus) => {
  switch (status) {
    case ProjectStatus.ACTIVE: return 'badge badge-active'
    case ProjectStatus.IN_PROGRESS: return 'badge badge-in-progress'
    case ProjectStatus.COMPLETED: return 'badge badge-completed'
    case ProjectStatus.ON_HOLD: return 'badge badge-on-hold'
    default: return 'badge'
  }
}

const fmt = (val: number) => val?.toLocaleString?.('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) ?? '0.00'

// ── Reusable value / cost / profit display ──────────────────────────
// Fixes a bug in the old code where profit was computed by subtracting
// two already-formatted strings (e.g. "1,000.00" - "500.00" = NaN once
// commas appear). Profit here is always derived from the raw numbers.
type StatSize = 'md' | 'sm' | 'xs'

const SIZES: Record<StatSize, { gap: string; label: string; num: string; profitNum: string; pad: string }> = {
  md: { gap: '1.5rem',  label: '0.68rem', num: '0.95rem', profitNum: '1.05rem', pad: '0.4rem 0.85rem' },
  sm: { gap: '1.25rem', label: '0.65rem', num: '0.85rem', profitNum: '0.95rem', pad: '0.3rem 0.7rem' },
  xs: { gap: '1rem',    label: '0.6rem',  num: '0.78rem', profitNum: '0.85rem', pad: '0.25rem 0.55rem' },
}

function FinancialStat({ value = 0, cost = 0, size = 'md' as StatSize }) {
  const profit = (Number(value) || 0) - (Number(cost) || 0)
  const margin = value ? (profit / value) * 100 : 0
  const isProfit = profit >= 0
  const s = SIZES[size]

  const labelStyle = { fontSize: s.label, color: 'var(--text-muted)', textTransform: 'uppercase' as const, letterSpacing: '0.04em' }

  return (
    <div style={{ display: 'flex', alignItems: 'stretch', gap: s.gap }} onClick={e => e.stopPropagation()}>
      <div style={{ textAlign: 'right' }}>
        <div style={labelStyle}>Value</div>
        <div style={{ fontSize: s.num, fontWeight: 600, color: 'var(--text-primary)' }}>LKR {fmt(value)}</div>
      </div>
      <div style={{ textAlign: 'right' }}>
        <div style={labelStyle}>Cost</div>
        <div style={{ fontSize: s.num, fontWeight: 600, color: 'var(--text-secondary)' }}>LKR {fmt(cost)}</div>
      </div>
      <div style={{
        textAlign: 'right', padding: s.pad, borderRadius: 'var(--radius-sm)',
        background: isProfit ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
        border: `1px solid ${isProfit ? 'rgba(34,197,94,0.25)' : 'rgba(239,68,68,0.25)'}`
      }}>
        <div style={labelStyle}>Profit</div>
        <div style={{ fontSize: s.profitNum, fontWeight: 700, color: isProfit ? 'var(--success)' : 'var(--danger)', whiteSpace: 'nowrap' }}>
          {isProfit ? '+' : '−'}LKR {fmt(Math.abs(profit))}
          <span style={{ fontSize: s.label, fontWeight: 500, opacity: 0.75, marginLeft: '0.35rem' }}>
            ({margin.toFixed(1)}%)
          </span>
        </div>
      </div>
    </div>
  )
}

export default function ProjectsPage() {
  const navigate = useNavigate()
  const { data: projects, isLoading } = useProjects()
  const { data: clients } = useClients()

  const createProject    = useCreateProject()
  const updateProject    = useUpdateProject()
  const deleteProject    = useDeleteProject()
  const createSubProject = useCreateSubProject()
  const updateSubProject = useUpdateSubProject()
  const deleteSubProject = useDeleteSubProject()
  const createChildProject = useCreateChildProject()
  const updateChildProject = useUpdateChildProject()
  const deleteChildProject = useDeleteChildProject()

  const [statusFilter, setStatusFilter] = useState<ProjectStatus | 'ALL'>('ALL')
  const [expandedProjects, setExpandedProjects] = useState<Record<string, boolean>>({})
  const [expandedSubs,     setExpandedSubs]     = useState<Record<string, boolean>>({})

  // Modals
  const [projectModal,    setProjectModal]    = useState(false)
  const [subModal,        setSubModal]        = useState(false)
  const [childModal,      setChildModal]      = useState(false)
  const [selectedParent,  setSelectedParent]  = useState('')
  const [selectedSubId,   setSelectedSubId]   = useState('')
  const [editData,        setEditData]        = useState<any>(null)
  const [editSubData,     setEditSubData]     = useState<any>(null)
  const [editChildData,   setEditChildData]   = useState<any>(null)

  const [confirmOpen, setConfirmOpen] = useState(false)
  const [deletingId,  setDeletingId]  = useState<string | null>(null)
  const [deletingType, setDeletingType] = useState<'PROJECT' | 'SUB' | 'CHILD'>('PROJECT')

  const blank = { clientId: '', title: '', location: '', notes: '', value: 0 }
  const [form, setForm] = useState(blank)
  const set = (k: string, v: any) => setForm(prev => ({ ...prev, [k]: v }))

  useF1Shortcut(() => {
    setEditData(null)
    setForm(blank)
    setProjectModal(true)
  })

  const toggleProject = (id: string) => setExpandedProjects(p => ({ ...p, [id]: !p[id] }))
  const toggleSub     = (id: string) => setExpandedSubs(p => ({ ...p, [id]: !p[id] }))

  const [divisionConfirmOpen, setDivisionConfirmOpen] = useState(false)
  const [pendingUpdate, setPendingUpdate] = useState<any>(null)

  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editData) {
        if (editData.subProjects && editData.subProjects.length > 0 && Number(form.value) !== Number(editData.value)) {
          setPendingUpdate({ id: editData.id, data: form })
          setDivisionConfirmOpen(true)
          return
        }
        await updateProject.mutateAsync({ id: editData.id, data: form })
        toast.success('Project updated')
      } else {
        await createProject.mutateAsync(form as any)
        toast.success('Project created')
      }
      setProjectModal(false); setEditData(null); setForm(blank)
    } catch (err: any) { toast.error(err.response?.data?.error || err.message || 'Error') }
  }

  const handleDivisionConfirm = async (method: 'EQUAL' | 'PROPORTIONAL') => {
    try {
      await updateProject.mutateAsync({ id: pendingUpdate.id, data: { ...pendingUpdate.data, divisionMethod: method } })
      toast.success('Project updated with division')
      setDivisionConfirmOpen(false); setPendingUpdate(null)
      setProjectModal(false); setEditData(null); setForm(blank)
    } catch (err: any) { toast.error(err.response?.data?.error || err.message || 'Error') }
  }

  const handleSaveSub = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editSubData) {
        await updateSubProject.mutateAsync({ id: editSubData.id, data: form })
        toast.success('Sub-project updated')
      } else {
        await createSubProject.mutateAsync({ projectId: selectedParent, ...form } as any)
        toast.success('Sub-project created')
        setExpandedProjects(p => ({ ...p, [selectedParent]: true }))
      }
      setSubModal(false); setEditSubData(null); setForm(blank)
    } catch (err: any) { toast.error(err.response?.data?.error || err.message || 'Error') }
  }

  const handleSaveChild = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editChildData) {
        await updateChildProject.mutateAsync({ id: editChildData.id, data: form })
        toast.success('Child project updated')
      } else {
        await createChildProject.mutateAsync({ subProjectId: selectedSubId, ...form } as any)
        toast.success('Child project created')
        setExpandedSubs(p => ({ ...p, [selectedSubId]: true }))
      }
      setChildModal(false); setEditChildData(null); setForm(blank)
    } catch (err: any) { toast.error(err.response?.data?.error || err.message || 'Error') }
  }

  const handleDelete = async () => {
    if (!deletingId) return
    try {
      if (deletingType === 'PROJECT') {
        await deleteProject.mutateAsync(deletingId)
        toast.success('Project deleted')
      } else if (deletingType === 'SUB') {
        await deleteSubProject.mutateAsync(deletingId)
        toast.success('Sub-project deleted')
      } else if (deletingType === 'CHILD') {
        await deleteChildProject.mutateAsync(deletingId)
        toast.success('Child project deleted')
      }
      setConfirmOpen(false)
      setDeletingId(null)
    } catch (err: any) { toast.error(err.message || 'Failed') }
  }

  const filtered = projects?.filter(p => statusFilter === 'ALL' || p.status === statusFilter) || []

  return (
    <div className="page-container">
      <PageHeader
        title="Projects"
        action={
          <button className="btn btn-primary" onClick={() => { setEditData(null); setForm(blank); setProjectModal(true) }}>
            <Plus size={18} /> New Project
          </button>
        }
      />

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {STATUS_FILTERS.map(s => (
          <button
            key={s}
            onClick={() => setStatusFilter(s as any)}
            style={{
              padding: '0.4rem 1rem', borderRadius: '9999px', fontSize: '0.8rem', fontWeight: 600,
              border: '1px solid', cursor: 'pointer', transition: 'all 0.2s',
              borderColor: statusFilter === s ? 'var(--primary)' : 'var(--border)',
              background: statusFilter === s ? 'var(--primary-glow)' : 'var(--surface-2)',
              color: statusFilter === s ? 'var(--primary)' : 'var(--text-secondary)',
            }}
          >{String(s).replace('_', ' ')}</button>
        ))}
      </div>

      {isLoading ? <LoadingSkeleton rows={4} /> : filtered.length === 0 ? (
        <EmptyState icon={<Folder />} title="No projects found" message="Create one to get started." />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {filtered.map(project => (
            <div key={project.id} className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>

              {/* ── Project row ─── */}
              <div style={{ padding: '0.9rem 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1, minWidth: 0 }}>
                  <button
                    className="btn btn-ghost btn-sm"
                    style={{ padding: '0.3rem', flexShrink: 0 }}
                    onClick={() => toggleProject(project.id)}
                    title={expandedProjects[project.id] ? 'Collapse' : 'Expand sub-projects'}
                  >
                    {expandedProjects[project.id] ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                  </button>
                  <div
                    style={{ flex: 1, minWidth: 0, cursor: 'pointer' }}
                    onClick={() => navigate(`/projects/${project.id}`)}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                      <Folder size={16} color="var(--accent)" />
                      <span style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '1rem' }}>{project.title}</span>
                      <span className={statusBadge(project.status)}>{project.status.replace('_', ' ')}</span>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.2rem', display: 'flex', gap: '1rem' }}>
                      <span>{project.client?.name}</span>
                      <span>{project.location}</span>
                      <span style={{ color: 'var(--text-muted)' }}>{project.subProjects?.length || 0} sub-projects</span>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexShrink: 0 }}>
                  <FinancialStat value={project.value} cost={project.cost} size="md" />
                  <div style={{ display: 'flex', gap: '0.4rem' }}>
                    <button
                      disabled={project.status === "COMPLETED"}
                      className="btn btn-secondary btn-sm"
                      onClick={() => { setSelectedParent(project.id); setForm(blank); setSubModal(true) }}
                      title="Add sub-project"
                    >+ Sub</button>
                    <button className="btn btn-ghost btn-sm" title="Edit" onClick={() => {
                      setEditData(project)
                      setForm({ clientId: project.clientId, title: project.title, location: project.location, notes: project.notes, value: Number(project.value) })
                      setProjectModal(true)
                    }}><Edit2 size={14} /></button>
                    <button className="btn btn-ghost btn-sm" style={{ color: 'var(--danger)' }} title="Delete" onClick={() => {
                      setDeletingId(project.id)
                      setDeletingType('PROJECT')
                      setConfirmOpen(true)
                    }}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>

              {/* ── Sub-projects ─── */}
              {expandedProjects[project.id] && (
                <div style={{ background: 'rgba(0,0,0,0.12)', borderTop: '1px solid var(--border)', padding: '0.75rem 1.25rem 0.75rem 3rem' }}>
                  {(!project.subProjects || project.subProjects.length === 0) ? (
                    <div style={{ padding: '0.75rem', color: 'var(--text-muted)', fontSize: '0.85rem', textAlign: 'center' }}>
                      No sub-projects yet. &nbsp;
                      <button disabled={project.status === "COMPLETED"} className="btn btn-secondary btn-sm" onClick={() => { setSelectedParent(project.id); setForm(blank); setSubModal(true) }}>
                        + Add Sub-project
                      </button>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', borderLeft: '2px solid var(--accent)', paddingLeft: '1rem' }}>
                      {project.subProjects.map(sub => (
                        <div key={sub.id}>
                          <div style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.6rem',
                            background: 'var(--surface)', border: '1px solid var(--border)',
                            padding: '0.8rem 1rem', borderRadius: 'var(--radius-sm)'
                          }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flex: 1, minWidth: 0, cursor: 'pointer' }} onClick={() => navigate(`/subprojects/${sub.id}`)}>
                              <button
                                className="btn btn-ghost btn-sm"
                                style={{ padding: '0.2rem', flexShrink: 0 }}
                                onClick={e => { e.stopPropagation(); toggleSub(sub.id) }}
                                title={expandedSubs[sub.id] ? 'Collapse children' : 'Expand children'}
                              >
                                {expandedSubs[sub.id] ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                              </button>
                              <span className={statusBadge(sub.status)} style={{ fontSize: '0.7rem' }}>{sub.status.replace('_', ' ')}</span>
                              <span style={{ fontWeight: 500, color: 'var(--text-primary)', fontSize: '0.9rem' }}>{sub.title}</span>
                              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{sub.location}</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
                              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                {sub.children?.length || 0} child{(sub.children?.length || 0) !== 1 ? 'ren' : ''}
                              </span>
                              <FinancialStat value={sub.value} cost={sub.cost} size="sm" />
                              <button
                                disabled={project.status === "COMPLETED"}
                                className="btn btn-secondary btn-sm"
                                style={{ fontSize: '0.75rem', padding: '0.25rem 0.6rem' }}
                                onClick={e => { e.stopPropagation(); setSelectedSubId(sub.id); setForm(blank); setChildModal(true) }}
                                title="Add child project"
                              >+ Child</button>
                              <button className="btn btn-ghost btn-sm" title="Edit" onClick={e => {
                                e.stopPropagation();
                                setEditSubData(sub);
                                setForm({ title: sub.title, location: sub.location, notes: sub.notes, value: Number(sub.value) });
                                setSubModal(true);
                              }}><Edit2 size={14} /></button>
                              <button className="btn btn-ghost btn-sm" style={{ color: 'var(--danger)' }} title="Delete" onClick={e => {
                                e.stopPropagation();
                                setDeletingId(sub.id);
                                setDeletingType('SUB');
                                setConfirmOpen(true);
                              }}>
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>

                          {/* ── Child projects ─── */}
                          {expandedSubs[sub.id] && (
                            <div style={{
                              display: 'flex', flexDirection: 'column', gap: '0.35rem',
                              marginLeft: '1.5rem', marginTop: '0.4rem',
                              borderLeft: '2px solid var(--primary)', paddingLeft: '1rem'
                            }}>
                              {(!sub.children || sub.children.length === 0) ? (
                                <div style={{ padding: '0.5rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                                  No child projects. &nbsp;
                                  <button disabled={project.status === "COMPLETED"} className="btn btn-secondary btn-sm" style={{ fontSize: '0.75rem' }}
                                    onClick={() => { setSelectedSubId(sub.id); setForm(blank); setChildModal(true) }}>
                                    + Add Child
                                  </button>
                                </div>
                              ) : sub.children.map(child => (
                                <div
                                  key={child.id}
                                  style={{
                                    display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem',
                                    background: 'rgba(0,0,0,0.15)', border: '1px solid var(--border)',
                                    padding: '0.8rem 1.1rem', borderRadius: 'var(--radius-sm)', cursor: 'pointer'
                                  }}
                                  onClick={() => navigate(`/childprojects/${child.id}`)}
                                >
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                                    <span className={statusBadge(child.status)} style={{ fontSize: '0.7rem' }}>{child.status.replace('_', ' ')}</span>
                                    <span style={{ fontWeight: 500, fontSize: '0.9rem', color: 'var(--text-primary)' }}>{child.title}</span>
                                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{child.location}</span>
                                  </div>
                                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                                    <FinancialStat value={child.value} cost={child.cost} size="xs" />
                                    <button className="btn btn-ghost btn-sm" style={{ padding: '0.4rem 0.5rem' }} title="Edit" onClick={e => {
                                      e.stopPropagation();
                                      setEditChildData(child);
                                      setForm({ title: child.title, location: child.location, notes: child.notes, value: Number(child.value) });
                                      setChildModal(true);
                                    }}><Edit2 size={12} /></button>
                                    <button className="btn btn-ghost btn-sm" style={{ padding: '0.4rem 0.5rem', color: 'var(--danger)' }} title="Delete" onClick={e => {
                                      e.stopPropagation();
                                      setDeletingId(child.id);
                                      setDeletingType('CHILD');
                                      setConfirmOpen(true);
                                    }}>
                                      <Trash2 size={12} />
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ── Project Modal ─────────────────────────────────────────── */}
      <Modal
        isOpen={projectModal}
        onClose={() => { setProjectModal(false); setEditData(null) }}
        title={editData ? 'Edit Project' : 'New Project'}
        size="md"
        footer={<>
          <button className="btn btn-ghost" onClick={() => { setProjectModal(false); setEditData(null) }}>Cancel</button>
          <button className="btn btn-primary" form="project-form" type="submit" disabled={createProject.isPending || updateProject.isPending}>
            {createProject.isPending || updateProject.isPending ? <><Loader2 size={16} className="animate-spin mr-2 inline" /> Saving…</> : 'Save'}
          </button>
        </>}
      >
        <form id="project-form" onSubmit={handleSaveProject}>
          <div className="form-group">
            <label className="form-label">Client</label>
            <select autoFocus className="form-select" value={form.clientId} onChange={e => set('clientId', e.target.value)} required={!editData}>
              <option value="">Select client…</option>
              {clients?.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Title</label>
              <input className="form-input" value={form.title} onChange={e => set('title', e.target.value)} required />
            </div>
            <div className="form-group">
              <label className="form-label">Location</label>
              <input className="form-input" value={form.location} onChange={e => set('location', e.target.value)} required />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Value (LKR)</label>
            <input type="number" min="0" step="0.01" className="form-input" value={form.value} onChange={e => set('value', parseFloat(e.target.value) || 0)} required />
          </div>
          <div className="form-group">
            <label className="form-label">Notes</label>
            <textarea className="form-textarea" value={form.notes} onChange={e => set('notes', e.target.value)} rows={2} />
          </div>
        </form>
      </Modal>

      {/* ── Sub-project Modal ──────────────────────────────────────── */}
      <Modal
        isOpen={subModal}
        onClose={() => { setSubModal(false); setEditSubData(null); }}
        title={editSubData ? "Edit Sub-project" : "New Sub-project"}
        size="md"
        footer={<>
          <button className="btn btn-ghost" onClick={() => { setSubModal(false); setEditSubData(null); }}>Cancel</button>
          <button className="btn btn-primary" form="sub-form" type="submit" disabled={createSubProject.isPending || updateSubProject.isPending}>
            {createSubProject.isPending || updateSubProject.isPending ? <><Loader2 size={16} className="animate-spin mr-2 inline" /> Saving…</> : 'Save'}
          </button>
        </>}
      >
        <form id="sub-form" onSubmit={handleSaveSub}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Title</label>
              <input autoFocus className="form-input" value={form.title} onChange={e => set('title', e.target.value)} required />
            </div>
            <div className="form-group">
              <label className="form-label">Location</label>
              <input className="form-input" value={form.location} onChange={e => set('location', e.target.value)} required />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Value (LKR)</label>
            <input type="number" min="0" step="0.01" className="form-input" value={form.value} onChange={e => set('value', parseFloat(e.target.value) || 0)} required />
          </div>
          <div className="form-group">
            <label className="form-label">Notes</label>
            <textarea className="form-textarea" value={form.notes} onChange={e => set('notes', e.target.value)} rows={2} />
          </div>
        </form>
      </Modal>

      {/* ── Child-project Modal ────────────────────────────────────── */}
      <Modal
        isOpen={childModal}
        onClose={() => { setChildModal(false); setEditChildData(null); }}
        title={editChildData ? "Edit Child Project" : "New Child Project"}
        size="md"
        footer={<>
          <button className="btn btn-ghost" onClick={() => { setChildModal(false); setEditChildData(null); }}>Cancel</button>
          <button className="btn btn-primary" form="child-form" type="submit" disabled={createChildProject.isPending || updateChildProject.isPending}>
            {createChildProject.isPending || updateChildProject.isPending ? <><Loader2 size={16} className="animate-spin mr-2 inline" /> Saving…</> : 'Save'}
          </button>
        </>}
      >
        <form id="child-form" onSubmit={handleSaveChild}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Title</label>
              <input autoFocus className="form-input" value={form.title} onChange={e => set('title', e.target.value)} required />
            </div>
            <div className="form-group">
              <label className="form-label">Location</label>
              <input className="form-input" value={form.location} onChange={e => set('location', e.target.value)} required />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Value (LKR)</label>
            <input type="number" min="0" step="0.01" className="form-input" value={form.value} onChange={e => set('value', parseFloat(e.target.value) || 0)} required />
          </div>
          <div className="form-group">
            <label className="form-label">Notes</label>
            <textarea className="form-textarea" value={form.notes} onChange={e => set('notes', e.target.value)} rows={2} />
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleDelete}
        title={deletingType === 'PROJECT' ? 'Delete Main Project' : deletingType === 'SUB' ? 'Delete Sub-project' : 'Delete Child Project'}
        message={
          deletingType === 'PROJECT' 
            ? 'Are you sure you want to delete this project? This will permanently delete the project along with all its sub-projects, child projects, linked invoices, quotations, material allocations, and ledger records.'
            : deletingType === 'SUB'
            ? 'Are you sure you want to delete this sub-project? This will permanently delete the sub-project along with all its child projects, material allocations, and ledger records.'
            : 'Are you sure you want to delete this child project? This will permanently delete the child project along with all its material allocations and ledger records.'
        }
        isPending={deleteProject.isPending || deleteSubProject.isPending || deleteChildProject.isPending}
      />

      <Modal
        isOpen={divisionConfirmOpen}
        onClose={() => setDivisionConfirmOpen(false)}
        title="Divide Project Value"
        size="md"
        footer={<button className="btn btn-ghost" onClick={() => setDivisionConfirmOpen(false)}>Cancel</button>}
      >
        <div style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: 1.5 }}>
          You have changed the main project's value. How would you like this new value to be distributed among its existing sub-projects and child projects?
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <button
            className="btn btn-primary"
            style={{ padding: '1rem', height: 'auto', justifyContent: 'flex-start', textAlign: 'left' }}
            onClick={() => handleDivisionConfirm('EQUAL')}
            disabled={updateProject.isPending}
          >
            <div>
              <div style={{ fontWeight: 600, fontSize: '1rem', marginBottom: '0.25rem' }}>Divide Equally</div>
              <div style={{ fontWeight: 400, fontSize: '0.8rem', opacity: 0.8 }}>The new value will be split evenly across all sub-projects.</div>
            </div>
          </button>
          <button
            className="btn btn-secondary"
            style={{ padding: '1rem', height: 'auto', justifyContent: 'flex-start', textAlign: 'left' }}
            onClick={() => handleDivisionConfirm('PROPORTIONAL')}
            disabled={updateProject.isPending}
          >
            <div>
              <div style={{ fontWeight: 600, fontSize: '1rem', marginBottom: '0.25rem' }}>Divide Proportionally</div>
              <div style={{ fontWeight: 400, fontSize: '0.8rem', opacity: 0.8 }}>The new value will be distributed based on the current ratio of each sub-project's value.</div>
            </div>
          </button>
        </div>
      </Modal>
    </div>
  )
}