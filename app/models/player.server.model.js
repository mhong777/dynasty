'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Player Schema
 */
var PlayerSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Player name',
		trim: true
	},
    price:{
        type: [Number],
        default:0
    },
    available:{
        type: Boolean,
        default:true
    },
    listed:{
        type: Boolean,
        default:false
    },
    unavailable:{
        type: Boolean,
        default:false
    },
    link:{
        type: String,
        default: '',
        trim: true
    },
    team:{
        type: String,
        default: '',
        trim: true          
    },
    position:{
        type: String,
        default: '',
        trim: true          
    },
    byeWeek:{
        type:[Number],
        default:0
    },
    startRank:{
        absRank:{type: [Number], default:0},
        posRank:{type: [Number], default:0}
    },
    endRank:{
        absRank:{type: [Number], default:0},
        posRank:{type: [Number], default:0}
    },
    points:{
        type:[Number],
        default:0
    },
    owner:{
        type: Schema.ObjectId,
        ref: 'Owner'
    },
    ownerId:{
        type:Number  
    },
    contractYear:{
        type: Number,
        default:0
    },
    pIndex:{
        type: Number,
        default:0
    },
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Player', PlayerSchema);

