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
//		const myCamera = new PiCamera({
//			mode: 'photo',
//			width: 340,
//			height: 280,
//			nopreview: true,
//		});

/*		myCamera
			.snapDataUrl()
			.then(result => {
				res.render('home', { immg: result });
			})
			.catch(error => {
				// Handle your error
			});
*/        fs.readFile(pic.jpg), function (error, data) {
    if (error) {
      throw error;
    } else {
      //console.log(data);
      var dataBase64 = Buffer.from(data).toString('base64');
      console.log(dataBase64);
      res.render('home', { immg: dataBase64 });
    }
  });

	},
};

export default Object.freeze(imageController);
