let mongooseRoom = require('../mongoose/rooms');
const _ = require('underscore');

exports.start = (server) => {
    /* Starts socket.io to be listening on the specific server */
    let io = require('socket.io').listen(server);

    /* Listens for 'connection' messages
     * 'connection' messages are issues by front-end socket-io.js via the
     * io.connect() command */
    io.on('connection', function(socket) {

        /*
         * joinInfo structure:
          * {
          * string name;
          * int id;
          * }*/
        socket.on('join', (joinInfo) => {
            /* TODO: Implement */
            console.log("New listener joined");
            socket.emit('joinSuccess');
        });
        /* Triggered by joining a new room */
        socket.on('keyMiss', (flightData) => {
            /* TODO: Do something with flight data */

            /* Ping server :3003 */
            io.sockets.emit('pingNotification', flightData);
        });

        socket.on('leave', (data) => {
            /* TODO: Implement */
            //socket.leave(data);
        });
    })
};
