const express = require('express');
const notifier = require('node-notifier');
const path = require('path');

/* Defines the application */
let app = express();

const videos = [
    {
        'message': 'Let \'Em In',
            'url': 'https://www.youtube.com/watch?v=re61B8sKQWk'
    },
    {
        'message': 'I Hear You Knocking',
        'url': 'https://www.youtube.com/watch?v=YTD5_FwdiBU'
    },
    {
        'message': 'Knockin\' on Heaven\'s Door',
        'url': 'https://www.youtube.com/watch?v=riuV6Ity-Jc&feature=youtu.be&t=51'
    }
]

let getRandomVideo = () => {
    let rand = Math.floor(Math.random() * videos.length);
    return videos[rand];
}

let {message, url} = getRandomVideo();

notifier.notify({
    title: 'Someone is knocking on your door!',
    message: message,
    sound: true, // Only Notification Center or Windows Toasters
    wait: true, // Wait with callback, until user action is taken against notification
    open: url,
}, function (err, response) {
    // Response is response from notification
});

notifier.on('click', function (notifierObject, options) {
    // Triggers if `wait: true` and user clicks notification
});

notifier.on('timeout', function (notifierObject, options) {
    // Triggers if `wait: true` and notification closes
    // Shuffle the video
    message, url = getRandomVideo();
});

app.set('port', 3003);
let server = app.listen(app.get('port'), () => {
    console.log('[Server] : open on port ' + app.get('port'));
});

let SHA1;
let scanStatus = false;

const io = require('socket.io-client');
const remoteServer = 'https://sheffield.spina.me';
const socket = io.connect(remoteServer);

/* */
socket.on('connect', () => {
    console.log('connected!');

    socket.emit('join');
});

/* */
socket.on('joinSuccess', () => {
    console.log('join ACKed!');

    socket.emit('getSHA');
});

/* */
socket.on('newSHA', (data) => {
    SHA1 = data.SHA1;
    console.log('SHA1 received ' + SHA1);

    socket.emit('joinDevice', {'ID': 112233});
});

/* Call the following to attempt to sync with the arduino device */
// socket.emit('joinDevice', {'ID': 112233});

socket.on('joinFailure', () => {
    console.log('No device has been found with the given ID');
});

socket.on('pollWait', (data) => {
    console.log('Please press the devices button');

    scanStatus = true;

    /* Join room */
    socket.emit('joinRoom', data);
});

/* Will only be broadcast to a joined room */
socket.on('arduinoPress', () => {
    if (scanStatus) {
        console.log('Device successfully connected');
    }
});

/* */
socket.on('pingNotification', () => {
    console.log('Ping received');
});


module.exports = app;
