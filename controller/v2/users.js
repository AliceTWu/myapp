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
		this.getUserInfo = this.getUserInfo.bind(this);
		this.encryption = this.encryption.bind(this);
		this.checkform = this.checkform.bind(this);
	}
	async getUserInfo(req, res, next){
		try{
			let string = {name:"wwt"};
			
			/*const userInfo = await UsersModel.findOne({'wwt'})*/
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
				const isRepeat = await UsersModel.findOne({idstr: fields.username});
				console.log(isRepeat);
				if(isRepeat !== null){
					res.send({
						status: 0,
						data: null,
						message: '该邮箱已注册，请重新填写'
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
					register_time: dtime().format('YYYY-MM-DD HH:mm')
				}
				UsersModel.create(newUser);
				const createUser = new UserInfoModel(newUserInfo);
				const userinfo = await createUser.save();
				req.session.user_id = user_id;
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
				const user = await this.checkIsRepeat(fields.type, fields.value);
				res.send({
					status: 1,
					data: user,
					message: '获取信息成功'
				})
			}catch(err){console.log(err)
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
			const data = {};
			data[type]=value;
			const user = await UserInfoModel.findOne(data);
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
			const user = {}
		})
	}
}

export default new Users();