let mongooseRoom = require('../mongoose/rooms');
const _ = require('underscore');

exports.start = (server) => {
    /* Starts socket.io to be listening on the specific server */
    let io = require('socket.io').listen(server);

    /* Listens for 'connection' messages
     * 'connection' messages are issues by front-end socket-io.js via the
     * io.connect() command */
    io.on('connection', function(socket) {
        /* Triggered by joining a new room */
        socket.on('join', (roomID) => {
            socket.room = roomID;
            socket.join(roomID);

            socket.emit('messages', 'thank you for joining ' + roomID);
        });

        socket.on('leave', (data) => {
            socket.leave(data);
        });
    })
};
