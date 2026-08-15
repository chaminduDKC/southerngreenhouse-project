import React from 'react'

type BadgeVariant = 'active' | 'in_progress' | 'completed' | 'on_hold' | 'draft' | 'sent' | 'accepted' | 'rejected' | 'low_stock' | 'allocated' | 'used' | 'worker_id'

interface BadgeProps {
  variant: BadgeVariant
  children: React.ReactNode
}

const variantMap: Record<BadgeVariant, string> = {
  active: 'badge-active',
  in_progress: 'badge-in-progress',
  completed: 'badge-completed',
  on_hold: 'badge-on-hold',
  draft: 'badge-draft',
  sent: 'badge-sent',
  accepted: 'badge-accepted',
  rejected: 'badge-rejected',
  low_stock: 'badge-low-stock',
  allocated: 'badge-allocated',
  used: 'badge-used',
  worker_id: 'badge-worker-id',
}

export const Badge: React.FC<BadgeProps> = ({ variant, children }) => {
  return (
    <span className={`badge ${variantMap[variant]}`}>
      {children}
    </span>
  )
}
