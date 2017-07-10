'use strict';
 
import FrendshipModel from '../../models/v2/friendships'
import UserInfoModel from '../../models/v2/userInfo'
import AddressComponent from '../../prototype/addressComponent'
import formidable from 'formidable'
import dtime from 'time-formater'

class Frendships extends AddressComponent{
	constructor() {
		super();
		this.follow = this.follow.bind(this);
	}
	async follow(req, res, next) {
		if(!req.session.user_id){
			res.send({
				code: '0',
				type: 'error',
				message: '请先登录'
			})
		}
		try{
			const form = new formidable.IncomingForm();
			form.parse(req, async (err, fields, files) => {
				if (err) {
					res.send({
						status: 0,
						type: 'FORM_DATA_ERROR',
						message: '表单信息错误'
					})
					return
				}
				try{
					if(!req.query.id){
						res.send({
							status: 0,
							type: 'error',
							message: '关注信息缺失'
						})
						return
					}
					const users = await UserInfoModel.find({id: req.query.id});
					if(users == null) {
						res.send({
							status: 0,
							type: 'error',
							message: '该用户不存在'
						})
						return
					}
					const newId = await this.getId('friendships_id'),
								friendships = {
									id: newId, 
									source_id: req.session.user_id,
									target_id: req.query.id,
									created_at: dtime().format('YYYY-MM-DD HH:mm:ss')
								}
					FrendshipModel.create(friendships)
					res.send({
						status: 1,
						success: 'success',
						message: '关注成功'
					})
				}catch(err){
					console.log(err);
					res.send({
						status: 0,
						type: 'error',
						message: '服务器异常'
					})
				}
			})
		}catch(err){
			console.log(err)
			res.send({
				code: '0',
				type: 'error',
				message: '请登录'
			})
		}
	}
}

export default new Frendships()