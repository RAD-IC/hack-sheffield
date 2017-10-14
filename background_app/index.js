const express = require('express');
const notifier = require('node-notifier');
const path = require('path');

const serverAddr = 'http://localhost:3002';
const socket = require('socket.io-client')(serverAddr);

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

/* */
socket.on('connect', () => {
    console.log('connected!');
});

/* */
socket.on('pingNotification', () => {
    console.log('Ping received');
});


module.exports = app;
