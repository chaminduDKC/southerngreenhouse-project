import React from 'react'

interface EmptyStateProps {
  icon: React.ReactNode
  title: string
  message?: string
}

export const EmptyState: React.FC<EmptyStateProps> = ({ icon, title, message }) => {
  return (
    <div className="empty-state glass-card">
      {React.cloneElement(icon as React.ReactElement, { size: 64 })}
      <h4>{title}</h4>
      {message && <p>{message}</p>}
    </div>
  )
}
