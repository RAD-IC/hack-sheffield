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
//const socket = io.connect('http://sheffield.spina.me:3002', {reconnect: true});

//const socket = require('socket.io-client')('http://52.90.210.61:3002');

const remoteServer = 'spina.me:3002';
const socket = io.connect(remoteServer);

// const socket = require('socket.io-client')(serverAddr);

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
