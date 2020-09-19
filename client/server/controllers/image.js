import imageService from '../services/image';
import helpers from '../utils/helpers';
const PiCamera = require('pi-camera');

const imageController = {
	put(req, res) {
		const { data } = req.body;
		res.json(imageService.put(data));
	},
	process(req, res) {
		res.json(helpers.process());
	},
	picam(req, res) {
		const myCamera = new PiCamera({
			mode: 'photo',
			width: 340,
			height: 280,
			nopreview: true,
		});

		myCamera
			.snapDataUrl()
			.then(result => {
				res.render('home', { immg: { result } });
			})
			.catch(error => {
				// Handle your error
			});
	},
};

export default Object.freeze(imageController);
