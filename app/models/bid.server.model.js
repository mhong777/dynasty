'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Bid Schema
 */
var BidSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Bid name',
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
    ownerName:{
        type: String  
    },
    player:{
        type: Schema.ObjectId,
        ref: 'Player',
        default: null
    },
    playerName:{
        type: String  
    },
    amount:{
        type: Number,
        default: 0
    },
    status:{
        type: Number,
        default: 0
    },
    indexNum:{
        type: Number,
        default: 0
    },
    nomStatus:{
        type: Boolean,
        default: false
    },
    nomOwner:{
        type: Schema.ObjectId,
        ref: 'Owner',
        default: null
    },
    rookieDraft:{
        type: Boolean,
        default: false
    },
    auctionDraft:{
        type: Boolean,
        default: true
    },
    snakeDraft:{
        type: Boolean,
        default: false
    },
    rookieDraftIndex:{
        type: Number,
        default: 0
    },
    rookieNomOwner:{
        type: Schema.ObjectId,
        ref: 'Owner',
        default: null        
    },
    snakeDraftIndex:{
        type: Number,
        default: 0
    },
    snakeNomOwner:{
        type: Schema.ObjectId,
        ref: 'Owner',
        default: null        
    },
    endAuction:{
        type: Boolean,
        default: false
    },
    endSnake:{
        type: Boolean,
        default: false
    }
});

mongoose.model('Bid', BidSchema);