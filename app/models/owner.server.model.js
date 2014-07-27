'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Owner Schema
 */
var OwnerSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Owner name',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
    ownerIndex:{
        type: Number,
        default:0
    },
    userIndex:{
        type: String
    },
    cutPlayer:[{type:Schema.ObjectId, ref:'Player'}],
    rank:{
        type:[Number],
        default:0
    },
    totalCap:{
        type:Number,
        default:0
    },
    totalPlayers:{
        type:Number,
        default:0
    },
    paidPlayer:{
      type:[{
          name:{type:String, default:'position'},
          cost:{type:Number, default:0},
          roster:[{type:Schema.ObjectId, ref:'Player'}]
      }]  
    },
    additionalCap:{
        type:Number,
        default:0
    },
    draftPicks:{
        type:[Number]
    },
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Owner', OwnerSchema);


//var teamOwners=[
//    {ownerIndex:0, name:"Mike Hong", 
//     paidPlayer:[
//        {name: "QB", roster:[0,1],cost:3},
//        {name: "RB", roster:[2],cost:3},
//        {name: "WR",roster:[3],cost:4},
//        {name: "TE",roster:[4],cost:5},
//        {name: "D",roster:[5],cost:6}
//        ], cutPlayer:[],rank:[1],totalCap:0, totalPlayers:6
//    },
//    {ownerIndex:1, name:"Mike Ramos", 
//     paidPlayer:[
//        {name: "QB", roster:[6,7,8],cost:24},
//        {name: "RB", roster:[],cost:0},
//        {name: "WR", roster:[],cost:0},
//        {name: "TE", roster:[],cost:0},
//        {name: "D", roster:[],cost:0}
//        ],cutPlayer:[],rank:[2],totalCap:0, totalPlayers:3
//    }
//];
