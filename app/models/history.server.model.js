'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * History Schema
 */
var HistorySchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill History name',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	},
    owner:{
        type: Schema.ObjectId,
        ref: 'Owner',
        default: null
    },
    player:{
        type: Schema.ObjectId,
        ref: 'Player',
        default: null
    },
    amount:{
        type: Number,
        default: 0
    }    
});

mongoose.model('History', HistorySchema);