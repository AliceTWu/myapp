'use strict';

import mongoose from 'mongoose'

const Schema = mongoose.Schema;

const usersSchema = new Schema({
	name: String,
	password: String,
	type: String,
	user_id: String
})

//usersSchema.index({id: 1});
console.log(4)
const Users = mongoose.model('Users', usersSchema);


export default Users
