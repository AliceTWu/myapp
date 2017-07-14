'use strict';
 
import FriendshipModel from '../../models/v2/friendships'
import UserInfoModel from '../../models/v2/userInfo'
import StatusModel from "../../models/v2/status";
import AddressComponent from '../../prototype/addressComponent'
import formidable from 'formidable'
import dtime from 'time-formater'

class Frendships extends AddressComponent{
	constructor() {
		super();
		this.follow = this.follow.bind(this);
		this.followers = this.followers.bind(this);
		this.friends = this.friends.bind(this);
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
							message: '关注用户信息缺失'
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
								},
								FrendshipEntity = new FriendshipModel(friendships),
								FrendshipInfo = await FrendshipEntity.save();
					const followers = await FriendshipModel.find({target_id: FrendshipInfo.target_id}),//粉丝数
								friends = await FriendshipModel.find({source_id: FrendshipInfo.source_id}),//关注数
								target_info = await UserInfoModel.update({id: FrendshipInfo.target_id}, {$set: {'followers_count': followers.length}}),
								source_info = await UserInfoModel.update({id: FrendshipInfo.source_id}, {$set:{'friends_count': friends.length}});
					// res.io.on('connection', function(socket) {
			  //       socket.emit('news', {//传给客户端消息 
			  //           hello: 'world123456'  
			  //       });
			  //       socket.on('my other event', function(data) {//传给服务端消息
			  //           console.log(data);
			  //           if(data.my == 1) {
			  //           	socket.emit('news', {//传给客户端消息 
					// 	            hello: 'world'+ data.my 
					// 	        }); 
			  //           } else {
			  //           	socket.emit('news', {//传给客户端消息 
					// 	            hello: '消息错误'
					// 	        });
			  //           }
			  //       });  
			  //   });  
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
				message: '异常，请重新尝试'
			})
		}
	}
	async unfollow(req, res, next) {
		if(!req.session.user_id){
			res.send({
				code: '0',
				type: 'error',
				message: '请先登录'
			})
		}
		try{
			if(!req.query.id){
				res.send({
					status: 0,
					type: 'error',
					message: '关注用户信息缺失'
				})
			}
			const users = await UserInfoModel.find({id: req.query.id});
			if(users == null) {
				res.send({
					status: 0,
					type: 'error',
					message: '该用户不存在'
				})
			}
			const source_id = req.session.user_id, target_id = req.query.id,
						friendships = {
							source_id: source_id,
							target_id: target_id
						},
						FrendshipInfo = await FriendshipModel.remove(friendships);
			const followers = await FriendshipModel.find({target_id: target_id}),//粉丝数
		 			friends = await FriendshipModel.find({source_id: source_id}),//关注数
		 			target_info = await UserInfoModel.update({id: target_id}, {$set: {'followers_count': followers.length}}),
					source_info = await UserInfoModel.update({id: source_id}, {$set:{'friends_count': friends.length}});
			res.send({
				status: 1,
				type: 'success',
				message: '取消关注成功'
			})
		}catch(err){
			console.log(err)
			res.send({
				code: '0',
				type: 'error',
				message: '异常，请重新尝试'
			})
		}
	}
	async friends(req, res, next) {
		if(!req.session.user_id){
			res.send({
				code: '0',
				type: 'error',
				message: '请先登录'
			})
			return 
		}
		try{
			if(!req.query.uid){
				res.send({
					code: '0',
					type: 'error',
					message: '信息不完整'
				})
				return 
			}
			const {count = 5, page = 1, source_id = req.query.uid} = req.query,
			      friendships = await FriendshipModel.find({source_id})
			      																	 .skip((page-1)*parseInt(count))
																							 .limit(parseInt(count))
																							 .sort({created_at: 1}),
						total_number = (await FriendshipModel.find({source_id})).length;
			let loadings = [], _this = this;
			loadings = friendships.map((f, i)=>_this.loadStatus(f.target_id));
			Promise.all(loadings).then(users => {
	      res.send({
					code: '1',
					data: {users, total_number},
					message: '查询成功'
				})
	    });
		}catch(err){
			console.log(err)
			res.send({
				code: '0',
				type: 'error',
				message: '异常，请重新尝试'
			})
		}
	}
	async followers(req, res, next) {
		if(!req.session.user_id){
			res.send({
				code: '0',
				type: 'error',
				message: '请先登录'
			})
			return 
		}
		try{
			if(!req.query.uid){
				res.send({
					code: '0',
					type: 'error',
					message: '信息不完整'
				})
				return 
			}
			const {count = 5, page = 1, target_id = req.query.uid} = req.query,
			      friendships = await FriendshipModel.find({target_id})
												      								 .skip((page-1)*parseInt(count))
																							 .limit(parseInt(count))
																							 .sort({created_at: 1}),
						total_number = (await FriendshipModel.find({target_id})).length;
			let loadings = [], _this = this;
			loadings = friendships.map((f, i)=>_this.loadStatus(f.source_id));
			Promise.all(loadings).then(users => {
	      res.send({
					code: '1',
					data: {users, total_number},
					message: '查询成功'
				})
	    });
		}catch(err){
			console.log(err)
			res.send({
				code: '0',
				type: 'error',
				message: '异常，请重新尝试'
			})
		}
	}
	
}

export default new Frendships()