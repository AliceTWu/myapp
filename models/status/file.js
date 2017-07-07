'use strict';

import mongoose from 'mongoose'

const Schema = mongoose.Schema;

const fileSchema = new Schema({
	id: Number,
	idstr: String,
	filetype: String,
	path: String,
	basename: String,
	filename: String,
	user_id: Number,
	type: String
})

const File= mongoose.model('file', fileSchema);


export default File
