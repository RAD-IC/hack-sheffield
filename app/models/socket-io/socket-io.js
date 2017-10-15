let mongooseArduino = require('../mongoose/arduino');
let randomSHA = require('../vendor/random');
const appRoute = require('../../routes/app.js');
const _ = require('underscore');

exports.start = (server) => {
    /* Starts socket.io to be listening on the specific server */
    let io = require('socket.io').listen(server);

    /* */
    appRoute.setup(io);

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
            console.log("[JOIN] : New listener joined");
            socket.emit('joinSuccess');
        });

        /* TODO: DEPRECATED
        socket.on('getSHA', () => {
            let sha1 = randomSHA.makeID();
            socket.emit('newSHA', {
                SHA1: sha1,
            });
        }); */

        socket.on('sendID', (data) => {

            let ID = data.ID;

            console.log('[POST] : Post ID : ' + ID);

            let savePromise = mongooseArduino.saveArduino(
                mongooseArduino.createNewArduino(ID)
            );

            let resultJSON = {
                'status':'success',
                'ID' : ID,
            };

            savePromise
                .then(function(success) {
                    console.log('[SAVE] : Saved Arduino Schema successfully');
                    resultJSON.status = 'success';
                    socket.emit('IDSave', resultJSON);
                })
                .catch(function(err) {
                    console.log('[ERR] : Error occurred while saving schema to the database. Item already present or key violations');
                    resultJSON.status = 'failure';
                    socket.emit('IDSave', resultJSON);
                });

        });

        socket.on('transferID', (data) => {
            socket.broadcast.emit('readDevice', data);
        });

        socket.on('joinDevice', (data) => {
            let findPromise = mongooseArduino.find({'id' : data.ID});
            findPromise
                .then(function(room) {
                    console.log('[FIND] : Arduino Schema found via Primary Key ' + data.ID + ' in database.');
                    io.sockets.in(data.SHA1).emit('pollWait', data);
                })
                .catch(function(err) {
                    console.log('[ERR] : Arduino Schema with Primary Key ' + data.ID + ' does not exist in database.');
                    io.sockets.in(data.SHA1).emit('joinFailure');
                });
        });

        /* Actually join a room */
        socket.on('joinRoom', (data) => {
            socket.join(data.ID);

            console.log('[JOIN] : New listener joined room with ID ' + data.ID);
            socket.emit('joinRoomSuccess');
        });

        socket.on('broadcastPress', (data) => {
            console.log('[EVNT] : Arduino Pressure Sensor (' + data.ID + ')');
            io.sockets.in(data.ID).emit('arduinoPress');
        });

        socket.on('broadcastButton', (data) => {
            console.log('[EVNT] : Arduino Button (' + data.ID + ')');
            io.sockets.in(data.ID).emit('btnSync')
        });

        socket.on('btnSwitchLog', (data) => {
            console.log('[EVNT] : Arduino Button (' + data.ID + ')');
            io.sockets.in(data.SHA1).emit('btnSyncHash')
        });

        /* TODO: Deprecated
        socket.on('keyMiss', (flightData) => {
            io.sockets.emit('pingNotification', flightData);
        });
        */

        socket.on('leave', (data) => {
            /* TODO: Implement */
            //socket.leave(data);
        });
    })
};
