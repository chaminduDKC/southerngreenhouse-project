import React, { lazy, Suspense } from 'react'
import {HashRouter, Routes, Route, Navigate } from 'react-router-dom'

import { useAuth } from './context/AuthContext'
import { Layout } from './components/Layout'

// Eagerly loaded (always needed)
import LoginPage from './pages/LoginPage'

// Lazily loaded pages
const DashboardPage = lazy(() => import('./pages/DashboardPage'))
const ClientsPage = lazy(() => import('./pages/ClientsPage'))
const ClientDetailPage = lazy(() => import('./pages/ClientDetailPage'))
const InventoryPage = lazy(() => import('./pages/InventoryPage'))
const AllocationPage = lazy(() => import('./pages/AllocationPage'))
const ProjectsPage = lazy(() => import('./pages/ProjectsPage'))
const ProjectDetailPage = lazy(() => import('./pages/ProjectDetailPage'))
const SubProjectDetailPage = lazy(() => import('./pages/SubProjectDetailPage'))
const ChildProjectDetailPage = lazy(() => import('./pages/ChildProjectDetailPage'))
const LedgerPage = lazy(() => import('./pages/LedgerPage'))
const LedgerEntryFormPage = lazy(() => import('./pages/LedgerEntryFormPage'))
const QuotationsPage = lazy(() => import('./pages/QuotationsPage'))
const QuotationFormPage = lazy(() => import('./pages/QuotationFormPage'))
const InvoicesPage = lazy(() => import('./pages/InvoicesPage'))
const InvoiceFormPage = lazy(() => import('./pages/InvoiceFormPage'))
const WorkersPage = lazy(() => import('./pages/WorkersPage'))
const WorkerDetailPage = lazy(() => import('./pages/WorkerDetailPage'))
const AttendancePage = lazy(() => import('./pages/AttendancePage'))
const SalaryPage = lazy(() => import('./pages/SalaryPage'))

const PageFallback = () => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-secondary)' }}>
    Loading...
  </div>
)

const App = () => {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: 'var(--bg)' }}>
        <div style={{ color: 'var(--primary)', fontSize: '1.1rem', fontWeight: 600 }}>Southern Greenhouse</div>
      </div>
    )
  }

  return (
    <Suspense fallback={<PageFallback />}>
      <Routes>
        <Route path="/login" element={!isAuthenticated ? <LoginPage /> : <Navigate to="/dashboard" />} />

        <Route element={isAuthenticated ? <Layout /> : <Navigate to="/login" />}>
          <Route path="/dashboard" element={<DashboardPage />} />

          {/* Clients */}
          <Route path="/clients" element={<ClientsPage />} />
          <Route path="/clients/:id" element={<ClientDetailPage />} />

          {/* Inventory */}
          <Route path="/inventory" element={<InventoryPage />} />
          <Route path="/inventory/allocate" element={<AllocationPage />} />

          {/* Projects */}
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/projects/:id" element={<ProjectDetailPage />} />
          <Route path="/subprojects/:id" element={<SubProjectDetailPage />} />
          <Route path="/childprojects/:id" element={<ChildProjectDetailPage />} />

          {/* Ledger */}
          <Route path="/ledger" element={<LedgerPage />} />
          <Route path="/ledger/new" element={<LedgerEntryFormPage />} />
          <Route path="/ledger/:id/edit" element={<LedgerEntryFormPage />} />

          {/* Quotations */}
          <Route path="/quotations" element={<QuotationsPage />} />
          <Route path="/quotations/new" element={<QuotationFormPage />} />
          <Route path="/quotations/:id/edit" element={<QuotationFormPage />} />

          {/* Invoices */}
          <Route path="/invoices" element={<InvoicesPage />} />
          <Route path="/invoices/new" element={<InvoiceFormPage />} />
          <Route path="/invoices/:id/edit" element={<InvoiceFormPage />} />

          {/* Workers */}
          <Route path="/workers" element={<WorkersPage />} />
          <Route path="/workers/:id" element={<WorkerDetailPage />} />

          {/* Attendance & Salary */}
          <Route path="/attendance" element={<AttendancePage />} />
          <Route path="/salary" element={<SalaryPage />} />

          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Route>
      </Routes>
    </Suspense>
  )
}

export default App
