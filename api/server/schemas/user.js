import Joi from '@hapi/joi';

const userSchema = {
	sendVerifyEmail: Joi.object({
		rut: Joi.string(),
		userid: Joi.string(),
	}),
	getRegisterProcess: Joi.object({
		id_trans: Joi.string(),
	}),
	postRegisterSSOBody: Joi.object({
		email: Joi.string(),
		firstName: Joi.string(),
		lastName: Joi.string(),
	}),
	getRegisterSSO: Joi.object({
		rut: Joi.string(),
		email: Joi.string(),
	}),
	getRegisterEmail: Joi.object({
		rut: Joi.string(),
		email: Joi.string(),
	}),
	get: Joi.object({
		rut: Joi.string(),
	}),
};

export default Object.freeze(userSchema);
