const { app, BrowserWindow, globalShortcut, Menu, ipcMain } = require("electron");
const isDev = require("electron-is-dev");
const path = require("path");
const { create } = require("domain");


let mainWindow;
let pillWindow; 
Menu.setApplicationMenu(null);



function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 400,
    show: true,
    frame: false,
    movable: true,
    webPreferences: {nodeIntegration: true}
    
  });
  
  pillWindow = new BrowserWindow({
    width: 400, 
    height: 200, 
    frame: true, 
    movable: true, 
    parent: mainWindow,
    show: false, 
    webPreferences: {nodeIntegration: true}
    
  })
  const startURL = isDev
    ? "http://localhost:3000"
    : `file://${path.join(__dirname, "../build/index.html")}`;

  const pillURL = isDev
    ? "http://localhost:3000/pill"
    : `file://${path.join(__dirname, "../build/index.html")}`;

  mainWindow.loadURL(startURL);
  pillWindow.loadURL(pillURL)

  
  app.dock.hide();
  mainWindow.once("ready-to-show", () => mainWindow.show());
  
  mainWindow.webContents.openDevTools();
  mainWindow.resizable = true;
  mainWindow.on("closed", () => {
    mainWindow = null;
  });

  pillWindow.on('close', (e) => {
    e.preventDefault(); 
    pillWindow.hide();
  })
 
 
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
  globalShortcut.register("CommandOrControl+J", () => {
    console.log("CommandJ is pressed");
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    } else {
      // app.dock.hide();
      // mainWindow.setAlwaysOnTop(true, "floating");
      // mainWindow.setVisibleOnAllWorkspaces(true);

      app.dock.hide();
      mainWindow.setAlwaysOnTop(true, "floating");
      mainWindow.setVisibleOnAllWorkspaces(true);
      //mainWindow.setFullScreenable(true);
      mainWindow.setFullScreenable(false);
      //BrowserWindow.getAllWindows()[0].show();
    }
  });
  globalShortcut.register("Esc", () => {
    //app.dock.show();

    //close window with esc
    console.log("escaped");
    if (BrowserWindow.getAllWindows().length === 0) {
      //createWindow();
    } else {
      mainWindow.close();
    }
  });
});

ipcMain.on('toggle-pill', (event, arg) => {
  pillWindow.show();
  pillWindow.webContents.send('task', arg); 
})
