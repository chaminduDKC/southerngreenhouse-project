import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ArrowLeft, Download, FileText, Briefcase, FileSignature, Edit, View, Eye } from 'lucide-react'
import * as api from '../api'
import { LoadingSkeleton } from '@renderer/components/LoadingSkeleton'
import { API_BASE_URL } from '@renderer/api/apiClient'
import toast from 'react-hot-toast'

export default function ClientDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<'projects' | 'quotations' | 'invoices'>('projects')

  const { data: client, isLoading, isError } = useQuery({
    queryKey: ['client', id],
    queryFn: () => api.getClient(id!)
  })

  // const downloadPDF = async (type: 'quotations' | 'invoices' | 'paysheets', docId: string) => {
  //   const token = localStorage.getItem('sg_token') || ''
  //   const res = await fetch(`http://localhost:3001/api/${type}/${docId}/pdf`, {
  //     headers: { Authorization: `Bearer ${token}` }
  //   })
  //   const blob = await res.blob()
  //   const url = URL.createObjectURL(blob)
  //   const a = document.createElement('a')
  //   a.href = url
  //   a.download = `${type.slice(0, -1)}-${docId}.pdf`
  //   a.click()
  //   URL.revokeObjectURL(url)
  // }


const downloadPDF = async (type: 'quotations' | 'invoices', docId: string) => {
  const token = localStorage.getItem('sg_token') || ''
  const res = await fetch(`${API_BASE_URL}/${type}/${docId}/pdf`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  const arrayBuffer = await res.arrayBuffer()
  const filename = `${type.slice(0, -1)}-${docId}.pdf`

  const savedPath = await window.electronAPI.savePDF(type, filename, arrayBuffer)
  console.log('Saved to:', savedPath)
  toast.success(`PDF downloded to Documents/irriga/quotations`)
}

  if (isLoading) return <LoadingSkeleton />
  if (isError || !client) return <div className="empty-state">Error loading client</div>

  return (
    <div className="space-y-6">
      <div className="page-header flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/clients')} className="btn btn-ghost btn-sm">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold">Client Details</h1>
        </div>
       
      </div>

      <div className="glass-card p-6">
        <h2 className="text-xl font-semibold mb-2">{client.name}</h2>
        <p className="text-gray-500 mb-1"><strong>Phone:</strong> {client.phone}</p>
        <p className="text-gray-500"><strong>Address:</strong> {client.address}</p>
      </div>

      <div className="tabs">
        <button 
          className={`tab ${activeTab === 'projects' ? 'active' : ''}`}
          onClick={() => setActiveTab('projects')}
        >
          <Briefcase className="w-4 h-4 inline mr-2" /> Projects
        </button>
        <button 
          className={`tab ${activeTab === 'quotations' ? 'active' : ''}`}
          onClick={() => setActiveTab('quotations')}
        >
          <FileSignature className="w-4 h-4 inline mr-2" /> Quotations
        </button>
        <button 
          className={`tab ${activeTab === 'invoices' ? 'active' : ''}`}
          onClick={() => setActiveTab('invoices')}
        >
          <FileText className="w-4 h-4 inline mr-2" /> Invoices
        </button>
      </div>

      <div className="glass-card p-0">
        {activeTab === 'projects' && (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Location</th>
                  <th>Status</th>
                  <th>Value</th>
                  <th>Cost</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {client.projects?.map((p: any) => (
                  <tr key={p.id}>
                    <td>{p.title}</td>
                    <td>{p.location}</td>
                    <td><span className={`badge ${p.status.toLowerCase()}`}>{p.status}</span></td>
                    <td>{p.value?.toLocaleString('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '-'}</td>
                    <td>{p.cost?.toLocaleString('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '-'}</td>
                    <td>
                      <div>
                      
                      </div>
                      <button onClick={() => navigate(`/projects/${p.id}`)} className="btn btn-secondary btn-sm">  <Eye size={18} /></button>
                    </td>
                  </tr>
                ))}
                {!client.projects?.length && (
                  <tr><td colSpan={6} className="text-center py-4">No projects found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'quotations' && (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Project</th>
                  <th>Valid Until</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {client.quotations?.map((q: any) => (
                  <tr key={q.id}>
                    <td>{q.id.slice(0, 8)}</td>
                    <td>{q.project?.title || '-'}</td>
                    <td>{new Date(q.validUntil).toLocaleDateString()}</td>
                    <td>{q.total?.toLocaleString('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                    <td><span className={`badge ${q.status.toLowerCase()}`}>{q.status}</span></td>
                    <td>
                      <button onClick={() => downloadPDF('quotations', q.id)} className="btn btn-secondary btn-sm" title="Download PDF">
                        <Download className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
                {!client.quotations?.length && (
                  <tr><td colSpan={6} className="text-center py-4">No quotations found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'invoices' && (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Project</th>
                  <th>Total Amount</th>
                  <th>Amount Due</th>
                  <th>Due Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {client.invoices?.map((i: any) => {
                  const isOverdue = new Date(i.dueDate) < new Date() && i.amountDue > 0
                  return (
                    <tr key={i.id} className={isOverdue ? 'overdue-row' : ''}>
                      <td>{i.id.slice(0, 8)}</td>
                      <td>{i.project?.title || '-'}</td>
                      <td>{i.totalAmount?.toLocaleString('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                      <td>
                        {i.amountDue?.toLocaleString('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        {isOverdue && <span className="badge danger ml-2">Overdue</span>}
                      </td>
                      <td>{new Date(i.dueDate).toLocaleDateString()}</td>
                      <td>
                        <button onClick={() => downloadPDF('invoices', i.id)} className="btn btn-secondary btn-sm" title="Download PDF">
                          <Download className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  )
                })}
                {!client.invoices?.length && (
                  <tr><td colSpan={6} className="text-center py-4">No invoices found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
