import Joi from '@hapi/joi';

const imageSchema = {
	put: Joi.object({
		data: Joi.string(),
	}),
};

export default Object.freeze(imageSchema);
