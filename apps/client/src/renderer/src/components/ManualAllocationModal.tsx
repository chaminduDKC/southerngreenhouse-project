import React, { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { TargetType } from "@sg/types";
import { Modal } from "./Modal";
import { useCreateManualAllocation, useUpdateManualAllocation } from "../hooks";

export const ManualAllocationModal = ({ isOpen, onClose, targetType, targetId, targetOptions, editItem }) => {
  const createMutation = useCreateManualAllocation();
  const updateMutation = useUpdateManualAllocation();

  const [form, setForm] = useState({
    targetType,
    targetId,
    itemName: "",
    unit: "",
    quantity: "",
    notes: ""
  });

  useEffect(() => {
    if (editItem) {
      setForm({
        targetType: editItem.targetType || targetType,
        targetId: editItem.targetId || targetId,
        itemName: editItem.itemName || "",
        unit: editItem.unit || "",
        quantity: editItem.quantity ? String(editItem.quantity) : "",
        notes: editItem.notes || ""
      });
    } else {
      setForm({
        targetType,
        targetId,
        itemName: "",
        unit: "",
        quantity: "",
        notes: ""
      });
    }
  }, [editItem, isOpen, targetType, targetId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      targetType: form.targetType,
      targetId: form.targetId,
      itemName: form.itemName,
      unit: form.unit,
      quantity: Number(form.quantity),
      notes: form.notes
    };

    try {
      if (editItem) {
        await updateMutation.mutateAsync({ id: editItem.id, data: payload });
      } else {
        await createMutation.mutateAsync(payload);
      }
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editItem ? "Edit Manual Material" : "Add Manual Material"}
      footer={
        <>
          <button type="button" className="btn btn-ghost" onClick={onClose} disabled={isPending}>Cancel</button>
          <button type="submit" form="manual-allocation-form" className="btn btn-primary" disabled={isPending}>
            {isPending ? <><Loader2 size={16} className="animate-spin inline mr-2" /> Saving...</> : "Save"}
          </button>
        </>
      }
    >
      <form id="manual-allocation-form" onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        
        {targetOptions && targetOptions.length > 0 && !editItem && (
          <div className="form-group">
            <label className="form-label">Allocate To</label>
            <select 
              className="form-input" 
              value={`${form.targetType}|${form.targetId}`}
              onChange={(e) => {
                const [tt, tid] = e.target.value.split("|");
                setForm({ ...form, targetType: tt, targetId: tid });
              }}
              required
            >
              {targetOptions.map(opt => {
                const typeLabel = opt.targetType === 'PROJECT' ? 'Main' : opt.targetType === 'SUB_PROJECT' ? 'Sub' : 'Child';
                return (
                  <option key={`${opt.targetType}|${opt.id}`} value={`${opt.targetType}|${opt.id}`}>
                    [{typeLabel}] {opt.title}
                  </option>
                );
              })}
            </select>
          </div>
        )}

        <div className="form-group">
          <label className="form-label">Item Name</label>
          <input 
            className="form-input" 
            value={form.itemName} 
            onChange={e => setForm({ ...form, itemName: e.target.value })} 
            required 
            placeholder="e.g. Glue Bottle"
          />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <div className="form-group">
            <label className="form-label">Unit</label>
            <input 
              className="form-input" 
              value={form.unit} 
              onChange={e => setForm({ ...form, unit: e.target.value })} 
              required 
              placeholder="e.g. Ltr, Pcs"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Quantity</label>
            <input 
              type="number" 
              step="0.001"
              min="0.001"
              className="form-input" 
              value={form.quantity} 
              onChange={e => setForm({ ...form, quantity: e.target.value })} 
              required 
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Notes (Optional)</label>
          <textarea 
            className="form-input" 
            value={form.notes} 
            onChange={e => setForm({ ...form, notes: e.target.value })} 
            rows={2}
          />
        </div>

      </form>
    </Modal>
  );
};
