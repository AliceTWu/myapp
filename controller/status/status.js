'use strict';

import formidable from 'formidable'
import dtime from 'time-formater'
import FileModel from "../../models/status/file";
import AddressComponent from '../../prototype/addressComponent'
import config from "../../config/default";
const fs = require('fs');
const path = require('path');


class Status extends AddressComponent{
	constructor(){
		super();
		this.uploadImage = this.uploadImage.bind(this)
	}
	async uploadImage(req, res, next) {
		if(!req.session.user_id) {
			res.send({
				code: 0,
				type: 'error',
				message: '请先登录'
			})
		}
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
			const image = { id, idstr: id.toString(), filetype: 'image', path: form.uploadDir+'/'+newTarget, 
							basename: newTarget, filename: files.file.name, user_id: req.session.user_id, type: fields.type}
			FileModel.create(image);
			
		})
	}
}

export default new Status()