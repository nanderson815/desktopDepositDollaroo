var SerialPort = require('serialport');
var Readline = SerialPort.parsers.Readline
const Electron = require('../electron');

let port;
var parser = new Readline()

parser.on('data', function (data) {
    Electron.mainWindow.webContents.send('data', data)
});

async function getPorts() {
    let livePorts = await SerialPort.list()
    return livePorts.map(a => a.path);
}

async function openPort(path) {
    port = await new SerialPort(path, 9600);
    port.pipe(parser);
    return `Port ${port.path} is open.`
}

module.exports.getPorts = getPorts;
module.exports.openPort = openPort;