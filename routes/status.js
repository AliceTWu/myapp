'use strict';

import express from 'express';
import Status from '../controller/status/status';
let router = express.Router();

router.post('/uploadImage', Status.uploadImage);

export default router;