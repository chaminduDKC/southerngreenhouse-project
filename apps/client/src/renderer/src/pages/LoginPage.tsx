import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import { Leaf, Mail, Lock, Eye, EyeOff, CheckCircle2 } from 'lucide-react'

const FEATURES = [
  'Client & Project Management',
  'Inventory Allocation',
  'Worker Attendance & Payroll',
  'Quotations & Invoicing',
]

const LoginPage = () => {
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await login(email, password)
    } catch (err: any) {
      toast.error(err?.response?.data?.message || err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ display: 'flex', height: '100vh', background: 'var(--bg)' }}>
      {/* Left branding panel */}
      <div
        style={{
          flex: 1,
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '4rem 5rem',
          overflow: 'hidden',
          background: 'linear-gradient(160deg, #0a0f1e 0%, #0d1420 60%, #0a0f1e 100%)',
          borderRight: '1px solid var(--border)',
        }}
      >
        {/* subtle grid backdrop */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
            pointerEvents: 'none',
          }}
        />
        {/* corner accents */}
        <div style={{ position: 'absolute', top: 32, left: 32, width: 28, height: 28, borderTop: '2px solid var(--primary)', borderLeft: '2px solid var(--primary)', opacity: 0.6 }} />
        <div style={{ position: 'absolute', bottom: 32, right: 32, width: 28, height: 28, borderBottom: '2px solid var(--primary)', borderRight: '2px solid var(--primary)', opacity: 0.6 }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '3rem' }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--success)', boxShadow: '0 0 8px var(--success)' }} />
            <span style={{ fontSize: '0.75rem', letterSpacing: '0.15em', color: 'var(--success)', fontWeight: 600 }}>
              SYSTEM ONLINE
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '3rem' }}>
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: 14,
                background: 'var(--primary-glow)',
                border: '1px solid rgba(16,185,129,0.35)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Leaf size={28} color="var(--primary)" />
            </div>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff', lineHeight: 1.1 }}>Southern</div>
              <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--primary)', letterSpacing: '0.1em' }}>
                GREENHOUSE
              </div>
            </div>
          </div>

          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#fff', lineHeight: 1.15, marginBottom: '0.75rem' }}>
            Grow. Build.<br />
            <span style={{ color: 'var(--primary)' }}>Manage it all.</span>
          </h1>

          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.6, maxWidth: 440, marginBottom: '2.5rem' }}>
            Streamline your projects, manage inventory, track workers, and keep your finances in one place.
          </p>

          <div>
            {FEATURES.map((f, i) => (
              <div
                key={f}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.9rem 0',
                  borderTop: i === 0 ? '1px solid var(--border)' : 'none',
                  borderBottom: '1px solid var(--border)',
                }}
              >
                <CheckCircle2 size={18} color="var(--primary)" />
                <span style={{ color: 'var(--text-primary)', fontWeight: 500, fontSize: '0.95rem' }}>{f}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right login panel */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div
          className="glass-card"
          style={{
            width: '100%',
            maxWidth: 420,
            position: 'relative',
            overflow: 'hidden',
            padding: '2.5rem',
          }}
        >
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: 'var(--primary)' }} />

          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{ fontSize: '0.75rem', letterSpacing: '0.15em', color: 'var(--primary)', fontWeight: 600, marginBottom: '0.5rem' }}>
              TERMINAL ACCESS
            </div>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 700, color: '#fff', marginBottom: '0.4rem' }}>Welcome Back</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Sign in to your account to continue</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email</label>
              <div style={{ position: 'relative' }}>
                <Mail
                  size={17}
                  style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
                />
                <input
                  type="email"
                  className="form-input"
                  style={{ paddingLeft: '2.6rem' }}
                  placeholder="Enter your email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  autoFocus
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div style={{ position: 'relative' }}>
                <Lock
                  size={17}
                  style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
                />
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="form-input"
                  style={{ paddingLeft: '2.6rem', paddingRight: '2.6rem' }}
                  placeholder="Enter your password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(s => !s)}
                  style={{
                    position: 'absolute',
                    right: 12,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    padding: 4,
                    display: 'flex',
                  }}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              style={{ width: '100%', marginTop: '0.5rem', padding: '0.85rem' }}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
          <h2>admin@southerngreehouse.com</h2>
          <h2>Admin@1234</h2>

          <div style={{ borderTop: '1px solid var(--border)', marginTop: '2rem', paddingTop: '1.25rem', textAlign: 'center' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--primary)' }} />
              Southern Greenhouse Desktop Client v1.0.0
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage