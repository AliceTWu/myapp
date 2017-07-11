'use strict';

import mongoose from 'mongoose'

const Schema = mongoose.Schema;

const userInfoSchema = new Schema({
	id: Number,
	screen_name: String,
	name: {type: String, default: ''},
	province: Number,
	city: Number,
	location: {type: String, default: ''},
	description: {type: String, default: ''},
	url: {type: String, default: ''},
	profile_image_url: {type: String, default: 'default.jpg'},
	profile_url:{type: String, default: ''},
	domain: {type: String, default: ''},
	weihao: {type: String, default: ''},
	gender: {type: String, default: 'n'},
	followers_count: {type: Number, default: 0},//粉丝数
	friends_count: {type: Number, default: 0},//关注数
	statuses_count: {type: Number, default: 0},//微博数
	favourites_count: {type: Number, default: 0},//收藏数
	created_at: String,
	allow_all_act_msg: {type: Boolean, default: true},
	geo_enabled: {type: Boolean, default: true},
	verified: {type: Boolean, default: false},
	remark: {type: String, default: ''},
	allow_all_comment: {type: Boolean, default: true},
	avatar_large: {type: String, default: 'default.jpg'},
	avatar_hd: {type: String, default: 'default.jpg'},
	verified_reason: {type: String, default: ''},
	online_status: {type: Number, default: 0},
	bi_followers_count: {type: Number, default: 0},
	register_time: {type: String, default: ''}
}) 

userInfoSchema.index({id: 1});
const UserInfo = mongoose.model('UserInfo', userInfoSchema);


export default UserInfo
