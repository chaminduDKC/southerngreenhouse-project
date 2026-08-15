// import { contextBridge, ipcRenderer } from 'electron'

// contextBridge.exposeInMainWorld('electron', {
//   openPDF: (filePath: string) => ipcRenderer.invoke('open-pdf', filePath),
//   getAppVersion: () => ipcRenderer.invoke('get-app-version'),
// })

import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('electronAPI', {
  savePDF: (type: string, filename: string, data: ArrayBuffer) =>
    ipcRenderer.invoke('save-pdf', { type, filename, data }),
})