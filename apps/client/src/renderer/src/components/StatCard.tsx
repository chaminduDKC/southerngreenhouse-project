import React from 'react'

interface StatCardProps {
  icon: React.ReactNode
  label: string
  value: string | number
  subtitle?: string
  variant?: 'primary' | 'warning' | 'danger' | 'accent' | 'default'
}

export const StatCard: React.FC<StatCardProps> = ({ icon, label, value, subtitle, variant = 'default' }) => {
  const variantClass = variant !== 'default' ? `stat-${variant}` : ''
  
  return (
    <div className={`glass-card stat-card ${variantClass}`}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
        <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 500 }}>{label}</div>
        <div style={{ color: `var(--${variant === 'default' ? 'primary' : variant})`, opacity: 0.8 }}>
          {icon}
        </div>
      </div>
      <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#fff', marginBottom: '0.25rem' }}>
        {value}
      </div>
      {subtitle && (
        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          {subtitle}
        </div>
      )}
    </div>
  )
}
