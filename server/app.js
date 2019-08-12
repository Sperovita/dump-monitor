const fs = require('fs');
const path = require('path');
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const port = 8083;

const staticPath = path.join(__dirname, '/public');
const dumpFile = '../dump/dump.html';
let fileFound = false;

app.use(express.static(staticPath));

server.listen(port, () => {
    console.log('Server Initialized on Port ' + port);
});


const dumpUpdateEmit = () => {
    console.log('Dump Changed');
    if (fileFound) {
        io.emit('dumpUpdate', fs.readFileSync(dumpFile, "utf8"));
    } else {
        io.emit('dumpUpdate', 'File Not Found');
    }
}

fs.watchFile(dumpFile, dumpUpdateEmit);

io.on('connection', (socket) => {
    console.log(socket.id + ' connected.');

    try {
        if (fs.existsSync(dumpFile)) {
            fileFound = true;
        }else{
            fileFound = false;
        }
    } catch (err) {
        console.error(err)
        fileFound = false;
    }

    dumpUpdateEmit();

    socket.on('disconnect', function () {
        console.log(socket.id + ' disconnected.');
    });

});