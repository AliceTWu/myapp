'use strict';

import express from 'express';
import Users from '../controller/users/users.js';
let router = express.Router();
try{
	router.get('/getUserInfo', Users.getUserInfo);
	router.post('/signup', Users.signup);
	router.get('/test', Users.toString);
}catch(err){
	console.log("错误："+err)
}

export default router;