import { app, BrowserWindow } from "electron";
import serve from "electron-serve";

// Serves the ./out folder to the window in production
const loadProd = serve({ directory: "out" });

const isDev = process.argv.includes("--dev");

if (isDev) process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = "true";

// In dev, Next may still be starting, so keep retrying until it answers
async function loadDev(win) {
  for (let i = 0; i < 120; i++) {
    try {
      await win.loadURL("http://localhost:3000");
      return;
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  }
  console.error("Could not reach http://localhost:3000");
}

async function createWindow() {
  const win = new BrowserWindow({ width: 1000, height: 700, fullscreen: true, autoHideMenuBar: true });

  if (isDev) {
    win.webContents.openDevTools({
      mode: "right",
    });
    await loadDev(win);
  } else {
    await loadProd(win);
  }
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => app.quit());
