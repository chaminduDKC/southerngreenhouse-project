import React from 'react'

interface LoadingSkeletonProps {
  rows?: number
  type?: 'table' | 'card'
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ rows = 3, type = 'table' }) => {
  if (type === 'card') {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.5rem' }}>
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="glass-card">
            <div className="loading-skeleton" style={{ height: '24px', width: '40%', marginBottom: '1rem' }} />
            <div className="loading-skeleton" style={{ height: '36px', width: '80%', marginBottom: '0.5rem' }} />
            <div className="loading-skeleton" style={{ height: '16px', width: '60%' }} />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="table-container">
      <table style={{ width: '100%' }}>
        <thead>
          <tr>
            {Array.from({ length: 5 }).map((_, i) => (
              <th key={i}><div className="loading-skeleton" style={{ height: '16px', width: '60%' }} /></th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, i) => (
            <tr key={i}>
              {Array.from({ length: 5 }).map((_, j) => (
                <td key={j}><div className="loading-skeleton" style={{ height: '16px', width: '80%' }} /></td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
