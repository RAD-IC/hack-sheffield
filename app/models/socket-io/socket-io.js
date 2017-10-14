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

            let resultJSON = {
                'status':'success',
                'ID' : ID,
            };

            savePromise
                .then(function(success) {
                    console.log('Saved with success.');
                    resultJSON.status = 'success';
                    socket.emit('IDSave', resultJSON);
                })
                .catch(function(err) {
                    console.log('Error occurred while saving to the database. Item already present or key violations');
                    resultJSON.status = 'failure';
                    socket.emit('IDSave', resultJSON);
                });

        });

        socket.on('joinDevice', (data) => {
            let findPromise = mongooseArduino.find({'id' : data.ID});
            findPromise
                .then(function(room) {
                    console.log('Device ' + data.ID + ' exists in database.');
                    socket.emit('pollWait', data);
                })
                .catch(function(err) {
                    console.log('Device ' + data.ID + ' does not exist in database.');
                    socket.emit('joinFailure');
                });
        });

        /* Actually join a room */
        socket.on('joinRoom', (data) => {
            socket.join(data.ID);

            console.log('Listener joined room: ' + data.ID);
            socket.emit('joinRoomSuccess');
        });

        socket.on('broadcastPress', () => {
            io.sockets.in().emit('arduinoPress');
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
