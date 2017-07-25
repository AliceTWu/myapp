 'use strict';

import mongoose from 'mongoose'

const Schema = mongoose.Schema;

const commentSchema = new Schema({
	id: {type: Number, isRequired: true},
	idstr: String,
	status_id: {type: Number, default: -1},
	text: {type: String, isRequired: true},
	created_at: {type: String, default: ''},
	reply_comment_id: {type: Number, default: -1},
	user_id: {type: Number, isRequired: true},
	mid: String
})

const Comment = mongoose.model('Comment', commentSchema);


export default Comment
