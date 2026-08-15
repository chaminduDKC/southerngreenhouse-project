import { Loader2 } from 'lucide-react'
import { Modal } from './Modal'

interface ConfirmDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  isPending?: boolean
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen, onClose, onConfirm, title, message, confirmText = 'Delete', cancelText = 'Cancel', isPending = false
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="sm"
      footer={
        <>
          <button className="btn btn-ghost" onClick={onClose} disabled={isPending}>{cancelText}</button>
          <button className="btn btn-danger" onClick={() => { onConfirm() }} disabled={isPending}>
            {isPending ? <><Loader2 size={16} className="animate-spin" /> {confirmText}ing...</> : confirmText}
          </button>
        </>
      }
    >
      <div style={{ color: 'var(--text-secondary)' }}>
        {message}
      </div>
    </Modal>
  )
}
