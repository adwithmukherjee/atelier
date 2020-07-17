const { app, BrowserWindow, globalShortcut, Menu } = require("electron");
const isDev = require("electron-is-dev");
const path = require("path");
const { create } = require("domain");

let mainWindow;
Menu.setApplicationMenu(null);
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 200,
    show: false,
    frame: false,
    movable: true,
  });
  const startURL = isDev
    ? "http://localhost:3000"
    : `file://${path.join(__dirname, "../build/index.html")}`;

  mainWindow.loadURL(startURL);

  //app.dock.hide();
  //mainWindow.setAlwaysOnTop(true, "floating");
  //mainWindow.setVisibleOnAllWorkspaces(true);
  //mainWindow.setFullScreenable(true);
  //mainWindow.setFullScreenable(false);
  //mainWindow.setFullScreenable(false);
  app.dock.hide();
  mainWindow.once("ready-to-show", () => mainWindow.show());
  mainWindow.resizable = false;
  mainWindow.on("closed", () => {
    mainWindow = null;
  });
  mainWindow.on("swipe", console.log);
  mainWindow.on("rotate-gesture", (e) => {
    console.log("rotate-gesture");
  });
  // mainWindow.on("swipe", () => {
  //   mainWindow.setFullScreenable(true);
  //   console.log("swiped");
  //   //console.log(e);
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
