'use strict';

import express from 'express';
import Users from '../controller/users/users.js';
let router = express.Router();
try{console.log(3)
	router.get('/getUserInfo', Users.getUserInfo);
}catch(err){
	console.log("错误："+err)
}

/*console.log(Users.getUserInfo)*/

export default router;