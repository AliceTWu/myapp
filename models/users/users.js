'use strict';

import mongoose from 'mongoose'

const Schema = mongoose.Schema;

const usersSchema = new Schema({
	id: Number,
	password: String,
	idstr: String,
	screen_name: String
}) 

const Users = mongoose.model('Users', usersSchema);


export default Users
