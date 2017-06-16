'use strict';

import mongoose from 'mongoose'

const Schema = mongoose.Schema;

const usersSchema = new Schema({
	user_name: String,
	password: String,
	id: Number,
	create_time: String,
	admin: {type: String, default: '管理员'},
	status: Number,  //1:普通管理、 2:超级管理员
	avatar: {type: String, default: 'default.jpg'},
	city: String,
})

usersSchema.index({id: 1});

const Users = mongoose.model('Users', usersSchema);


export default Users
