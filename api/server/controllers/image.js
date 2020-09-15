import imageService from '../services/image';
import helpers from '../utils/helpers';

const imageController = {
	put(req, res) {
		const { data } = req.body;
		res.json(imageService.put(data));
	},
	process(req, res) {
		res.json(helpers.process());
	},
};

export default Object.freeze(imageController);
