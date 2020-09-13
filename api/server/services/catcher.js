import Catcher from '../models/catcher';
import moment from 'moment';

const deleteAll = async () => {
	try {
		await Catcher.deleteMany({});
		return true;
	} catch (error) {
		console.log(error);
	}
};

const getAll = async () => {
	try {
		const errorsList = await Catcher.find({});
		if (errorsList.length) return errorsList;
		else return [];
	} catch (error) {
		console.log(error);
	}
};

const save = async (status, descripcion, url) => {
	try {
		var catcherError = {};
		catcherError.url = url;
		catcherError.status = status;
		catcherError.description = descripcion;
		catcherError.updatedAt = moment().format('DD-MM-YY hh:mm:ss');
		const newCatcherError = new Catcher(catcherError);
		await newCatcherError.save();
		return true;
	} catch (error) {
		console.log(error);
	}
};

const catcherService = {
	deleteAll,
	getAll,
	save,
};

export default Object.freeze(catcherService);
