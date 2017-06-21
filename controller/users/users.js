'use strict';
 
import UsersModel from '../../models/users/users'
import crypto from 'crypto'
import formidable from 'formidable'
import dtime from 'time-formater'

class Users {
	constructor(){
		//this.login = this.login.bind(this)
	}
	getUserInfo(req, res, next){
		try{
			let string = JSON.stringify({name:"wwt"});
			let userInfo = UsersModel.find(function(error,docs){
				console.log(docs)
			});
			//console.log(userInfo)
			res.send({
				status: 1,
				data:'userInfo',
				success: '查找成功'
			})
		}catch(err){
			console.log('查找失败', err)
			res.send({
				status: 0,
				message: '查找失败'
			})
		}
	}
}

export default new Users()