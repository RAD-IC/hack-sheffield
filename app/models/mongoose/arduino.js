// TODO: Add description

/* ------------------------------------------------------------------------------------------------------------------ */

let mongoose = require('mongoose');
let helper = require('./mongoose');
const co = require('co');

require('dotenv').config();

/* Load the database address from the config file
 * Removes the double quotation mark using replace function
 */

let dbConfig = 'mongodb://' +
    process.env.DB_USER + ':' +
    process.env.DB_PASS + '@' +
    process.env.DB_HOST + ':' +
    process.env.DB_PORT;

let uniqueValidator = require('mongoose-unique-validator');

/* Connect to mongoDB location database */

let Schema = mongoose.Schema;
let arduinoDBName = '/hackathon';
mongoose.Promise = global.Promise;
let arduinoDB = mongoose.createConnection(dbConfig + arduinoDBName);

// TODO: Add validation

/* Handling connection errors */
arduinoDB.on('error', console.error.bind(console, 'Cannot connect to hackathonDB:'));
arduinoDB.once('open', function() {
    console.log('[DBSE] : Hackathon DB Active');
});

let arduinoSchema = new Schema({
    id: {
        type: Number,
        unique: true,
        required: true,
    },

    device: {
        type: Number,
    },
});

/* Plugin that validates unique entries */
arduinoSchema.plugin(uniqueValidator);

/* Pre save function [AUTORUN]
 * Used to initialise fields upon saving
 * */
arduinoSchema.pre('save', function(next) {
    // TODO: Handle checks before invoking next
    // Next can be invoked with an error to make it cascade through
    // i.e. new Error('something went wrong')
    next();
});

/* ------------------------------------------------------------------------------------------------------------------ */

let Arduino = arduinoDB.model('Arduino', arduinoSchema);

/* Creates and returns a new database room
 * Parameters:
 *   name = id
 * Returns:
 *   new Room instance */
exports.createNewArduino = function(newID) {
    return new Arduino({
        id: newID,
    });
};

/* Saves the current Room into the DB
 * Parameters:
 *   user
 * Returns:
 *   Promise */
exports.saveArduino = function(arduino) {
    return helper.saveHelper(arduino);
};

/* Retrieves one Room from the DB
 * Parameters:
 *   Search parameters : { id : 34 }
 * Returns:
 *   Promise */
exports.find = function(p) {
    return helper.findHelper(Arduino, p);
};

/* */
exports.updateArduino = function(arduino, sha1) {
    let query = {
        'device': sha1,
    };

    let cond = {
        'id': arduino.id,
    };

    return helper.updateHelper(Arduino, cond, query);
};

/* Removes a single Room from the DB
 * Parameters:
 *   Search parameters : { id : 34 }
 * Returns:
 *   Promise */
exports.removeArduino = function(p) {
    return helper.removeElem(Arduino, p);
};

/* Export the User model */
exports.arduinoModel = Arduino;

