'use strict';
 
import UsersModel from '../../models/v2/user'
import UserInfoModel from '../../models/v2/userInfo'
import BaseComponent from '../../prototype/baseComponent'
import AddressComponent from '../../prototype/addressComponent'
import crypto from 'crypto'
import formidable from 'formidable'
import dtime from 'time-formater'

class Users extends AddressComponent{
	constructor(){
		super();
		this.signup = this.signup.bind(this);
		this.signin = this.signin.bind(this);
		this.getUserInfo = this.getUserInfo.bind(this);
		this.encryption = this.encryption.bind(this);
		this.checkform = this.checkform.bind(this);
	}
	async getUserInfo(req, res, next){
		try{
			
		}catch(err){
			console.log('查找失败', err)
			res.send({
				status: 0,
				message: '查找失败'
			})
		}
	}

	async signin(req, res, next){
		const form = new formidable.IncomingForm();
		form.parse(req, async (err, fields, files) => {
			if (err) {
				res.send({
					status: 0,
					type: 'FORM_DATA_ERROR',
					message: '表单信息错误'
				})
				return
			};
			try{
				if(!fields.username || !fields.password || !fields.nickname || !fields.province || !fields.city) {
					res.send({
						status: 0,
						type: 'FORM_DATA_ERROR',
						message: '表单信息不能为空'
					})
					return
				}
				const isRepeat = await UsersModel.findOne({idstr: fields.username}),
							screen_name_is_repeat = await UsersModel.find({screen_name: fields.nickname});
				if(isRepeat !== null){
					res.send({
						status: 0,
						data: null,
						message: '该邮箱已注册，请重新填写'
					});
					return;
				}
				if(screen_name_is_repeat !== null) {
					res.send({
						status: 0,
						data: null,
						message: '此昵称已被注册'
					});
					return;
				}
				const user_id = await this.getId('user_id');
				const newUser = {
					idstr: fields.username, 
					password: this.encryption(fields.password),
					id: user_id
				};
				const newUserInfo = {
					id: user_id,
					screen_name: fields.nickname, 
					province: fields.province,
					city: fields.city,
					register_time: dtime().format('YYYY-MM-DD HH:mm:ss')
				}
				UsersModel.create(newUser);
				const createUser = new UserInfoModel(newUserInfo);
				const userinfo = await createUser.save();
				
				res.send({
					status: 1,
					user: userinfo,
					success: '微博注册成功',
				})
			}catch(err){
				console.log(err)
			}
		})
	}
	encryption(password){
		const newpassword = this.Md5(this.Md5(password).substr(2, 7) + this.Md5(password));
		return newpassword
	}
	Md5(password){
		const md5 = crypto.createHash('md5');
		return md5.update(password).digest('base64');
	}
	async checkform(req, res, next){
		const form = new formidable.IncomingForm();
		form.parse(req, async (err, fields, files) => {
			if (err) {
				res.send({
					status: 0,
					type: 'FORM_DATA_ERROR',
					message: '表单信息错误'
				})
				return
			};
			try{
				if(!fields.type || !fields.value) {
					res.send({
						status: 0,
						type: 'FORM_DATA_ERROR',
						message: '表单信息不完整'
					})
				}
				const user = await this.checkIsRepeat(fields.type, fields.value);
				let message = ''
				if (user == null) {
					res.send({
						status: 1,
						type: '',
						message: '未重复'
					})
				} else {
					switch(fields.type) {
						case 'username':
							message = '该邮箱已注册，请重新填写';break;
					}
					res.send({
						status: 0,
						data: null,
						message: message
					})
				}	
			}catch(err){
				res.send({
					status: 0,
					data: null,
					message: '获取信息失败'
				})
			}
		})
	}
	async checkIsRepeat(type, value){
		try{
			let data = {};
			let user = {}
			if (type == 'username') {
				user = await UsersModel.findOne({idstr: value});
			} else {
				data[type]=value;
				user = await UserInfoModel.findOne(data);
			}
			return user
		}catch(err){
			console.log(err)
		}
	}
	async signup(req, res, next) {
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
				if(fields.username =='') {
					res.send({
						status: 0,
						type: 'FORM_DATA_ERROR',
						message: '用户名或密码不能为空'
					})
				} else {
					const user = await UsersModel.findOne({idstr:fields.username});
					if (user == null) {
						res.send({
							status: 0,
							type: '',
							message: '用户不存在'
						})
					} else{
						if(user.password !== (this.encryption(fields.password))){
							res.send({
								status: 0,
								type: '',
								message: '密码错误，请重新输入密码'
							})
						} else {
							const userInfo = await UserInfoModel.findOne({id:user.id});
							req.session.user_id = user.id;
							res.send({
								status: 1,
								data: userInfo,
								message: '登录成功'
							})
						}
					}
					
				}
			}catch(err){
				res.send({
					status: 0,
					data: null,
					message: '获取信息失败'
				})
			}
		})
	}
	async signout(req, res, next) {
		try{
			delete req.session.user_id;
			req.send({
				code:'1',
				success: '退出成功'
			})
		}catch(err){
			console.log(err);
			req.send({
				code:'0',
				message: '服务器异常，退出失败'
			})
		}
	}
}

export default new Users();