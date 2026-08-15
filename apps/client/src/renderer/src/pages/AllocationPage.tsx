// @ts-nocheck
import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Check, PackageSearch } from 'lucide-react'
import toast from 'react-hot-toast'
import { PageHeader } from '../components/PageHeader'
import { EmptyState } from '../components/EmptyState'
import { AllocationTargetDTO } from '@sg/types'
import { useInventory, useEligibleAllocationTargets, useAllocateInventory } from '../hooks'

export default function AllocationPage() {
  const navigate = useNavigate()

  const { data: inventoryItems, isLoading: itemsLoading } = useInventory()
  const { data: targets, isLoading: targetsLoading } = useEligibleAllocationTargets()

  const allocateInventory = useAllocateInventory()

  const [selectedItemId, setSelectedItemId] = useState<string>('')
  const [quantities, setQuantities] = useState<Record<string, number>>({})

  const selectedItem = useMemo(() => inventoryItems?.find(i => i.id === selectedItemId), [inventoryItems, selectedItemId])

  const activeTargets = useMemo(() => targets?.filter(t => t.status !== 'COMPLETED' && t.status !== 'ON_HOLD') || [], [targets])

  const totalAllocated = useMemo(() => Object.values(quantities).reduce((a, b) => a + (b || 0), 0), [quantities])

  const handleQuantityChange = (targetId: string, value: number) => {
    setQuantities(prev => ({ ...prev, [targetId]: value }))
  }

  const handleSubmit = async () => {
    if (!selectedItemId) return toast.error('Select an item')
    if (totalAllocated === 0) return toast.error('Allocate at least 1 quantity')
    if (selectedItem && totalAllocated > selectedItem.quantity) return toast.error('Total allocated exceeds available stock')

    const rows = Object.entries(quantities)
      .filter(([_, qty]) => qty > 0)
      .map(([targetId, qty]) => {
        const target = activeTargets.find(t => t.id === targetId)!
        return {
          targetType: target.targetType,
          targetId: target.id,
          quantity: qty
        }
      })

    try {
      await allocateInventory.mutateAsync({
        inventoryItemId: selectedItemId,
        rows
      })
      toast.success('Allocated successfully')
      navigate('/inventory')
    } catch (err: any) {
      toast.error(err.message || 'Failed to allocate')
    }
  }

  const overAllocated = selectedItem ? totalAllocated > selectedItem.quantity : false

  return (
    <div className="page-container">
      <PageHeader
        title="Allocate Inventory"
        action={
          <button className="btn btn-secondary" onClick={() => navigate('/inventory')}>
            <ArrowLeft size={16} /> Back to Inventory
          </button>
        }
      />

      {/* Step 1 */}
      <div className="glass-card" style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', color: '#fff' }}>
          Step 1: Select Inventory Item
        </h2>
        <div style={{ maxWidth: 420 }}>
          <select
            className="form-select"
            value={selectedItemId}
            onChange={e => {
              setSelectedItemId(e.target.value)
              setQuantities({})
            }}
          >
            <option value="">-- Choose Item --</option>
            {inventoryItems?.map(item => (
              <option key={item.id} value={item.id} disabled={item.quantity <= 0}>
                {item.name} ({item.quantity} {item.unit} available)
              </option>
            ))}
          </select>
        </div>

        {selectedItem && (
          <div
            style={{
              marginTop: '1rem',
              padding: '1rem 1.25rem',
              background: 'var(--primary-glow)',
              border: '1px solid rgba(16,185,129,0.3)',
              borderRadius: 'var(--radius-sm)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Selected Item</div>
              <div style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--primary)' }}>{selectedItem.name}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Available Stock</div>
              <div style={{ fontWeight: 700, fontSize: '1.3rem', color: 'var(--text-primary)' }}>
                {selectedItem.quantity} <span style={{ fontSize: '0.85rem', fontWeight: 400, color: 'var(--text-secondary)' }}>{selectedItem.unit}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Step 2 */}
      {selectedItem && (
        <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
          <div
            style={{
              padding: '1.25rem 1.5rem',
              borderBottom: '1px solid var(--border)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>Step 2: Allocate to Projects</h2>
            <div style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--text-secondary)' }}>
              Total to Allocate:{' '}
              <span style={{ fontSize: '1.1rem', fontWeight: 700, color: overAllocated ? 'var(--danger)' : 'var(--accent)' }}>
                {totalAllocated}
              </span>{' '}
              / {selectedItem.quantity}
            </div>
          </div>

          <div className="table-container" style={{ border: 'none', borderRadius: 0, maxHeight: 500, overflow: 'auto' }}>
            <table>
              <thead style={{ position: 'sticky', top: 0, background: 'var(--surface)', zIndex: 1 }}>
                <tr>
                  <th>Target Project</th>
                  <th>Type</th>
                  <th>Location</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Qty to Allocate</th>
                </tr>
              </thead>
              <tbody>
                {targetsLoading ? (
                  <tr>
                    <td colSpan={5} style={{ textAlign: 'center', padding: '2rem' }}>Loading targets...</td>
                  </tr>
                ) : activeTargets.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ padding: 0 }}>
                      <EmptyState icon={<PackageSearch />} title="No active projects found" message="There are no eligible projects to allocate this item to right now." />
                    </td>
                  </tr>
                ) : (
                  activeTargets.map(target => (
                    <tr key={target.id}>
                      <td style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{target.title}</td>
                      <td>
                        <span className="chip">{target.targetType.replace('_', ' ')}</span>
                      </td>
                      <td>{target.location}</td>
                      <td>
                        <span className={`badge ${target.status === 'ACTIVE' ? 'badge-active' : 'badge-in-progress'}`}>
                          {target.status}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '0.5rem' }}>
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            max={selectedItem.quantity}
                            className="form-input"
                            style={{ width: 100, textAlign: 'right', padding: '0.5rem 0.75rem' }}
                            value={quantities[target.id] || ''}
                            onChange={e => handleQuantityChange(target.id, parseFloat(e.target.value) || 0)}
                            placeholder="0"
                          />
                          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', width: 32, textAlign: 'left' }}>
                            {selectedItem.unit}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div
            style={{
              padding: '1.25rem 1.5rem',
              background: 'rgba(0,0,0,0.1)',
              borderTop: '1px solid var(--border)',
              display: 'flex',
              justifyContent: 'flex-end'
            }}
          >
            <button
              className="btn btn-primary"
              style={{ paddingLeft: '2rem', paddingRight: '2rem' }}
              disabled={totalAllocated <= 0 || overAllocated}
              onClick={handleSubmit}
            >
              <Check size={18} /> Allocate Inventory
            </button>
          </div>
        </div>
      )}
    </div>
  )
}