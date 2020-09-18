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
			width: 640,
			height: 480,
			nopreview: true,
		});

		myCamera
			.snapDataUrl()
			.then(result => {
				console.log(result);
				// Your picture was captured
				res.json({ img: result });
			})
			.catch(error => {
				// Handle your error
			});
	},
};

export default Object.freeze(imageController);
