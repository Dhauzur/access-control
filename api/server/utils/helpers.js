import Rut from 'rutjs';
import moment from 'moment';

const generateAntiquity = (start, end) => {
	if (start == null || start == '' || end == '' || end == null) return '';
	end = end.substring(0, 4) + ',' + end.substring(4, 6) + ',' + end.substring(6, 8);
	start = start.substring(0, 4) + ',' + start.substring(4, 6) + ',' + start.substring(6, 8);
	if (end.split(',')[0] == '9999') end = new Date();
	var endDate = new Date(end);
	var startDate = new Date(start);
	return String(moment(endDate).diff(startDate, 'month'));
};

const validateExist = res => {
	if (res == '*' || res == 'No existe informacion' || res == undefined || res == null || res == 'undefined')
		return false;
	else return true;
};

const formatDate = date => {
	date = String(date);
	return date.substring(6, 8) + '-' + date.substring(4, 6) + '-' + date.substring(0, 4);
};

const getFourLastNumbers = (rut, res) => {
	if (!rut)
		res.json({
			status: false,
			descripcion: 'Debe incluir RUT',
		});
	rut = String(rut);
	var rutJS = new Rut(rut);
	if (rutJS.isValid) {
		const maxLengthRut = rutJS.rut.length;
		const minLengthRut = rutJS.rut.length - 4;
		console.log('CLAVE4: ' + rutJS.rut.substring(minLengthRut, maxLengthRut));
		return rutJS.rut.substring(minLengthRut, maxLengthRut);
	} else {
		res.json({
			status: false,
			descripcion: 'RUT Inválido',
		});
	}
};

const validAndConvertRut = (rut, res) => {
	if (!rut)
		res.json({
			status: false,
			descripcion: 'Debe incluir RUT',
		});
	rut = String(rut);
	var rutJS = new Rut(rut);
	if (rutJS.isValid) {
		return rutJS.rut + '-' + rutJS.checkDigit;
	} else {
		res.json({
			status: false,
			descripcion: 'RUT Inválido',
		});
	}
};

const addParams = (str, params) => {
	Object.entries(params).forEach(([key, value]) => {
		str = str.replace(`{${key}}`, value);
	});
	return str;
};

const helpers = {
	generateAntiquity,
	validateExist,
	formatDate,
	getFourLastNumbers,
	validAndConvertRut,
	addParams,
};

export default Object.freeze(helpers);
