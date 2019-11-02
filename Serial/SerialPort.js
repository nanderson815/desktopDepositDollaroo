var SerialPort = require('serialport');
var port = new SerialPort('COM4', 9600);
var Readline = SerialPort.parsers.Readline

let report = []
let livePorts;

SerialPort.list()
    .then((ports) => {
        livePorts = ports
    })
    .catch(err => err)

const refreshPorts = async () => {

}



var parser = new Readline()
port.pipe(parser)
parser.on('data', function (data) {
    console.log(data);
    report.push(data);
});

const listPorts = () => {
    return livePorts
}

async function getPorts() {
    livePorts = await SerialPort.list()
    return livePorts;
}

module.exports.getPorts = getPorts;