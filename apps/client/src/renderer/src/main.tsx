import React from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { HashRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import App from './App'
import './styles/globals.css'
import { AuthProvider } from './context/AuthContext'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 300000, gcTime: 600000, retry: 1, refetchOnWindowFocus: false },
  },
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <HashRouter>
        <AuthProvider>
          <App />
          <Toaster position="bottom-right" toastOptions={{ style: { background: '#1f2937', color: '#f9fafb', border: '1px solid rgba(255,255,255,0.1)' } }} />
        </AuthProvider>
      </HashRouter>
    </QueryClientProvider>
  </React.StrictMode>
)
