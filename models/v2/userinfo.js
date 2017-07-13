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
	register_time: {type: String, default: ''},
	status: {
			id: Number,
			idstr: String,
			created_at: String,
			mid: Number,//微博MID
			text: String,//微博信息内容
			source: String,//微博来源
			favorited: {type: Boolean, default: false},//是否已收藏，true：是，false：否
			truncated: {type: Boolean, default: false},//是否被截断，true：是，false：否
			thumbnail_pic: {type: String, default: ''},//缩略图片地址，没有时不返回此字段
			bmiddle_pic: {type: String, default: ''},//中等尺寸图片地址，没有时不返回此字段
			original_pic: {type: String, default: ''},//原始图片地址，没有时不返回此字段
			geo:[{
				longitude: {type: String, default: ''},//经度坐标
				latitude: {type: String, default: ''},//维度坐标
				city: Number,
				province: {type: String, default: ''},
				city_name: {type: String, default: ''},//所在城市的城市名称
				province_name: {type: String, default: ''},//所在省份的省份名称
				address: {type: String, default: ''},//所在的实际地址，可以为空
				pinyin: {type: String, default: ''},//地址的汉语拼音，不是所有情况都会返回该字段
				more: {type: String, default: ''},//更多信息，不是所有情况都会返回该字段
			}],
			user_id: Number,
			reposts_count: {type: Number, default: 0},//转发数
			comments_count: {type: Number, default: 0},//	评论数
			attitudes_count: {type: Number, default: 0},//	表态数
			visible: {
				type: {type: Number, default: 0},//0：普通微博，1：私密微博，3：指定分组微博，4：密友微博
				list_id: {type: String, default: ''}//分组的组号
			},
			pic_ids: {type: String, default: ''},//微博配图ID。多图时返回多图ID，用来拼接图片url。用返回字段thumbnail_pic的地址配上该返回字段的图片ID，即可得到多个图片url。
 		}
}) 

userInfoSchema.index({id: 1});
const UserInfo = mongoose.model('UserInfo', userInfoSchema);


export default UserInfo
