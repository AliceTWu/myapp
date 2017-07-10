'use strict';

import mongoose from 'mongoose'

const idsSchema = new mongoose.Schema({
	user_id: Number,
	file_id: Number,
	status_id: Number,
	friendships_id: Number
});

const Ids = mongoose.model('Ids', idsSchema); 

Ids.findOne((err, data) => {
	if (!data) {
		const newIds = new Ids({
			user_id: 0,
			file_id: 0,
			status_id: 0,
			friendships_id: 0
		});
		newIds.save();
	}
})
export default Ids