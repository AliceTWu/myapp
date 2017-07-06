'use strict';

import express from 'express';
import Users from '../controller/v2/users';
let router = express.Router();

router.get('/users/show.json', Users.getUserInfo);
router.post('/users/signup', Users.singup);
router.post('/users/signin', Users.signin);
router.post('/users/checkform', Users.checkform);


export default router;