import { utilityProcess, app } from 'electron'
import { join, resolve } from 'path'
import { readFileSync } from 'fs'
import { createConnection } from 'net'

let serverProcess: Electron.UtilityProcess | null = null

/** Parse a .env file into a key-value record */
function parseEnvFile(filePath: string): Record<string, string> {
  try {
    const raw = readFileSync(filePath, 'utf-8')
    const out: Record<string, string> = {}
    for (const line of raw.split('\n')) {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith('#')) continue
      const eqIdx = trimmed.indexOf('=')
      if (eqIdx === -1) continue
      const key = trimmed.slice(0, eqIdx).trim()
      const val = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, '')
      if (key) out[key] = val
    }
    return out
  } catch {
    return {}
  }
}

/** Check if something is already listening on the port */
function isPortInUse(port: number): Promise<boolean> {
  return new Promise((resolve) => {
    const socket = createConnection(port, '127.0.0.1')
    socket.on('connect', () => { socket.destroy(); resolve(true) })
    socket.on('error', () => resolve(false))
    socket.setTimeout(500, () => { socket.destroy(); resolve(false) })
  })
}

export async function startServer(): Promise<void> {
  const isDev = !app.isPackaged
  const serverRoot = isDev
    ? resolve(__dirname, '../../../../server')
    : join(process.resourcesPath, 'server')

  const envFromFile = isDev ? parseEnvFile(join(serverRoot, '.env')) : {}
  const port = parseInt(envFromFile['PORT'] || '3001', 10)

  // In dev: if server already running (e.g., started manually), skip forking
  if (isDev && await isPortInUse(port)) {
    console.log(`[ServerManager] Server already running on port ${port} — skipping fork`)
    return
  }

  return new Promise((resolve_fn) => {
    const serverPath = isDev
      ? join(serverRoot, 'src/index.ts')
      : join(serverRoot, 'dist/index.js')

    const execArgv = isDev ? ['--import', 'tsx/esm'] : []

    serverProcess = utilityProcess.fork(serverPath, [], {
      env: {
        ...process.env,
        ...envFromFile,
        PORT: String(port),
        NODE_ENV: isDev ? 'development' : 'production',
      },
      execArgv,
    })

    serverProcess.on('message', (msg: any) => {
      if (msg === 'ready') {
        console.log(`[ServerManager] Express server ready on port ${port}`)
        resolve_fn()
      }
    })

    serverProcess.on('exit', (code) => {
      console.error('[ServerManager] Server process exited with code:', code)
      serverProcess = null
    })

    setTimeout(resolve_fn, 8000)
  })
}

export function stopServer() {
  if (serverProcess) {
    serverProcess.kill()
    serverProcess = null
  }
}
