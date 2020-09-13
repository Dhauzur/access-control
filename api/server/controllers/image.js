import imageService from '../services/image';

const imageController = {
	put(req, res) {
		const { data } = req.body;
		res(imageService.put(data));
	},
};

export default Object.freeze(imageController);
