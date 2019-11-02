const Serial = require('./Serial/SerialPort');

const electron = require('electron');
const app = electron.app;
const { ipcMain } = require('electron')
const BrowserWindow = electron.BrowserWindow;
const url = require('url')
const path = require('path');
const isDev = require('electron-is-dev');

ipcMain.on('getPorts', (event, arg) => {
    Serial.getPorts()
        .then(res => event.reply('portList', res))
})

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1280,
        height: 800,
        webPreferences: {
            nodeIntegration: false,
            preload: path.join(__dirname, '/src/preload.js')
        }
    });
    mainWindow.loadURL(
        process.env.ELECTRON_START_URL ||
        url.format({
            pathname: path.join(__dirname, '/public/index.html'),
            protocol: 'file:',
            slashes: true
        })
    )
    if (isDev) {
        // Open the DevTools.
        //BrowserWindow.addDevToolsExtension('<location to your react chrome extension>');
        mainWindow.webContents.openDevTools();
    }
    mainWindow.on('closed', () => mainWindow = null);
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow();
    }
});