var mongoose = require('mongoose');

/**
 * [lnkSchema description]
 *
 * @type {[type]}
 */
var lnkSchema = mongoose.Schema({
    _wave_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Wave'
    },
    _chld_nod_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Nod'
    }
    _prnt_nod_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Nod'
    }
    //("server" | "client" | "service" | "actor" | "wallet")
    type: {
        type: String,
        lowercase: true,
        trim: true,
        required: true
    },
    upd_at: {
        type: mongoose.Schema.Types.ObjectId,
        'default': new mongoose.Types.ObjectId()
    }
}, {
    collection: 'lnks'
});

/**
 * [_chld_nod_id description]
 *
 * @type {number}
 */
lnkSchema.index({
    _chld_nod_id: 1,
    _prnt_nod_id: 1,
    _wave_id: 1
}, {
    name: "lnks_cp_indx"
});

module.exports = lnkSchema;