import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { PageHeader } from '../components/PageHeader'
import { SearchInput } from '../components/SearchInput'
import { LoadingSkeleton } from '../components/LoadingSkeleton'
import { EmptyState } from '../components/EmptyState'
import { Modal } from '../components/Modal'
import { ConfirmDialog } from '../components/ConfirmDialog'
import { useClients, useCreateClient, useUpdateClient, useDeleteClient, useF1Shortcut } from '../hooks'
import { Plus, Edit2, Trash2, Users, Loader2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export const ClientsPage = () => {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const { data: clients, isLoading } = useClients(search)
  
  const createClient = useCreateClient()
  const updateClient = useUpdateClient()
  const deleteClient = useDeleteClient()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingClient, setEditingClient] = useState<any>(null)
  
  const [formData, setFormData] = useState({ name: '', phone: '', address: '' })
  
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useF1Shortcut(() => handleOpenModal())

  const handleOpenModal = (client?: any) => {
    if (client) {
      setEditingClient(client)
      setFormData({ name: client.name, phone: client.phone, address: client.address })
    } else {
      setEditingClient(null)
      setFormData({ name: '', phone: '', address: '' })
    }
    setIsModalOpen(true)
  }

  const handleSave = () => {
    if (!formData.name.trim()) {
      toast.error('Client name is required')
      return
    }
    if (editingClient) {
      updateClient.mutate({ id: editingClient.id, data: formData }, {
        onSuccess: () => {
          toast.success('Client updated successfully')
          setIsModalOpen(false)
        },
        onError: (err: any) => {
          toast.error(err.response?.data?.error || err.response?.data?.message || err.message || 'Failed to update client')
        }
      })
    } else {
      createClient.mutate(formData, {
        onSuccess: () => {
          toast.success('Client created successfully')
          setIsModalOpen(false)
        },
        onError: (err: any) => {
          toast.error(err.response?.data?.error || err.response?.data?.message || err.message || 'Failed to create client')
        }
      })
    }
  }

  const handleDelete = () => {
    if (deletingId) {
      deleteClient.mutate(deletingId, {
        onSuccess: () => {
          toast.success('Client deleted successfully')
          setIsConfirmOpen(false)
        },
        onError: (err: any) => {
          toast.error(err.response?.data?.error || err.response?.data?.message || err.message || 'Failed to delete client')
        }
      })
    }
  }

  return (
    <div>
      <PageHeader 
        title="Clients" 
        action={
          <button className="btn btn-primary" onClick={() => handleOpenModal()}>
            <Plus size={18} /> Add Client
          </button>
        }
      />

      <div style={{ marginBottom: '1.5rem' }}>
        <SearchInput value={search} onChange={setSearch} placeholder="Search clients by name, phone..." />
      </div>

      {isLoading ? (
        <LoadingSkeleton rows={5} />
      ) : !clients || clients.length === 0 ? (
        <EmptyState 
          icon={<Users />} 
          title="No clients found" 
          message={search ? "Try adjusting your search query." : "Get started by adding your first client."} 
        />
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Phone</th>
                <th>Address</th>
                <th>Projects</th>
                <th>Quotations</th>
                <th>Invoices</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((client: any) => (
                <tr key={client.id} style={{ cursor: 'pointer' }} onClick={() => navigate(`/clients/${client.id}`)}>
                  <td style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{client.name}</td>
                  <td>{client.phone}</td>
                  <td style={{ maxWidth: 200, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{client.address}</td>
                  <td>{client._count?.projects || 0}</td>
                  <td>{client._count?.quotations || 0}</td>
                  <td>{client._count?.invoices || 0}</td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }} onClick={e => e.stopPropagation()}>
                      <button className="btn btn-ghost btn-sm" onClick={() => handleOpenModal(client)}>
                        <Edit2 size={16} />
                      </button>
                      <button className="btn btn-ghost btn-sm" style={{ color: 'var(--danger)' }} onClick={() => { setDeletingId(client.id); setIsConfirmOpen(true); }}>
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
        onClose={() => setIsModalOpen(false)}
        title={editingClient ? 'Edit Client' : 'Add Client'}
        footer={
          <>
            <button className="btn btn-ghost" onClick={() => setIsModalOpen(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleSave} disabled={createClient.isPending || updateClient.isPending}>
              {createClient.isPending || updateClient.isPending ? <><Loader2 size={16} className="animate-spin mr-2 inline" /> Saving...</> : 'Save'}
            </button>
          </>
        }
      >
        <div className="form-group">
          <label className="form-label">Name</label>
          <input 
          autoFocus
            type="text" 
            className="form-input" 
            value={formData.name} 
            onChange={e => setFormData({ ...formData, name: e.target.value })} 
            placeholder="John Doe"
          />
        </div>
        <div className="form-group">
          <label className="form-label">Phone</label>
          <input 
            type="text" 
            className="form-input" 
            value={formData.phone} 
            onChange={e => setFormData({ ...formData, phone: e.target.value })} 
            placeholder="07X XXX XXXX"
          />
        </div>
        <div className="form-group">
          <label className="form-label">Address</label>
          <textarea 
            className="form-textarea" 
            value={formData.address} 
            onChange={e => setFormData({ ...formData, address: e.target.value })} 
            placeholder="Full Address"
          />
        </div>
      </Modal>

      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Delete Client"
        message="Are you sure you want to delete this client? This will permanently delete the client along with all their projects, invoices, and quotations."
        isPending={deleteClient.isPending}
      />
    </div>
  )
}

export default ClientsPage
