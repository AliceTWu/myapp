'use strict';

import formidable from 'formidable'
import dtime from 'time-formater'
// import images from 'node-images'
import FileModel from "../../models/status/file";
import StatusModel from "../../models/v2/status";
import AddressComponent from '../../prototype/addressComponent'
import config from "../../config/default";
const fs = require('fs');
const path = require('path');


class Status extends AddressComponent{
	constructor(){
		super();
		this.uploadImage = this.uploadImage.bind(this);
		this.create = this.create.bind(this);
	}
	async uploadImage(req, res, next) {
		if(!req.session.user_id) {
			res.send({
				code: 0,
				type: 'error',
				message: '请先登录'
			})
		}
		try{
			const form = new formidable.IncomingForm();
			form.uploadDir = config.uploadDir;
			form.keepExtensions = true;
			form.maxFieldsSize = 20 * 1024 * 1024;
			form.parse(req, async (err, fields, files) => {
				if (err) {
					res.send({
						code: 0,
						type: 'error',
						message: '信息错误'
					})
				}
				const oldTarget = path.basename(files.file.path);
				const newTarget = path.basename(files.file.path).split('upload_')[1];
				fs.rename(form.uploadDir+'/'+oldTarget,form.uploadDir+'/'+newTarget, function(err){
					 if(err){
					  throw err;
					 }
				});
				const id = await this.getId('file_id');
				const image = { id, idstr: id.toString(), filetype: 'image', path: form.uploadDir+'/', 
								basename: newTarget, filename: files.file.name, user_id: req.session.user_id, type: fields.type}

				const imageEntity = new FileModel(image);
				const imageInfo = await imageEntity.save();
				res.send({
					code: 1,
					data: {
						fileId: imageInfo.idstr
					},
					message: '上传成功'
				})
			})
		}catch(err){console.log(err)
			res.send({
				code: 0,
				type: 'error',
				message: '服务器异常'
			})
		}
	}
	async create(req, res, next){
		if(!req.session.user_id) {
			res.send({
				code: 0,
				type: 'error',
				message: '请先登录'
			})
		}
		try{
			const form = new formidable.IncomingForm();
			form.parse(req, async (err, fields, files) => {
				const positionInfo = await this.guessPosition(req), id = await this.getId('status_id');
				const status = {
					id: id,
					idstr: id.toString(),
					created_at: dtime().format('YYYY-MM-DD HH:mm:ss'),
					mid: id,
					text: fields.text,
					source: '',
					favorited: false,
					truncated: false,
					geo:[positionInfo],
					user_id: req.session.user_id,
					visible: {
						type: fields.type
					},
					pic_ids: fields.pic_ids
				}
				const statusEntity = new StatusModel(status), statusInfo = await statusEntity.save();
				res.send({
					code: 1,
					data: {
						statusInfo: statusInfo
					},
					message: '微博发布成功'
				})
			})
		}catch(err){
			res.send({
				code: 0,
				type: 'error',
				message: '服务器异常'
			})
		}
	}
	async user_timeline(req, res, next){
		if(!req.session.user_id) {
			res.send({
				code: 0,
				type: 'error',
				message: '请先登录'
			})
		}
		try{
			req.query.count = req.query.count==undefined?20:req.query.count;
			req.query.page = req.query.page==undefined?1:req.query.page;
			const params = {user_id: req.session.user_id},
						dataList = await StatusModel.find(params)
														.skip((req.query.page-1)*parseInt(req.query.count))
														.limit(parseInt(req.query.count))
														.sort({created_at: 1}),
						dataTotal = (await StatusModel.find()).length;
			res.send({
				code: 0,
				data: {
					rows: dataList,
					total: dataTotal
				},
				message: '查询成功'
			})
		}catch(err){
			console.log(err)
			res.send({
				code: 0,
				type: 'error',
				message: '服务器异常'
			})
		}
	}
	async show(req, res, next){
		if(!req.session.user_id) {
			res.send({
				code: 0,
				type: 'error',
				message: '请先登录'
			})
		}
		try{
			if(!req.query.id) {
				res.send({
					code: 0,
					type: 'error',
					message: '缺失微博信息'
				})
			}
			const dataList = await StatusModel.findOne({idstr: req.query.id});
			res.send({
				code: 0,
				data: dataList,
				message: '查询成功'
			})
		}catch(err){
			console.log(err)
			res.send({
				code: 0,
				type: 'error',
				message: '服务器异常'
			})
		}
	}
}

export default new Status()