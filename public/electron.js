const { template } = require('./menu');
const Serial = require('./Serial/SerialPort');
const electron = require('electron');
const app = electron.app;
const Menu = electron.Menu;
const { ipcMain } = require('electron');
const BrowserWindow = electron.BrowserWindow;
const path = require('path');
const isDev = require('electron-is-dev');
const url = require('url');

ipcMain.on('getPorts', (event, arg) => {
    Serial.getPorts()
        .then(res => event.reply('portList', res))
});

ipcMain.on('openPort', (event, arg) => {
    Serial.openPort(arg)
        .then(res => event.reply('openPort', res))
})

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1280,
        height: 800,
        webPreferences: {
            nodeIntegration: true,
            // preload: path.join(__dirname, '../src/preload.js')

        },
        icon: path.join(__dirname, 'assets/icons/png/1024x1024.png')
    });
    mainWindow.loadURL(isDev ? 'http://localhost:3000' :
        url.format({
            pathname: path.join(__dirname, 'index.html'),
            protocol: 'file:',
            slashes: true
        }));


    if (isDev) {
        // Open the DevTools.
        //BrowserWindow.addDevToolsExtension('<location to your react chrome extension>');
        mainWindow.webContents.openDevTools();
    }
    mainWindow.on('closed', () => mainWindow = null);
    mainWindow.webContents.on('did-finish-load', () => {
        module.exports.mainWindow = mainWindow;
    });
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


const menu = Menu.buildFromTemplate(template)
Menu.setApplicationMenu(menu)
