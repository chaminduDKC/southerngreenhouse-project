import React from 'react'
import { PageHeader } from '../components/PageHeader'
import { StatCard } from '../components/StatCard'
import { LoadingSkeleton } from '../components/LoadingSkeleton'
import { useDashboardStats } from '../hooks'
import { Briefcase, Users, DollarSign, AlertCircle, HardHat, TrendingDown } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { format } from 'date-fns'

export const DashboardPage = () => {
  const { data: stats, isLoading } = useDashboardStats()

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-LK', { style: 'currency', currency: 'LKR' }).format(amount)
  }

  if (isLoading) {
    return (
      <div>
        <PageHeader title="Dashboard" />
        <LoadingSkeleton type="card" rows={6} />
      </div>
    )
  }

  if (!stats) return null

  const pieData = [
    { name: 'Active', value: stats.projectStatusBreakdown.active, color: 'var(--primary)' },
    { name: 'In Progress', value: stats.projectStatusBreakdown.inProgress, color: 'var(--accent)' },
    { name: 'On Hold', value: stats.projectStatusBreakdown.onHold, color: 'var(--warning)' },
    { name: 'Completed', value: stats.projectStatusBreakdown.completed, color: 'var(--success)' },
  ].filter(d => d.value > 0)

  return (
    <div>
      <PageHeader 
        title="Dashboard" 
        action={<div style={{ color: 'var(--text-muted)' }}>{format(new Date(), 'EEEE, MMMM do yyyy')}</div>}
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <StatCard 
          icon={<Briefcase size={24} />} 
          label="Active Projects" 
          value={stats.activeProjects} 
          variant="primary"
        />
        <StatCard 
          icon={<Users size={24} />} 
          label="Total Clients" 
          value={stats.totalClients} 
        />
        <StatCard 
          icon={<DollarSign size={24} />} 
          label="Monthly Revenue" 
          value={formatCurrency(stats.monthlyRevenue)} 
          variant="primary"
        />
        <StatCard 
          icon={<TrendingDown size={24} />} 
          label="Monthly Cost" 
          value={formatCurrency(stats.monthlyCost)} 
          variant="danger"
        />
        <StatCard 
          icon={<AlertCircle size={24} />} 
          label="Low Stock Items" 
          value={stats.lowStockCount} 
          variant={stats.lowStockCount > 0 ? 'warning' : 'default'}
        />
        <StatCard 
          icon={<HardHat size={24} />} 
          label="Active Workers" 
          value={stats.activeWorkers} 
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="glass-card">
          <h3 style={{ marginBottom: '1.5rem', fontSize: '1.1rem', fontWeight: 600 }}>Revenue vs Cost (Last 6 Months)</h3>
          <div style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.revenueVsCost}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="month" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `Rs ${v/1000}k`} />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)', borderRadius: 'var(--radius-sm)' }}
                  itemStyle={{ color: 'var(--text-primary)' }}
                  formatter={(value: number) => formatCurrency(value)}
                />
                <Bar dataKey="revenue" fill="var(--primary)" radius={[4, 4, 0, 0]} name="Revenue" />
                <Bar dataKey="cost" fill="var(--danger)" radius={[4, 4, 0, 0]} name="Cost" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card">
          <h3 style={{ marginBottom: '1.5rem', fontSize: '1.1rem', fontWeight: 600 }}>Project Status</h3>
          <div style={{ height: 300 }}>
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)', borderRadius: 'var(--radius-sm)' }}
                    itemStyle={{ color: 'var(--text-primary)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                No project data available
              </div>
            )}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center', marginTop: '-20px' }}>
              {pieData.map(d => (
                <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem' }}>
                  <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: d.color }}></div>
                  <span>{d.name} ({d.value})</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* <div className="glass-card">
        <h3 style={{ marginBottom: '1.5rem', fontSize: '1.1rem', fontWeight: 600 }}>Recent Completions</h3>
        {stats.recentCompletions.length > 0 ? (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Type</th>
                  <th>Completed Date</th>
                </tr>
              </thead>
              <tbody>
                {(stats.recentCompletions ?? []).map((item: any) => (
                  <tr key={item.id}>
                    <td style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{item.title}</td>
                    <td><span className="chip secondary">{item.targetType}</span></td>
                    <td>{format(new Date(item.completedAt), 'MMM dd, yyyy')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem 0' }}>
            No recent completions
          </div>
        )}
      </div> */}
    </div>
  )
}

export default DashboardPage
