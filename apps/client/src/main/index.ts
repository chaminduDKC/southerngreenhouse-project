import { app, BrowserWindow, ipcMain, shell , Menu} from 'electron'
import path, { join } from 'path'
import { startServer, stopServer } from './serverManager'
import fs from 'fs/promises'

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
    },
    autoHideMenuBar:true,
    
    
  })
  Menu.setApplicationMenu(null);

  mainWindow.webContents.on('before-input-event', (event, input) => {
  if (input.control && input.key.toLowerCase() === 'r') {
    event.preventDefault()
    mainWindow.webContents.reload()
  }

  if(input.shift && input.control && input.key.toLocaleLowerCase() === 'i'){
    event.preventDefault()
    mainWindow.webContents.openDevTools()
  }
})

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  if (!app.isPackaged && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
    
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

ipcMain.handle('save-pdf', async (_event, { type, filename, data }: { type: string; filename: string; data: ArrayBuffer }) => {
  // type = 'quotations' | 'invoices' etc.
  const baseDir = path.join(app.getPath('documents'), 'irriga', type)

  // ensure the folder exists (creates nested dirs if needed)
  await fs.mkdir(baseDir, { recursive: true })

  const filePath = path.join(baseDir, filename)
  await fs.writeFile(filePath, Buffer.from(data))

  return filePath // return so renderer can show "saved to X"
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
