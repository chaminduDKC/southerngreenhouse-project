import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { PageHeader } from '../components/PageHeader'
import { SearchInput } from '../components/SearchInput'
import { LoadingSkeleton } from '../components/LoadingSkeleton'
import { EmptyState } from '../components/EmptyState'
import { Modal } from '../components/Modal'
import { ConfirmDialog } from '../components/ConfirmDialog'
import { Badge } from '../components/Badge'
import { useInventory, useCreateInventoryItem, useUpdateInventoryItem, useDeleteInventoryItem, useF1Shortcut } from '../hooks'
import { Plus, Edit2, Trash2, Package, ArrowRightLeft, Loader2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export const InventoryPage = () => {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const { data: inventory, isLoading } = useInventory(search)
  
  const createItem = useCreateInventoryItem()
  const updateItem = useUpdateInventoryItem()
  const deleteItem = useDeleteInventoryItem()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<any>(null)
  
  const [formData, setFormData] = useState({
    name: '', unit: '', unitSize: 1, boughtPrice: 0, soldPrice: 0, quantity: 0, lowStockThreshold: 10
  })
  
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  useF1Shortcut(() => handleOpenModal())

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-LK', { style: 'currency', currency: 'LKR' }).format(amount)
  }

  const handleOpenModal = (item?: any) => {
    if (item) {
      setEditingItem(item)
      setFormData({ 
        name: item.name, 
        unit: item.unit, 
        unitSize: item.unitSize, 
        boughtPrice: item.boughtPrice, 
        soldPrice: item.soldPrice, 
        quantity: item.quantity, 
        lowStockThreshold: item.lowStockThreshold 
      })
    } else {
      setEditingItem(null)
      setFormData({ name: '', unit: '', unitSize: 1, boughtPrice: 0, soldPrice: 0, quantity: 0, lowStockThreshold: 10 })
    }
    setIsModalOpen(true)
  }

  const handleSave = () => {
    if (!formData.name.trim()) {
      toast.error('Item name is required')
      return
    }
    const data = {
      ...formData,
      unitSize: Number(formData.unitSize),
      boughtPrice: Number(formData.boughtPrice),
      soldPrice: Number(formData.soldPrice),
      quantity: Number(formData.quantity),
      lowStockThreshold: Number(formData.lowStockThreshold)
    }
    if (editingItem) {
      updateItem.mutate({ id: editingItem.id, data }, {
        onSuccess: () => {
          toast.success('Inventory item updated')
          setIsModalOpen(false)
        },
        onError: (err: any) => {
          toast.error(err.response?.data?.error || err.response?.data?.message || err.message || 'Failed to update item')
        }
      })
    } else {
      createItem.mutate(data, {
        onSuccess: () => {
          toast.success('Inventory item created')
          setIsModalOpen(false)
        },
        onError: (err: any) => {
          toast.error(err.response?.data?.error || err.response?.data?.message || err.message || 'Failed to create item')
        }
      })
    }
  }

  const handleDelete = () => {
    if (deletingId) {
      setDeleteError(null)
      deleteItem.mutate(deletingId, {
        onSuccess: () => {
          toast.success('Inventory item deleted')
          setIsConfirmOpen(false)
        },
        onError: (err: any) => {
          const errMsg = err.response?.data?.error || err.response?.data?.message || err.message || 'Failed to delete item. It might be allocated to a project.'
          toast.error(errMsg)
          setDeleteError(errMsg)
          setIsConfirmOpen(false)
        }
      })
    }
  }

  return (
    <div>
      <PageHeader 
        title="Inventory" 
        action={
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button className="btn btn-secondary" onClick={() => navigate('/inventory/allocate')}>
              <ArrowRightLeft size={18} /> Allocate
            </button>
            <button className="btn btn-primary" onClick={() => handleOpenModal()}>
              <Plus size={18} /> Add Item
            </button>
          </div>
        }
      />

      {deleteError && (
        <div className="alert alert-danger" style={{ marginBottom: '1.5rem' }}>
          {deleteError}
        </div>
      )}

      <div style={{ marginBottom: '1.5rem' }}>
        <SearchInput value={search} onChange={setSearch} placeholder="Search inventory items..." />
      </div>

      {isLoading ? (
        <LoadingSkeleton rows={5} />
      ) : !inventory || inventory.length === 0 ? (
        <EmptyState 
          icon={<Package />} 
          title="No inventory found" 
          message={search ? "Try adjusting your search query." : "Get started by adding your first inventory item."} 
        />
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Unit</th>
                <th>Unit Size</th>
                <th>Qty</th>
                <th>Bought Price</th>
                <th>Sold Price</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {inventory.map((item: any) => (
                <tr key={item.id} style={{ cursor: 'pointer' }} onClick={() => handleOpenModal(item)}>
                  <td style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{item.name}</td>
                  <td>{item.unit}</td>
                  <td>{item.unitSize}</td>
                  <td style={{ fontWeight: 600 }}>{item.quantity}</td>
                  <td>{formatCurrency(item.boughtPrice)}</td>
                  <td>{formatCurrency(item.soldPrice)}</td>
                  <td>
                    {item.isLowStock || item.quantity <= item.lowStockThreshold ? (
                      <Badge variant="low_stock">Low Stock</Badge>
                    ) : (
                      <Badge variant="active">In Stock</Badge>
                    )}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }} onClick={e => e.stopPropagation()}>
                      <button className="btn btn-ghost btn-sm" onClick={() => handleOpenModal(item)}>
                        <Edit2 size={16} />
                      </button>
                      <button className="btn btn-ghost btn-sm" style={{ color: 'var(--danger)' }} onClick={() => { setDeletingId(item.id); setIsConfirmOpen(true); }}>
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
        title={editingItem ? 'Edit Item' : 'Add Item'}
        footer={
          <>
            <button className="btn btn-ghost" onClick={() => setIsModalOpen(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleSave} disabled={createItem.isPending || updateItem.isPending}>
              {createItem.isPending || updateItem.isPending ? <><Loader2 size={16} className="animate-spin mr-2 inline" /> Saving...</> : 'Save'}
            </button>
          </>
        }
      >
        <div className="form-group">
          <label className="form-label">Item Name</label>
          <input autoFocus type="text" className="form-input" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="E.g. Cement, Steel Pipe" />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Unit Type</label>
            <input type="text" className="form-input" value={formData.unit} onChange={e => setFormData({ ...formData, unit: e.target.value })} placeholder="E.g. Bags, Meters" />
          </div>
          <div className="form-group">
            <label className="form-label">Unit Size (multiplier)</label>
            <input type="number" step="0.01" className="form-input" value={formData.unitSize} onChange={e => setFormData({ ...formData, unitSize: Number(e.target.value) })} />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Bought Price (Rs)</label>
            <input type="number" step="0.01" className="form-input" value={formData.boughtPrice} onChange={e => setFormData({ ...formData, boughtPrice: Number(e.target.value) })} />
          </div>
          <div className="form-group">
            <label className="form-label">Sold Price (Rs)</label>
            <input type="number" step="0.01" className="form-input" value={formData.soldPrice} onChange={e => setFormData({ ...formData, soldPrice: Number(e.target.value) })} />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Initial Quantity</label>
            <input type="number" className="form-input" value={formData.quantity} onChange={e => setFormData({ ...formData, quantity: Number(e.target.value) })} />
          </div>
          <div className="form-group">
            <label className="form-label">Low Stock Threshold</label>
            <input type="number" className="form-input" value={formData.lowStockThreshold} onChange={e => setFormData({ ...formData, lowStockThreshold: Number(e.target.value) })} />
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Delete Inventory Item"
        message="Are you sure you want to delete this inventory item? This will permanently delete the item along with all its allocation history."
        isPending={deleteItem.isPending}
      />
    </div>
  )
}

export default InventoryPage
