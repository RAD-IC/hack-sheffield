// TODO: Add description

/* ------------------------------------------------------------------------------------------------------------------ */

let mongoose = require('mongoose');
let helper = require('./mongoose');
const co = require('co');

/* Load the database address from the config file
 * Removes the double quotation mark using replace function
 */
let config = require('config');
let dbConfig = JSON.stringify(config.get('dbConfig').host).replace(/\"/g, '');

let uniqueValidator = require('mongoose-unique-validator');

/* Connect to mongoDB location database */

let Schema = mongoose.Schema;
let roomsDBName = '/hackathon';
mongoose.Promise = global.Promise;
let roomsDB = mongoose.createConnection(dbConfig + roomsDBName);

// TODO: Add validation

/* Handling connection errors */
roomsDB.on('error', console.error.bind(console, 'Cannot connect to hackathonDB:'));
roomsDB.once('open', function() {
    console.log('Hackathon DB Active');
});

let roomsSchema = new Schema({
    id: {
        type: String,
        unique: true,
        required: true,
    },

    users: {
        type: Array,
        default: [],
    },
});

/* Plugin that validates unique entries */
roomsSchema.plugin(uniqueValidator);

/* Pre save function [AUTORUN]
 * Used to initialise fields upon saving
 * */
roomsSchema.pre('save', function(next) {
    // TODO: Handle checks before invoking next
    // Next can be invoked with an error to make it cascade through
    // i.e. new Error('something went wrong')
    next();
});

/* ------------------------------------------------------------------------------------------------------------------ */

let Room = roomsDB.model('Room', roomsSchema);

/* Creates and returns a new database room
 * Parameters:
 *   name = id
 * Returns:
 *   new Room instance */
exports.createNewRoom = function(name) {
    return new Room({
        id: name,
    });
};

/* Saves the current Room into the DB
 * Parameters:
 *   user
 * Returns:
 *   Promise */
exports.saveRoom = function(room) {
    return helper.saveHelper(room);
};

/* Retrieves one Room from the DB
 * Parameters:
 *   Search parameters : { id : 34 }
 * Returns:
 *   Promise */
exports.find = function(p) {
    return helper.findHelper(Room, p);
};

/* Removes a single Room from the DB
 * Parameters:
 *   Search parameters : { id : 34 }
 * Returns:
 *   Promise */
exports.removeRoom = function(p) {
    return helper.removeElem(Room, p);
};

exports.addUser = function(room, user) {
    let query = {
        'users': {
            'lat': user.lat,
            'lng': user.lng,
            'username': user.username,
            'radius': user.radius,
            'color': user.color,
        }};

    let cond = {
        'id': room.id,
    };

    return helper.addHelper(Room, cond, query);
};

exports.updateUser = function(room, user) {
    let query = {
        'users.$.lat': user.lat,
        'users.$.lng': user.lng,
        'users.$.radius': user.radius,
    };

    let cond = {
        'id': room.id,
        'users.username': user.username,
    };

    return helper.updateHelper(Room, cond, query);
};

exports.deleteUser = function(room, username) {
    return Room.update({_id: room._id}, {$pull: {users: {username: username}}});
};

exports.changeUserColour = function(room, username, color) {
    let query = {
        'users.$.color': color,
    };

    let cond = {
        'id': room.id,
        'users.username': username,
    };

    return helper.updateHelper(Room, cond, query);
};

exports.updateRoom = function(room, results) {
    let query = {
        'results': results,
    };

    let cond = {
        'id': room.id,
    };

    return helper.updateHelper(Room, cond, query);
};

exports.updateGuestNumber = function(room) {
    let increasedNumber = room.guestNumber + 1;

    let query = {
        'guestNumber': increasedNumber,
    };

    let cond = {
        'id': room.id,
    };

    return helper.updateHelper(Room, cond, query);
};


exports.updateOptions = function(room, options) {
    /* Parse the JSON array into a database array */
    let parsed = JSON.parse(options.types);
    let arr = [];
    for(let x in parsed) {
        arr.push(parsed[x]);
    }

    options.types = arr;

    let query = {
        'types': options.types,
        'duration': options.duration,
        'date': options.date,
    };

    let cond = {
        'id': room.id,
    };

    return helper.updateHelper(Room, cond, query);
};

exports.updateMessage = function(roomID, m) {
    let query = {
        'messages': m,
    };
    let cond = {
        'id': roomID,
    };
    return helper.updateHelper(Room, cond, query);
};

/* Export the User model */
exports.roomModel = Room;

