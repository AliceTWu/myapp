'use strict';

import mongoose from 'mongoose'

const Schema = mongoose.Schema;

const userSchema = new Schema({
	id: Number,
	password: String,
	idstr: String
})

const User = mongoose.model('User', userSchema);


export default User
