const { app, BrowserWindow, ipcMain } = require("electron");

function createWindow() {
    const win = new BrowserWindow({
        width: 400,
        height: 400,
        minWidth: 400,
        minHeight: 400,
        maxWidth: 500,
        maxHeight: 500,
        resizable: true,
        maximizable: false,
        fullscreenable: false,
        frame: false,
        transparent: true, // Enable transparency for shaped corners if needed
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    win.loadFile("index.html");
}

app.whenReady().then(() => {
    createWindow();

    ipcMain.on('close-app', () => {
        app.quit();
    });
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
});