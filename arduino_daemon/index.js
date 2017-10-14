const express = require('express');
const path = require('path');

const serverAddr = 'http://localhost:3002';
const socket = require('socket.io-client')(serverAddr);

/* Defines the application */
let app = express();

app.set('port', 3004);
let server = app.listen(app.get('port'), () => {
    console.log('[Server] : open on port ' + app.get('port'));
});

socket.on('connect', () => {
    console.log('connected!');

    socket.emit('join', {
        name: 'Arduino',
        id: 112233,
    });
});

socket.on('joinSuccess', () => {
    console.log('join ACKed!');

    socket.emit('keyMiss', {
        flightData: null,
    });
});
module.exports = app;
