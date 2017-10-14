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

let ID = 1332;

socket.on('connect', () => {
    console.log('connected!');

    socket.emit('join');
});

socket.on('joinSuccess', () => {
    console.log('join ACKed!');

    socket.emit('sendID', {ID: ID});
});

socket.on('IDSave', (data) => {
    let status = data.status;

    console.log('Save Status for ID ' + ID + ' ' + status);
});


module.exports = app;
