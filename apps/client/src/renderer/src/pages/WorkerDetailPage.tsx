import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ArrowLeft, Clock, CalendarDays, Download, Edit2 , UserX} from 'lucide-react'
import * as api from '../api'
import toast from 'react-hot-toast'
import { LoadingSkeleton } from '../components/LoadingSkeleton'
import { EmptyState } from '../components/EmptyState'
import { API_BASE_URL } from '@renderer/api/apiClient'

export default function WorkerDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<'attendance' | 'salary'>('attendance')

  const [attMonth, setAttMonth] = useState(new Date().getMonth() + 1)
  const [attYear, setAttYear] = useState(new Date().getFullYear())

  const { data: worker, isLoading: loadingWorker } = useQuery({
    queryKey: ['worker', id],
    queryFn: () => api.getWorker(id!)
  })

  const startDate = `${attYear}-${String(attMonth).padStart(2, '0')}-01`
  const endDate = new Date(attYear, attMonth, 0).toISOString().split('T')[0]

  const { data: attendance, isLoading: loadingAtt } = useQuery({
    queryKey: ['attendance', id, startDate, endDate],
    queryFn: () => api.getAttendance({ workerId: id, startDate, endDate }),
    enabled: activeTab === 'attendance'
  })

  const { data: allSalaries, isLoading: loadingSal } = useQuery({
    queryKey: ['salaries'],
    queryFn: api.getSalaries,
    enabled: activeTab === 'salary'
  })
  const salaries = allSalaries?.filter((s: any) => s.workerId === id) || []

  const downloadPaysheet = async (salaryId: string) => {
    try {
      const token = localStorage.getItem('sg_token') || ''
      const res = await fetch(`${API_BASE_URL}/salary/${salaryId}/pdf`, {
        headers: { Authorization: `Bearer ${token}` }
      })

      const arrayBuffer = await res.arrayBuffer();
      const filename = `${'workers'.slice(0, -1)}-${salaryId}.pdf`

      await window.electronAPI.savePDF('workers', filename, arrayBuffer)
      toast.success("PDF downloded to Documents/irriga/workers")
      
    } catch (error) {
      toast.error('Failed to download paysheet')
    }
  }

  if (loadingWorker) return <LoadingSkeleton rows={4} />
  if (!worker) return <EmptyState icon={<UserX />} title="Worker not found" message="This worker may have been removed." />

  return (
    <div>
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button onClick={() => navigate('/workers')} className="btn btn-ghost btn-sm">
            <ArrowLeft size={18} />
          </button>
          <h1 className="page-title">Worker Profile</h1>
        </div>
      </div>

      <div className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <span className="badge badge-worker-id" style={{ fontSize: '0.9rem', padding: '0.35rem 0.75rem' }}>{worker.workerId}</span>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 600, color: 'var(--text-primary)' }}>{worker.name}</h2>
          </div>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '0.25rem' }}><strong style={{ color: 'var(--text-primary)' }}>Phone:</strong> {worker.phone}</p>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '0.75rem' }}><strong style={{ color: 'var(--text-primary)' }}>Address:</strong> {worker.address}</p>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <span className={`badge ${worker.rateType === 'DAILY' ? 'badge-in-progress' : 'badge-active'}`}>{worker.rateType}</span>
            <span style={{ fontWeight: 500, fontSize: '1.05rem', color: 'var(--primary)' }}>
              {worker.rate.toLocaleString('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} LKR/{worker.rateType === 'DAILY' ? 'day' : 'month'}
            </span>
          </div>
        </div>
       
      </div>

      <div className="tabs">
        <button className={`tab ${activeTab === 'attendance' ? 'active' : ''}`} onClick={() => setActiveTab('attendance')}>
          <Clock size={16} style={{ display: 'inline', marginRight: '0.4rem', verticalAlign: -3 }} /> Attendance History
        </button>
        <button className={`tab ${activeTab === 'salary' ? 'active' : ''}`} onClick={() => setActiveTab('salary')}>
          <CalendarDays size={16} style={{ display: 'inline', marginRight: '0.4rem', verticalAlign: -3 }} /> Salary History
        </button>
      </div>

      {activeTab === 'attendance' && (
        <>
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
            <select className="form-select" style={{ maxWidth: 160 }} value={attMonth} onChange={e => setAttMonth(Number(e.target.value))}>
              {Array.from({ length: 12 }).map((_, i) => (
                <option key={i + 1} value={i + 1}>{new Date(0, i).toLocaleString('default', { month: 'long' })}</option>
              ))}
            </select>
            <select className="form-select" style={{ maxWidth: 120 }} value={attYear} onChange={e => setAttYear(Number(e.target.value))}>
              {[2024, 2025, 2026, 2027].map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>

          {loadingAtt ? (
            <LoadingSkeleton rows={4} />
          ) : !attendance || attendance.length === 0 ? (
            <EmptyState icon={<Clock />} title="No records found" message="No attendance records for this period." />
          ) : (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Advance Given (LKR)</th>
                  </tr>
                </thead>
                <tbody>
                  {attendance.map((att: any) => (
                    <tr key={att.id}>
                      <td>{new Date(att.date).toLocaleDateString()}</td>
                      <td>
                        {att.present ? (
                          <span className="badge badge-completed">Present</span>
                        ) : (
                          <span className="badge badge-rejected">Absent</span>
                        )}
                      </td>
                      <td>{att.advanceGiven?.toLocaleString('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {activeTab === 'salary' && (
        loadingSal ? (
          <LoadingSkeleton rows={4} />
        ) : salaries.length === 0 ? (
          <EmptyState icon={<CalendarDays />} title="No salary records found" message="No salary history for this worker yet." />
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Period</th>
                  <th>Days Worked</th>
                  <th>Base Pay</th>
                  <th>Bonuses</th>
                  <th>Deductions</th>
                  <th>Advances</th>
                  <th>Net Pay</th>
                  <th>Paysheet</th>
                </tr>
              </thead>
              <tbody>
                {salaries.map((s: any) => (
                  <tr key={s.id}>
                    <td style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{new Date(0, s.month - 1).toLocaleString('default', { month: 'short' })} {s.year}</td>
                    <td>{s.daysWorked}</td>
                    <td>{s.basePay?.toLocaleString('en-LK', { minimumFractionDigits: 2 })}</td>
                    <td style={{ color: 'var(--success)' }}>+{s.bonuses?.toLocaleString('en-LK', { minimumFractionDigits: 2 })}</td>
                    <td style={{ color: 'var(--danger)' }}>-{s.deductions?.toLocaleString('en-LK', { minimumFractionDigits: 2 })}</td>
                    <td style={{ color: 'var(--warning)' }}>-{s.advancesTotal?.toLocaleString('en-LK', { minimumFractionDigits: 2 })}</td>
                    <td style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--text-primary)' }}>{s.netPay?.toLocaleString('en-LK', { minimumFractionDigits: 2 })}</td>
                    <td>
                      <button onClick={() => downloadPaysheet(s.id)} className="btn btn-secondary btn-sm">
                        <Download size={16} /> Download PDF
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      )}
    </div>
  )
}