const express = require('express');
const indexRoute = require('./app/routes/index');
const appRoute = require('./app/routes/app');
const path = require('path');
const socket = require('./app/models/socket-io/socket-io');

/* Defines the application */
let app = express();

/* Body Parser for JSON format variables
 * Access the variable via the *.body field */

/* Set the URI here */
app.use(express.static(path.join(__dirname, '/app/views')));
app.use(appRoute);

/* Default routing. Keep at the end */
app.use(indexRoute);

/* Sets the server to port 3000.
 * Opens port 3000 to listen for connections
 * Otherwise use heroku provided port */
app.set('port', 3002);
let server = app.listen(app.get('port'), () => {
    console.log('[Server] : open on port ' + app.get('port'));
});

socket.start(server);

module.exports = app;
