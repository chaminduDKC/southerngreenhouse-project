"use strict";
const electron = require("electron");
electron.contextBridge.exposeInMainWorld("electronAPI", {
  savePDF: (type, filename, data) => electron.ipcRenderer.invoke("save-pdf", { type, filename, data })
});
