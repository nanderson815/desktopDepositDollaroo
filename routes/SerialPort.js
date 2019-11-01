var SerialPort = require('serialport');
var port = new SerialPort('COM4', 9600);
var Readline = SerialPort.parsers.Readline

// list serial ports:
SerialPort.list()
    .then((ports) => {
        console.log(ports)
    })
    .catch((err) => {
        console.log(err)
    })


console.log("running...")

let report = []

var parser = new Readline()
port.pipe(parser)
parser.on('data', function (data) {
    console.log(data);
    report.push(data);
    console.log(report);
});




module.exports = function (app) {
    app.get('/deposit', (req, res) => res.send(report));
}