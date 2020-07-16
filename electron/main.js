const { app, BrowserWindow, globalShortcut } = require("electron");
const isDev = require("electron-is-dev");
const path = require("path");
const { create } = require("domain");

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    show: false,
  });
  const startURL = isDev
    ? "http://localhost:3000"
    : `file://${path.join(__dirname, "../build/index.html")}`;

  mainWindow.loadURL(startURL);

  mainWindow.once("ready-to-show", () => mainWindow.show());

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}
app.on("ready", createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.whenReady().then(() => {
  globalShortcut.register("CommandOrControl+J", () => {
    console.log("CommandJ is pressed");
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    } else {
        BrowserWindow.getAllWindows()[0].show()
    }
  });
});
