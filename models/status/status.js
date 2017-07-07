'use strict';

import mongoose from 'mongoose'

const Schema = mongoose.Schema;

const statusSchema = new Schema({
	id: Number,
	idstr: String,
	created_at: String,
	mid: Number,
	text: String,
	source: String,
	favorited: {type: Boolean, default: false},
	truncated: {type: Boolean, default: false},
	thumbnail_pic: {type: String, default: ''},
	bmiddle_pic: {type: String, default: ''},
	original_pic: {type: String, default: ''},
	geo:[{
		longitude: {type: String, default: ''}
	}]
})

const Status= mongoose.model('status', statusSchema);


export default Status
