'use strict';

import mongoose from 'mongoose'

const Schema = mongoose.Schema;

const friendshipSchema = new Schema({
	id: Number,
	idstr: String,
	source_id: Number,
	target_id: Number,
	created_at: String
})

const Friendship = mongoose.model('Friendship', friendshipSchema);


export default Friendship
