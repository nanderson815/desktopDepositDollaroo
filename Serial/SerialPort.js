var SerialPort = require('serialport');
var port = new SerialPort('COM4', 9600);
var Readline = SerialPort.parsers.Readline

let report = []

var parser = new Readline()
port.pipe(parser)
parser.on('data', function (data) {
    console.log(data);
    report.push(data);
});


async function getPorts() {
    let livePorts = await SerialPort.list()
    return livePorts.map(a => a.path);
}

module.exports.getPorts = getPorts;