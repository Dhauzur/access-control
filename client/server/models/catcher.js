import { Schema, model } from 'mongoose';

const catcher = new Schema({
	updatedAt: {
		type: String,
		required: false,
	},
	url: {
		type: String,
		required: false,
	},
	status: {
		type: String,
		required: false,
	},
	description: {
		type: String,
		required: false,
	},
});
export default model('catcher', catcher);
