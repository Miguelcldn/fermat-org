var mongoose = require('mongoose');

/**
 * [CompDevMdl description]
 *
 * @method CompDevMdl
 *
 * @param  {[type]}   _dev_id  [description]
 * @param  {[type]}   _comp_id [description]
 * @param  {[type]}   role     [description]
 * @param  {[type]}   scope    [description]
 * @param  {[type]}   percnt   [description]
 */
function CompDevMdl(_dev_id, _comp_id, role, scope, percnt) {
    // always initialize all instance properties
    this._dev_id = null;
    this._comp_id = null;
    this.role = role;
    this.scope = scope;
    this.percnt = percnt;
    this.upd_at = new mongoose.Types.ObjectId();
}

/**
 * [init description]
 *
 * @method init
 *
 * @param  {[type]} compDevSchema [description]
 *
 * @return {[type]} [description]
 */
CompDevMdl.prototype.init = function(compDevSchema) {
    this._id = devSchema._id;
    this._dev_id = compDevSchema._dev_id;
    this._comp_id = compDevSchema._comp_id;
    this.role = compDevSchema.role;
    this.scope = compDevSchema.scope;
    this.percnt = compDevSchema.percnt;
    this.upd_at = compDevSchema.upd_at;
};

/**
 * [setUpdate description]
 *
 * @method setUpdate
 */
CompDevMdl.prototype.setUpdate = function() {
    this.upd_at = new mongoose.Types.ObjectId();
};

// export the class
module.exports = CompDevMdl;