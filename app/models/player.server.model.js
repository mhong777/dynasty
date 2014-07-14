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

//var nflPlayers=[
//    {name:"player1", available:false, price:1, position:"QB", listed:false, rank:9, contract:1, unavailable:true, index:0},
//    {name:"player2", available:false, price:2, position:"QB", listed:false, rank:8, contract:1, unavailable:true, index:1},
//    {name:"player3", available:false, price:3, position:"RB", listed:false, rank:7, contract:1, unavailable:true, index:2},
//    {name:"player4", available:false, price:4, position:"WR", listed:false, rank:6, contract:1, unavailable:true, index:3},
//    {name:"player5", available:false, price:5, position:"TE", listed:false, rank:5, contract:1, unavailable:true, index:4},
//    {name:"player6", available:false, price:6, position:"D", listed:false, rank:4, contract:1, unavailable:true, index:5},
//    {name:"player7", available:false, price:7, position:"QB", listed:false, rank:3, contract:1, unavailable:true, index:6},
//    {name:"player8", available:false, price:8, position:"QB", listed:false, rank:2, contract:1, unavailable:true, index:7},
//    {name:"player9", available:false, price:9, position:"QB", listed:false, rank:1, contract:1, unavailable:true, index:8}
//];
