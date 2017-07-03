'use strict';
 
import UsersModel from '../../models/users/users'
import UserInfoModel from '../../models/users/userInfo'
import BaseComponent from '../../prototype/baseComponent'
import crypto from 'crypto'
import formidable from 'formidable'
import dtime from 'time-formater'

class Users extends BaseComponent{
	constructor(){
		super();
		this.signup = this.signup.bind(this);
		this.getUserInfo = this.getUserInfo.bind(this);
		this.encryption = this.encryption.bind(this);
	}
	getUserInfo(req, res, next){
		try{
			let string = {name:"wwt"}, i=0;
			const userInfo = UsersModel.find((error,docs)=>{
				if(error) {
					console.log(error)
					res.send({
						status: 0,
						message: error
					})
				}else{
					res.send({
						status: 1,
						data: docs,
						success: '查找成功'
					})
				}
			});
		}catch(err){
			console.log('查找失败', err)
			res.send({
				status: 0,
				message: '查找失败'
			})
		}
	}

	async signup(req, res, next){
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
			try{console.log(this.encryption(fields.password)+":15");
				//const user_id = await this.getId('user_id');
				//console.log(this.encryption(fields.password));
				//const users = {idstr: fields.username, screen_name: fields.screen_name, password: ""};
			}catch(err){
				console.log(err)
			}
		})
	}
	encryption(password){
		console.log(this);
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
			try{
				const user = await checkIsRepeat(fields.type, fields.value);
				res.send({
					status: 1,
					data: user,
					message: '获取信息成功'
				})
			}catch(err){
				res.send({
					status: 0,
					data: null,
					message: '获取信息失败'
				})
			}
		})
	}
	async checkIsRepeat(type, value){console.log(type)
		try{
			const user = await UsersModel.findOne({value}, 'idstr');
			return user
		}catch(err){
			console.log(err)
		}
	}
}

export default new Users();