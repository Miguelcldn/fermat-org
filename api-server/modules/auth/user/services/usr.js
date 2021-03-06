var mongoose = require('mongoose');
var Dao = require('../../../database/dao');
var devMod = require('../../../repository/developer');
var UsrMdl = require('../models/usr');
var usrSch = require('../schemas/usr');
var UsrPermMdl = require('../models/usrPerm');
var usrPermSch = require('../schemas/usrPerm');
/**
 * [usrDao description]
 * @type {Dao}
 */
var usrDao = new Dao('Usr', usrSch, UsrMdl);
/**
 * [usrPermDao description]
 * @type {Dao}
 */
var usrPermDao = new Dao('UsrPerm', usrPermSch, UsrPermMdl);

/**
 * [insertUsrAndDev description]
 * @param  {[type]}   usr_mdl  [description]
 * @param  {[type]}   dev_mdl  [description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
exports.insertUsrAndDev = function(usr_mdl, dev_mdl, callback) {
    'use strict';
    usrDao.insertSchema(usr_mdl, function(err, usr) {
        callback(err, usr);
    });
    devMod.insOrUpdDev(dev_mdl.usrnm, dev_mdl.email, dev_mdl.name, dev_mdl.bday, dev_mdl.country,
        dev_mdl.avatar_url, dev_mdl.url, dev_mdl.bio,
        function(err, dev) {
            callback(err, dev);
        });
};

exports.insertUsrPerm = function(usrPerm_mdl, callback) {
    'use strict';
    usrPermDao.insertSchema(usrPerm_mdl, function(err, usr) {
        callback(err, usr);
    });
};

/**
 * [findUsrById description]
 * @param  {[type]}   _id      [description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
exports.findUsrById = function(_id, callback) {
    'use strict';
    usrDao.findSchemaById(_id, function(err, usr) {
        callback(err, usr);
    });
};

/**
 * [findUsrByEmail description]
 * @param  {[type]}   email    [description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
exports.findUsrByEmail = function(email, callback) {
    'use strict';
    usrDao.findSchema({
        email: email
    }, function(err, usr) {
        callback(err, usr);
    });
};

/**
 * [findUsrByUsrnm description]
 * @param  {[type]}   usrnm    [description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
exports.findUsrByUsrnm = function(usrnm, callback) {
    'use strict';
    usrDao.findSchema({
        usrnm: usrnm
    }, function(err, usr) {
        callback(err, usr);
    });
};

/**
 * [findUsers description]
 * @param  {[type]}   query    [description]
 * @param  {[type]}   limit    [description]
 * @param  {[type]}   order    [description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
exports.findUsrs = function(query, limit, order, callback) {
    'use strict';
    usrDao.findSchemaLst(query, limit, order, function(err, usr) {
        callback(err, usr);
    });
};
/**
 * [findUsrPerm description]
 * @param  {[type]}   _master_id  [description]
 * @param  {[type]}   _granted_id [description]
 * @param  {Function} callback    [description]
 * @return {[type]}               [description]
 */
exports.findUsrPerm = function(_grantd_id, callback) {
    'use strict';
    usrPermDao.findSchema({
        _grantd_id: _grantd_id
    }, function(err, usr_perm) {
        console.log("usr_perm", usr_perm);
        callback(err, usr_perm);
    });
};
/**
 * [findAllUsers description]
 * @param  {[type]}   query    [description]
 * @param  {[type]}   order    [description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
exports.findAllUsrs = function(query, order, callback) {
    'use strict';
    usrDao.findAllSchemaLst(query, order, function(err, usr) {
        callback(err, usr);
    });
};

/**
 * [updateUsrById description]
 * @param  {[type]}   _id      [description]
 * @param  {[type]}   set      [description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
exports.updateUsrById = function(_id, set, callback) {
    'use strict';
    set.upd_at = new mongoose.Types.ObjectId();
    usrDao.updateSchema({
        _id: _id
    }, set, {}, function(err, usr) {
        callback(err, usr);
    });
};
/**
 * [updateUsrPerm description]
 * @param  {[type]}   _master_id  [description]
 * @param  {[type]}   _granted_id [description]
 * @param  {[type]}   set         [description]
 * @param  {Function} callback    [description]
 * @return {[type]}               [description]
 */
exports.updateUsrPerm = function(_grantd_id, set, callback) {
    'use strict';
    usrPermDao.updateSchema({
        _grantd_id: _grantd_id
    }, set, {}, function(err, usr_perm) {
        callback(err, usr_perm);
    });
};
/**
 * [delAllUsers description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
exports.delAllUsrs = function(callback) {
    'use strict';
    usrDao.delAllSchemas(function(err, usr) {
        callback(err, usr);
    });
};