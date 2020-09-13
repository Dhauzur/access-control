import userService from '../services/user';

const userController = {
	getRegisterProcess(req, res) {
		const { id_trans } = req.params;
		userService.getRegisterProcess(id_trans, res);
	},
	postRegisterSSO(req, res) {
		const { rut, email } = req.params;
		const { firstName, lastName } = req.body;
		const group = process.env.ID_GROUP;
		userService.postRegisterSSO(rut, email, firstName, lastName, group, res);
	},
	getRegisterSSO(req, res) {
		const { rut, email } = req.params;
		userService.getRegisterSSO(rut, email, res);
	},
	getRegisterEmail(req, res) {
		const { rut, email } = req.params;
		userService.getRegisterEmail(rut, email, res);
	},
	getRegister(req, res) {
		const { rut } = req.params;
		userService.getRegister(rut, res);
	},
	getGeneralData(req, res) {
		userService.getGeneralData(res);
	},
	get(req, res) {
		const { rut } = req.params;
		userService.get(rut, res);
	},
};

export default Object.freeze(userController);
