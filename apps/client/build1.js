const fs = require('fs');
const path = require('path');

const files = {
  'src/main/index.ts': `import { app, BrowserWindow, ipcMain, shell } from 'electron'
import { join } from 'path'
import { startServer, stopServer } from './serverManager'

function createWindow(): void {
  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 1024,
    minHeight: 768,
    show: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: join(__dirname, '../preload/index.js')
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  if (!app.isPackaged && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
    mainWindow.webContents.openDevTools()
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

app.setName('Southern Greenhouse')

app.whenReady().then(async () => {
  ipcMain.handle('open-pdf', async (_, filePath) => {
    await shell.openPath(filePath)
  })
  
  ipcMain.handle('get-app-version', () => {
    return app.getVersion()
  })

  await startServer()
  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('before-quit', () => {
  stopServer()
})
`,

  'src/main/serverManager.ts': `import { utilityProcess, app } from 'electron'
import { join } from 'path'

let serverProcess: Electron.UtilityProcess | null = null

export function startServer(): Promise<void> {
  return new Promise((resolve) => {
    const isDev = !app.isPackaged
    const serverPath = isDev
      ? join(__dirname, '../../server/src/index.ts')
      : join(process.resourcesPath, 'server/dist/index.js')

    serverProcess = utilityProcess.fork(serverPath, [], {
      env: {
        ...process.env,
        PORT: '3001',
        NODE_ENV: isDev ? 'development' : 'production',
      },
      execArgv: isDev ? ['--import', 'tsx'] : []
    })

    serverProcess.on('message', (msg: any) => {
      if (msg === 'ready') resolve()
    })

    serverProcess.on('exit', (code) => {
      console.log('Server process exited with code:', code)
    })
    
    // Resolve anyway after 3s to not block UI forever if server fails to send 'ready'
    setTimeout(resolve, 3000)
  })
}

export function stopServer() {
  serverProcess?.kill()
}
`,

  'src/preload/index.ts': `import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('electron', {
  openPDF: (filePath: string) => ipcRenderer.invoke('open-pdf', filePath),
  getAppVersion: () => ipcRenderer.invoke('get-app-version'),
})
`,

  'src/renderer/index.html': `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Southern Greenhouse</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`,

  'src/renderer/src/styles/globals.css': `:root {
  --bg-main: #0a0f1e;
  --bg-surface: #111827;
  --bg-sidebar: #0d1117;
  --primary: #10b981;
  --primary-dark: #059669;
  --accent: #6366f1;
  --warning: #f59e0b;
  --danger: #ef4444;
  --text-main: #f9fafb;
  --text-muted: #9ca3af;
  --border: rgba(255,255,255,0.1);
  --shadow: 0 4px 24px rgba(0,0,0,0.4);
}
* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: 'Inter', sans-serif; background-color: var(--bg-main); color: var(--text-main); }
.glass-card { background: rgba(255,255,255,0.05); backdrop-filter: blur(12px); border: 1px solid var(--border); border-radius: 12px; padding: 1.5rem; transition: all 0.2s ease; }
.glass-card:hover { transform: scale(1.01); }
button { cursor: pointer; border: none; outline: none; font-family: inherit; transition: all 0.2s ease; }
.btn-primary { background: var(--primary); color: #fff; padding: 0.5rem 1rem; border-radius: 6px; font-weight: 500; }
.btn-primary:hover { filter: brightness(1.1); }
.form-input { background: rgba(255,255,255,0.05); border: 1px solid var(--border); color: #fff; padding: 0.5rem; border-radius: 6px; width: 100%; margin-top: 0.25rem; font-family: inherit; }
.form-input:focus { outline: 1px solid var(--primary); }
table { width: 100%; border-collapse: collapse; }
th, td { padding: 0.75rem; text-align: left; border-bottom: 1px solid var(--border); }
th { color: var(--text-muted); font-weight: 500; }
.badge { padding: 0.25rem 0.5rem; border-radius: 999px; font-size: 0.75rem; font-weight: 600; }
.badge-active { background: rgba(16,185,129,0.2); color: #10b981; }
.badge-danger { background: rgba(239,68,68,0.2); color: #ef4444; }
.badge-warning { background: rgba(245,158,11,0.2); color: #f59e0b; }
.sidebar-item { display: flex; align-items: center; gap: 0.75rem; padding: 0.75rem 1rem; color: var(--text-muted); text-decoration: none; border-radius: 6px; margin-bottom: 0.25rem; transition: 0.2s; }
.sidebar-item:hover, .sidebar-item.active { background: rgba(16,185,129,0.1); color: var(--primary); }
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.6); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 50; }
.modal-content { background: var(--bg-surface); border: 1px solid var(--border); border-radius: 12px; padding: 2rem; width: 100%; max-width: 500px; box-shadow: var(--shadow); }
`,

  'src/renderer/src/main.tsx': `import React from 'react'
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
`,
  '.env.example': 'VITE_API_URL=http://localhost:3001/api\n',
  '.env': 'VITE_API_URL=http://localhost:3001/api\n'
};

Object.entries(files).forEach(([filepath, content]) => {
  const fullPath = path.join(__dirname, filepath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content, 'utf-8');
  console.log('Created', filepath);
});
