/* Mongoose generic helper functions */

/* ------------------------------------------------------------------------------------------------------------------ */
/* Saves the current Element onto the DB
 * Parameters:
 *   elem
 * Returns:
 *   Promise */
exports.saveHelper = function(elem) {
    return elem.save(function(err) {
        if (err) console.log('[DBSE] save : error');
        else console.log('[DBSE] save : success');
    });
};

/* Retrieves one Elem from the DB
 * Parameters:
 *   Search parameters : { name : 'Anne' }
 * Returns:
 *   Promise */
exports.findHelper = function(DB, p) {
    return DB.findOne(p, function(err, obj) {
        if (err) console.log('[DBSE] find : error');
        return obj;
    }).then(function(elem) {
        if (!elem) {
            console.log('[DBSE] find : error');
            throw new Error('Error while finding within DBSE. Possibly entry not present.');
        } else {
            console.log('[DBSE] find : success');
            return elem;
        }
    });
};

/* Retrieves multiple Elements from the DB
 * Parameters:
 *   Search parameters : { name : 'Anne' }
 * Returns:
 *   Promise */
exports.findMultipleHelper = function(DB, p) {
    return DB.find(p, function(err, obj) {
        if (err) console.log('[DBSE] find : error');
        return obj;
    }).then(function(elems) {
        if (!elems.length) {
            console.log('[DBSE] find : error');
            throw new Error('Error while finding within database. Possibly entry not present.');
        } else {
            console.log('[DBSE] find : success');
            return elems;
        }
    });
};

/* Removes a single Element from the DB
 * Parameters:
 *   Search parameters : { name : 'Anne' }
 * Returns:
 *   Promise */
exports.removeElem = function(DB, p) {
    return DB.find(p, function(err, obj) {
        if (err) console.log('[DBSE] remove : error');
        return obj;
    }).then(function(elems) {
        if (elems.length) {
            return DB.remove(elems[0], function(err, obj) {
                if (err) console.log('[DBSE] remove : error');
                else {
                    console.log('[DBSE] remove : success');
                    return obj;
                }
            }).then();
        } else{
            console.log('[DBSE] remove : error');
            throw new Error('Error while removing from DBSE. Possibly entry not present');
        }
    });
};

/* Removes multiple Users from the DB
 * Parameters:
 *   Search parameters : { name : 'Anne' }
 * Returns:
 *   Promise */
exports.removeMultipleHelper = function(DB, p) {
    return DB.find(p, function(err, obj) {
        if (err) console.log('[DBSE] remove : error');
        return obj;
    }).then(function(elems) {
        if (elems.length) {
            for (let i = 0; i < elems.length; i++) {
                DB.remove(elems[i], function(err, obj) {
                    if (err) console.log('[DBSE] remove : error');
                    else {
                        console.log('[DBSE] remove : success');
                        return obj;
                    }
                }).then();
            }
        } else {
            console.log('[DBSE] remove : error');
            throw new Error('Error while removing from database. Possibly entry not present');
        }
    });
};

/* */
exports.addHelper = function(DB, cond, query) {
    return DB.findOneAndUpdate(
        cond,
        {$push:
            query,
        },
        {safe: true, upsert: true}
    );
};

exports.updateHelper = function(DB, cond, query) {
    return DB.update(
        cond,
        {$set:
            query,
        },
        {safe: true, upsert: true}
    );
};
