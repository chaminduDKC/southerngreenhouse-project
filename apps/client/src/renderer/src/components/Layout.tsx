import React from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  LayoutDashboard, Users, Package, FolderKanban, BookOpen,
  FileText, Receipt, HardHat, CalendarCheck, Banknote,
  LogOut, Leaf
} from 'lucide-react'

const navItems = [
  { to: '/dashboard',  label: 'Dashboard',  icon: LayoutDashboard },
  { to: '/clients',    label: 'Clients',     icon: Users },
  { to: '/inventory',  label: 'Inventory',   icon: Package },
  { to: '/projects',   label: 'Projects',    icon: FolderKanban },
  { to: '/ledger',     label: 'Ledger',      icon: BookOpen },
  { to: '/quotations', label: 'Quotations',  icon: FileText },
  { to: '/invoices',   label: 'Invoices',    icon: Receipt },
  { to: '/workers',    label: 'Workers',     icon: HardHat },
  { to: '/attendance', label: 'Attendance',  icon: CalendarCheck },
  { to: '/salary',     label: 'Salary',      icon: Banknote },
]

export const Layout: React.FC = () => {
  const { logout, user } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      {/* Sidebar */}
      <aside className="sidebar">
        {/* Brand */}
        <div className="sidebar-brand">
          <div className="sidebar-brand-icon">
            <Leaf size={20} color="#10b981" />
          </div>
          <div>
            <div className="sidebar-brand-name">Southern</div>
            <div className="sidebar-brand-sub">Greenhouse</div>
          </div>
        </div>

        {/* Nav */}
        <nav className="sidebar-nav">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
            >
              <Icon size={18} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="sidebar-user-avatar">
              {user?.email?.charAt(0).toUpperCase() ?? 'A'}
            </div>
            <div className="sidebar-user-info">
              <div className="sidebar-user-name">Admin</div>
              {/* <div className="sidebar-user-email">{user?.email ?? ''}</div> */}
            </div>
          </div>
          <button className="sidebar-logout" onClick={handleLogout} title="Logout">
            <LogOut size={16} />
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="main-content">
        <div className="page-container">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
