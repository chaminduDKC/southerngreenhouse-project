"use strict";
const electron = require("electron");
const path = require("path");
const fs = require("fs");
const net = require("net");
const fs$1 = require("fs/promises");
let serverProcess = null;
function parseEnvFile(filePath) {
  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    const out = {};
    for (const line of raw.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eqIdx = trimmed.indexOf("=");
      if (eqIdx === -1) continue;
      const key = trimmed.slice(0, eqIdx).trim();
      const val = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, "");
      if (key) out[key] = val;
    }
    return out;
  } catch {
    return {};
  }
}
function isPortInUse(port) {
  return new Promise((resolve2) => {
    const socket = net.createConnection(port, "127.0.0.1");
    socket.on("connect", () => {
      socket.destroy();
      resolve2(true);
    });
    socket.on("error", () => resolve2(false));
    socket.setTimeout(500, () => {
      socket.destroy();
      resolve2(false);
    });
  });
}
async function startServer() {
  const isDev = !electron.app.isPackaged;
  const serverRoot = isDev ? path.resolve(__dirname, "../../../../server") : path.join(process.resourcesPath, "server");
  const envFromFile = isDev ? parseEnvFile(path.join(serverRoot, ".env")) : {};
  const port = parseInt(envFromFile["PORT"] || "3001", 10);
  if (isDev && await isPortInUse(port)) {
    console.log(`[ServerManager] Server already running on port ${port} — skipping fork`);
    return;
  }
  return new Promise((resolve_fn) => {
    const serverPath = isDev ? path.join(serverRoot, "src/index.ts") : path.join(serverRoot, "dist/index.js");
    const execArgv = isDev ? ["--import", "tsx/esm"] : [];
    serverProcess = electron.utilityProcess.fork(serverPath, [], {
      env: {
        ...process.env,
        ...envFromFile,
        PORT: String(port),
        NODE_ENV: isDev ? "development" : "production"
      },
      execArgv
    });
    serverProcess.on("message", (msg) => {
      if (msg === "ready") {
        console.log(`[ServerManager] Express server ready on port ${port}`);
        resolve_fn();
      }
    });
    serverProcess.on("exit", (code) => {
      console.error("[ServerManager] Server process exited with code:", code);
      serverProcess = null;
    });
    setTimeout(resolve_fn, 8e3);
  });
}
function stopServer() {
  if (serverProcess) {
    serverProcess.kill();
    serverProcess = null;
  }
}
function createWindow() {
  const mainWindow = new electron.BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 1024,
    minHeight: 768,
    show: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, "../preload/index.js")
    },
    autoHideMenuBar: true
  });
  electron.Menu.setApplicationMenu(null);
  mainWindow.webContents.on("before-input-event", (event, input) => {
    if (input.control && input.key.toLowerCase() === "r") {
      event.preventDefault();
      mainWindow.webContents.reload();
    }
    if (input.shift && input.control && input.key.toLocaleLowerCase() === "i") {
      event.preventDefault();
      mainWindow.webContents.openDevTools();
    }
  });
  mainWindow.on("ready-to-show", () => {
    mainWindow.show();
  });
  if (!electron.app.isPackaged && process.env["ELECTRON_RENDERER_URL"]) {
    mainWindow.loadURL(process.env["ELECTRON_RENDERER_URL"]);
  } else {
    mainWindow.loadFile(path.join(__dirname, "../renderer/index.html"));
  }
}
electron.app.setName("Southern Greenhouse");
electron.app.whenReady().then(async () => {
  electron.ipcMain.handle("open-pdf", async (_, filePath) => {
    await electron.shell.openPath(filePath);
  });
  electron.ipcMain.handle("get-app-version", () => {
    return electron.app.getVersion();
  });
  electron.ipcMain.handle("save-pdf", async (_event, { type, filename, data }) => {
    const baseDir = path.join(electron.app.getPath("documents"), "irriga", type);
    await fs$1.mkdir(baseDir, { recursive: true });
    const filePath = path.join(baseDir, filename);
    await fs$1.writeFile(filePath, Buffer.from(data));
    return filePath;
  });
  await startServer();
  createWindow();
  electron.app.on("activate", function() {
    if (electron.BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});
electron.app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    electron.app.quit();
  }
});
electron.app.on("before-quit", () => {
  stopServer();
});
