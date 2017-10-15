/* Routing for app.html file */

const express = require('express');
const router = new express.Router();
const mongooseRoom = require('../models/mongoose/arduino');

let io;

router.setup = (ioInj) => {
    io = ioInj;
};

/* Post handler for /googlemaps */
router.post('/googlemaps', function(req, res) {
    console.log('[index.html] : POST request to /googlemaps');

    /* DEPRECATED */
});

/* Creates a new random ID for the given user
 * TODO: Refactor so that roomID is saved to DB
 * TODO: Refactor so that command can be queued seperately as GET and POST requests */
router.get('/post/:ID', function(req, res) {
    console.log('[index.html] : POST request to /users/roomID');

    res.send(random.makeID());
});

/* Handles returning users connected to a given room on the DB */
router.get('/:roomID/users', function(req, res) {
    console.log('[index.html] : POST request to /' + req.params.roomID + '/users');

    /* DEPRECATED */
});

router.post('/riku', function(req, res) {
    console.log('RIKU WINS ABOVE ALL');

    /* DEPRECATED */
});

router.get('/entryByHash/:hash', function(req, res) {
    let hash = req.params.hash;

    console.log('New hash identity: ' + hash);

    io.sockets.in(hash).emit('initAsyncCommunication');

    res.redirect('/app/:hash');

    /* DEPRECATED */
});

module.exports = router;