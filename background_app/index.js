const express = require('express');
const notifier = require('node-notifier');
const path = require('path');
const exec = require('child_process').exec;

/* Defines the application */
let app = express();

const videos = [
    {
        'message': 'Let \'Em In',
            'url': 'https://youtu.be/re61B8sKQWk?t=32'
    },
    {
        'message': 'I Hear You Knocking',
        'url': 'https://www.youtube.com/watch?v=YTD5_FwdiBU'
    },
    {
        'message': 'Knockin\' on Heaven\'s Door',
        'url': 'https://www.youtube.com/watch?v=riuV6Ity-Jc&feature=youtu.be&t=51'
    },
    {
        'message': 'Knocking At Your Back Door',
        'url': 'https://youtu.be/G7GERh0sQzY?t=105'
    },
    {
        'message': 'Knocking at the Door',
        'url': 'https://youtu.be/vQvp6EghJ18?t=53'
    },
    {
        'message': 'Knock on The Door',
        'url': 'https://youtu.be/4tbiaGBZ8kY?t=29'
    }

]

let getRandomVideo = () => {
    let rand = Math.floor(Math.random() * videos.length);
    return videos[rand];
}

notifier.on('click', function (notifierObject, options) {
    // Triggers if `wait: true` and user clicks notification
});

notifier.on('timeout', function (notifierObject, options) {
    // Triggers if `wait: true` and notification closes
});

app.set('port', 3003);
let server = app.listen(app.get('port'), () => {
    console.log('[Server] : open on port ' + app.get('port'));
});

let SHA1;
let scanStatus = false;
let firstJoin = true;

const io = require('socket.io-client');
const remoteServer = 'https://sheffield.spina.me';
const socket = io.connect(remoteServer);

fs = require('fs');
fs.readFile('.hash', 'utf8', function (err,data) {
    if (err) {
        return console.log(err);
    }
    console.log(data);

    SHA1 = data;
});

/* */
socket.on('connect', () => {
    console.log('connected!');

    socket.emit('joinRoom', {'ID': SHA1});
});

socket.on('joinRoomSuccess', () => {
    if (firstJoin) {
        socket.emit('join');
    }
    firstJoin = false;
});

/* */
socket.on('readDevice', (data) => {
    console.log('join Acknowledged with ID ' + data.ID + ' and SHA1 ' + SHA1);

    socket.emit('joinDevice', {'ID': data.ID, 'SHA1' : SHA1});
});

/* Call the following to attempt to sync with the arduino device */
// socket.emit('joinDevice', {'ID': 112233});

socket.on('joinFailure', () => {
    console.log('No device has been found with the given ID');
});

socket.on('pollWait', (data) => {
    console.log('Please press the devices button');

    /* Join room */
    socket.emit('joinRoom', data);
});

socket.on('btnSync', (data) => {
    console.log('Button has been synched');

    scanStatus = true;

    socket.emit('btnSwitchLog', {'SHA1' : SHA1});
});

/* Will only be broadcast to a joined room */
socket.on('arduinoPress', () => {
    console.log('Arduino press');

    if (scanStatus) {
        console.log('Device successfully connected');
        // Shuffle the video
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

        exec('../playAudio/audio ../playAudio/ding.wav',
          function (error, stdout, stderr) {
            console.log('stdout: ' + stdout);
            console.log('stderr: ' + stderr);
            if (error !== null) {
              console.log('exec error: ' + error);
            }
        });
    }
});

/* */
socket.on('initAsyncCommunication', () => {
    console.log('[INIT] : Initialised Communication with Web Browser Application');
});

/* TODO: DEPRECATED
socket.on('pingNotification', () => {
    console.log('Ping received');
});
*/


module.exports = app;
