'use strict';

import express from 'express';
import Users from '../controller/v2/users';
import Status from '../controller/v2/status';
import Friendships from '../controller/v2/friendships';
let router = express.Router();

router.get('/users/show.json', Users.getUserInfo);
router.post('/users/signup', Users.signup);
router.post('/users/signin', Users.signin);
router.post('/users/checkform', Users.checkform);

router.post('/statuses/uploadImage', Status.uploadImage);
router.post('/statuses/create', Status.create);
router.get('/statuses/user_timeline', Status.user_timeline);
router.get('/statuses/show.json', Status.show);
router.delete('/statuses/delete/:status_id', Status.delete);

router.post('/friendships/follow', Friendships.follow);
router.post('/friendships/unfollow', Friendships.unfollow);

export default router;