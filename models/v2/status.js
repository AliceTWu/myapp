'use strict';

import mongoose from 'mongoose'

const Schema = mongoose.Schema;

const statusSchema = new Schema({
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
	ad: {type: String, default: ''},//广告 微博流内的推广微博ID
	
})

const Status= mongoose.model('status', statusSchema);


export default Status
