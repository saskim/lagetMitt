/**
 * Created with by  User: sonja  Date: 28/12/14  Time: 23:19
 */
'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


/**
 * Team Schema
 */
var TeamSchema = new Schema({
    id: {
        type: String,
        required: true,
        trim: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    gender: {
        type: String,
        required: true,
        trim: true
    },
    created: {
        type: Date,
        default: Date.now
    },
    createdBy: {
        type: String,
        required: false,
        trim: true
    },
    defaultTournament: {
        type: Schema.ObjectId,
        ref: 'Tournament'
    }
    /*user: {
        type: Schema.ObjectId,
        ref: 'User'
    }*/
});

/**
 * Validations
 */
TeamSchema.path('name').validate(function(name) {
    return !!name;
}, 'Lagets navn må fylles ut');

TeamSchema.path('gender').validate(function(gender) {
    return !!gender;
}, 'Kjønn må velges');

/**
 * Statics
 */
/*TeamSchema.statics.load = function(id, cb) {
    this.findOne({
        _id: id
    }).populate('user', 'name username').exec(cb);
};*/

mongoose.model('Team', TeamSchema);

