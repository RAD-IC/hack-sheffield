/* Routing for app.html file */

const express = require('express');
const router = new express.Router();
const mongooseRoom = require('../models/mongoose/arduino');

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

module.exports = router;