export interface ElectronAPI {
  savePDF: (type: string, filename: string, data: ArrayBuffer) => Promise<string>
}

declare global {
  interface Window {
    electronAPI: ElectronAPI
  }
}