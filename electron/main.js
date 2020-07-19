const {
  app,
  BrowserWindow,
  globalShortcut,
  Menu,
  ipcMain,
  ipcRenderer,
  screen,
} = require("electron");
//const electronLocalShortcut = require("electron-localshortcut")
const isDev = require("electron-is-dev");
const path = require("path");
const { create } = require("domain");
var Mousetrap = require("mousetrap");

let mainWindow;
let pillWindow;
Menu.setApplicationMenu(null);

function createWindow(textinput) {
  mainWindow = new BrowserWindow({
    //width: 800,
    //height: 1000,
    show: true,
    frame: false,
    movable: true,
    webPreferences: { nodeIntegration: true },
  });

  pillWindow = new BrowserWindow({
    width: 400,
    height: 800,
    frame: true,
    movable: true,
    parent: mainWindow,
    show: false,
    webPreferences: { nodeIntegration: true },
  });
  const startURL = isDev
    ? "http://localhost:3000/"
    : `file://${path.join(__dirname, "../build/index.html")}`;

  const pillURL = isDev
    ? "http://localhost:3000/pill"
    : `file://${path.join(__dirname, "../build/index.html")}`;

  if (textinput == true) {
    console.log("sending message");
    mainWindow.webContents.send("text-input", true);
  }
  mainWindow.loadURL(startURL);
  pillWindow.loadURL(pillURL);

  app.dock.hide();
  mainWindow.once("ready-to-show", () => mainWindow.show());

  mainWindow.webContents.openDevTools();

  mainWindow.resizable = false;
  mainWindow.on("closed", () => {
    mainWindow = null;
  });

  pillWindow.on("close", (e) => {
    e.preventDefault();
    pillWindow.hide();
  });
  // const mousetrap = new Mousetrap(mainWindow);

  // mousetrap.bind("command+shift+k", function () {
  //   console.log("command shift k");
  // });
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
  console.log(mainWindow.isMovable());
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  console.log(width, height);
  globalShortcut.register("CommandOrControl+J", () => {
    console.log("CommandJ is pressed");
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow(false);
    } else {
      mainWindow.setPosition(width - 400, 100);
      mainWindow.show();
      app.dock.hide();
      mainWindow.setAlwaysOnTop(true, "floating");
      mainWindow.setVisibleOnAllWorkspaces(true);
      mainWindow.focus(); // focus the window up front on the active screen
      mainWindow.setVisibleOnAllWorkspaces(false);
      mainWindow.setFullScreenable(false);
      mainWindow.webContents.send("text-input", false);
    }
  });

  globalShortcut.register("CommandOrControl+P", () => {
    console.log("CommandP is pressed");
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow(true);
      mainWindow.webContents.send("text-input", true);
    } else {
      mainWindow.center();
      mainWindow.show();
      mainWindow.setAlwaysOnTop(true, "floating");
      mainWindow.setVisibleOnAllWorkspaces(true);
      mainWindow.focus(); // focus the window up front on the active screen
      mainWindow.setVisibleOnAllWorkspaces(false);
      mainWindow.setFullScreenable(false);
      mainWindow.webContents.send("text-input", true);
    }
  });

  globalShortcut.register("CommandOrControl+E", () => {
    mainWindow.show();
    mainWindow.setAlwaysOnTop(true, "floating");
    mainWindow.setVisibleOnAllWorkspaces(true);
    mainWindow.focus(); // focus the window up front on the active screen
    mainWindow.setVisibleOnAllWorkspaces(false);
    mainWindow.setFullScreenable(false);
    console.log("tab press");
    mainWindow.webContents.send("tabbed", true);
  });

  globalShortcut.register("CommandOrControl+Esc", () => {
    console.log("escaped");
    if (BrowserWindow.getAllWindows().length === 0) {
    } else {
      mainWindow.hide();
      //.hide
      //mainWindow.setSize(400, 100);
      //mainWindow.webContents.send("escaping", true);
      //mainWindow.webContents.send("text-input", false);
    }
  });
});
ipcMain.on("toggle-pill", (event, arg) => {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  console.log(width, height);
  console.log(arg);
  mainWindow.setSize(arg.x, arg.y);
});

ipcMain.on("hide-pill", (event, arg) => {
  mainWindow.hide();
});
