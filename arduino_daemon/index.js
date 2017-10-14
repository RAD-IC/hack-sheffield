const express = require('express');
const path = require('path');

//const serverAddr = 'https://sheffield.spina.me:3002';

/* Defines the application */
let app = express();

app.set('port', 3004);
let server = app.listen(app.get('port'), () => {
    console.log('[Server] : open on port ' + app.get('port'));
});

const io = require('socket.io-client');
const remoteServer = 'https://sheffield.spina.me';
const socket = io.connect(remoteServer);

// const socket = require('socket.io-client')(serverAddr);

let ID = 1332221;

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

    /* Join room */
    socket.emit('joinRoom', data);
});

socket.on('joinRoomSuccess', () => {
    socket.emit('broadcastPress');
});


/* Use the following to simulate a button pressure */
// socket.emit('broadcastPress');

module.exports = app;
