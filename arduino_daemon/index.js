const express = require('express');
const path = require('path');

//const serverAddr = 'https://sheffield.spina.me:3002';

/* Defines the application */
let app = express();

app.set('port', 3004);
let server = app.listen(app.get('port'), () => {
    console.log('[Server] : open on port ' + app.get('port'));
});

let bodyParser = require('body-parser')
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

app.post('/*', function(req, res) {
    console.log(req.body);
    return res.status(200).end();
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

});


/* Use the following to simulate a button pressure */
// socket.emit('broadcastPress');

module.exports = app;
