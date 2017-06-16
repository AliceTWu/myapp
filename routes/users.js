'use strict';

import express from 'express';
import Users from '../controller/users/users.js';
const router = express();

router.post('/login', Users.login);
//router.post('/register', Users.register);

export default router