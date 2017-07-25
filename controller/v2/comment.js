"use strict";

import CommentModel from '../../models/v2/comment';
import UserInfoModel from '../../models/v2/userInfo'
import StatusModel from "../../models/v2/status";
import AddressComponent from '../../prototype/addressComponent'
import formidable from 'formidable'
import dtime from 'time-formater'

class Comment extends AddressComponent{
	constructor() {
		super();
		this.create = this.create.bind(this)
	}
	create(req, res) {
		if(!req.session.user_id){
			res.send({
				request: '/comments/create',
				error_code: '21327',
				error: 'Expired login',
				message: '请先登录'
			})
		}
		try{
			const form = new formidable.IncomingForm();
			form.parse(req, async (err, fields, files) => {
				if (err) {
					res.send({
						request: '/comments/create',
						error_code: '10001',
						error: 'System error',
						message: '系统错误'
					})
					return
				}
				if(((!fields.id || !Number(fields.id))&&(!fields.reply_comment_id || !Number(fields.reply_comment_id))) || !fields.comment){
					res.send({
						request: '/comments/create',
						error_code: '10016',
						error: 'Miss required parameter (id,comment)',
						message: '缺失必选参数 (id,comment,reply_comment_id)'
					})
					return
				}
				const {id=-1, comment, comment_ori = 0, reply_comment_id=-1} = fields, 
							user_id = req.session.user_id,
							user = await UserInfoModel.findOne({id: user_id});
				let status = null, reply_comment = null, status_user = {}, newstatus={}, newreply_comment={};
				if(!user){
					res.send({
						request: '/comments/create',
						error_code: '20003',
						error: 'User does not exists',
						message: '用户不存在'
					})
					return
				};
				if(reply_comment_id !== -1){
					reply_comment = await CommentModel.findOne({id: Number(reply_comment_id)});
					if(!reply_comment){
						res.send({
							request: '/comments/create',
							error_code: '20101',
							error: 'Target comment does not exist	',
							message: '不存在的评论'
						})
						return
					}
					newreply_comment = reply_comment
				}
				if( id !== -1){
					status = await StatusModel.findOne({id});
					if(!status){
						res.send({
							request: '/comments/create',
							error_code: '20101',
							error: 'Target weibo does not exist	',
							message: '不存在的微博'
						})
						return
					}
					status_user = await UserInfoModel.findOne({id: status.user_id});
					newstatus = {
			 				...status._doc,
							user: {...status_user}._doc
				 	};
				 	delete newstatus.user_id;
				}
				const newId = await this.getId('comment_id'),
							newComment = {
								id: newId, idstr: newId.toString(), text: comment,
								status_id: id, 
								created_at: dtime().format('YYYY-MM-DD HH:mm:ss'),
								reply_comment_id, user_id, mid: newId.toString()
							};
				const commentEntity = new CommentModel(newComment), commentSave = await commentEntity.save();
				let commentInfo = {
					...commentSave._doc, 
					user: {...user}._doc,
					status: newstatus,
					reply_comment: newreply_comment
				};
				delete commentInfo.status_id;
				delete commentInfo.user_id;
				delete commentInfo.reply_comment_id;;
				const comments_count = await CommentModel.find({status_id: id==-1?-500:id});
				if(comments_count.length !== 0){
					await StatusModel.update({id: id},{$set:{'comments_count':comments_count.length}})
				}
				res.send({
					...commentInfo
				})
			})
		}catch(err){
			res.send({
				request: '/comments/create',
				error_code: '10003',
				error: 'Remote service error',
				message:'远程服务错误'
			})
		}
	}
}

export default new Comment()