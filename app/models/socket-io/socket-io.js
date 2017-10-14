let mongooseArduino = require('../mongoose/arduino');
let randomSHA = require('../vendor/random');
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

        socket.on('getSHA', () => {
            /* TODO: Implement */
            let sha1 = randomSHA.makeID();
            socket.emit('newSHA', {
                SHA1: sha1,
            });
        });

        socket.on('sendID', (data) => {

            let ID = data.ID;

            console.log('Received ID ' + ID);

            let savePromise = mongooseArduino.saveArduino(
                mongooseArduino.createNewArduino(ID)
            );
            savePromise
                .then(function(success) {
                    console.log('Saved with success.');
                    socket.emit('IDReceived');
                })
                .catch(function(err) {
                    console.log('Error occurred while saving to the database. Item already present or key violations');
                });

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
