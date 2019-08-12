const fs = require('fs');
const path = require('path');
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const port = 8083;

const staticPath = path.join(__dirname, '/public');
const dumpFile = '../dump/dump.html';

app.use(express.static(staticPath));

server.listen(port, () => {
    console.log('Server Initialized on Port ' + port);
});

io.on('connection', (socket) => {
    console.log(socket.id + ' connected.');
    

    const dumpWatcher = (curr, prev) => {
        console.log('Dump Changed');
        io.to(socket.id).emit('dumpUpdate', fs.readFileSync(dumpFile, "utf8"));
    };

    io.to(socket.id).emit('dumpUpdate', fs.readFileSync(dumpFile, "utf8"));
    
    fs.watchFile(dumpFile, dumpWatcher);

    socket.on('disconnect', function () {
        fs.unwatchFile(dumpFile, dumpWatcher);
        console.log(socket.id + ' disconnected.');
    });

});