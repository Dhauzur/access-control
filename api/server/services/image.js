import axios from '../config/axios';
import helpers from '../utils/helpers';
import moment from 'moment';
import CatcherServices from './catcher';

const PUBLIC_DIR = './server/public/';

const getRegisterProcess = async (id_trans, res) => {
	const URL_FETCH = helpers.addParams(process.env.REGISTERPROCESS, {
		id_trans,
	});
	try {
		const { data } = await axios(URL_FETCH, {
			method: 'get',
		});
		if (data && data.codigo != 500)
			return res.json({
				status: true,
				data: {
					rutcliente: data.rut,
					email: data.email,
					finalizado: data.finalizado,
				},
			});
		else
			return res.json({
				status: true,
				data: null,
			});
	} catch (e) {
		console.error('Error al obtener proceso de registro');
		CatcherServices.save('Log catcher 1', e, 'Service: User - getRegisterProcess');
	}
	return res.json({
		status: false,
		descripcion: 'Error al obtener proceso de registro',
	});
};

const postRegisterSSO = async (rut, email, firstName, lastName, group, res) => {
	try {
		rut = helpers.validAndConvertRut(rut, res);
		const userNameSSO = await proxyService.getUserByUserName(rut);
		await proxyService.assignGroup(userNameSSO.data[0].id, group);
		return res.json({
			status: true,
			data: {
				usuario_nuevo: false,
				user_id: userNameSSO.data[0].id,
			},
		});
	} catch (e) {
		console.error('Primer intento: Usuario no encontrado.');
		CatcherServices.save('Log catcher 1', e, 'Service: User - postRegisterSSO');
	}
	try {
		await proxyService.createUser({
			username: rut,
			firstName,
			lastName,
			email,
			enabled: true,
			credentials: [
				{
					temporary: true,
					type: 'password',
					value: helpers.getFourLastNumbers(rut, res),
				},
			],
			requiredActions: ['UPDATE_PASSWORD'],
			attributes: {
				given_name: firstName + ' ' + lastName,
				rut,
			},
		});
	} catch (e) {
		console.error('Error al crear usuario.', e);
		CatcherServices.save('Log catcher 2', e, 'Service: User - postRegisterSSO');
	}
	try {
		const retryUserNameSSO = await proxyService.getUserByUserName(rut);
		await proxyService.assignGroup(retryUserNameSSO.data[0].id, group);
		await emailService.send(email, firstName);
		return res.json({
			status: true,
			data: {
				usuario_nuevo: true,
				user_id: retryUserNameSSO.data[0].id,
			},
		});
	} catch (e) {
		console.error('Segundo intento: Error al procesar un usuario recien creado.');
		CatcherServices.save('Log catcher 3', e, 'Service: User - postRegisterSSO');
	}
	return res.json({
		status: false,
		descripcion: 'Error al registrar',
	});
};

const getRegisterSSO = async (rut, email, res) => {
	var output = {
		sso_email: true,
		sso_email_desc: '',
		sso_rut: true,
		sso_rut_desc: '',
	};
	rut = helpers.validAndConvertRut(rut, res);
	const dataEmailS1 = await proxyService.getUserByEmail(email);
	const dataUserNameS2 = await proxyService.getUserByUserName(rut);
	var S2UserName = dataUserNameS2.data[0] ? dataUserNameS2.data[0].username : '',
		S2Email = dataUserNameS2.data[0] ? dataUserNameS2.data[0].email : '',
		S1UserName = dataEmailS1.data[0] ? dataEmailS1.data[0].username : '',
		S1Email = dataEmailS1.data[0] ? dataEmailS1.data[0].email : '';
	if (!S2UserName && !S2Email && !S1UserName && !S1Email)
		return res.json({
			status: true,
			data: output,
		});
	if (S2UserName && S2Email != email && !S1Email && !S1UserName)
		output = {
			sso_email: false,
			sso_email_desc: 'El rut ya esta asociado al correo ' + S2Email + ', intenta utilizar ese correo',
			sso_rut: true,
			sso_rut_desc: '',
		};
	if (!S2UserName && S1UserName != rut)
		output = {
			sso_email: false,
			sso_email_desc: 'El correo ya esta asociado a otro usuario.',
			sso_rut: true,
			sso_rut_desc: '',
		};
	if (S2UserName && S2Email && email == S2Email && S1UserName == rut)
		output = {
			sso_email: true,
			sso_email_desc: '',
			sso_rut: true,
			sso_rut_desc: '',
		};
	return res.json({
		status: true,
		data: output,
	});
};

const getRegisterEmail = async (rut, email, res) => {
	rut = helpers.validAndConvertRut(rut, res);
	const URL_FETCH = helpers.addParams(process.env.REGISTEREMAIL, {
		rut,
		email,
	});
	try {
		const { data } = await axios(URL_FETCH, {
			method: 'get',
		});
		delete data.codigo;
		delete data.descripcion;
		return res.json({
			status: true,
			data,
		});
	} catch (e) {
		console.error('Error al obtener registro por email');
		CatcherServices.save('Log catcher 1', e, 'Service: User - getRegisterEmail');
	}
	return res.json({
		status: false,
		descripcion: 'Error al obtener registro por email',
	});
};

const getRegister = async (rut, res) => {
	rut = helpers.validAndConvertRut(rut, res);
	var output = {
		rutcliente: '',
		nombres: '',
		apellidos: '',
		afiliado: false,
		trabajador: false,
	};
	const listRequestPersonalData = [process.env.REGISTERPERSON];
	for (let requestName of listRequestPersonalData) {
		const URL_FETCH = helpers.addParams(requestName, {
			rut,
		});
		try {
			var { data } = await axios(URL_FETCH, {
				method: 'get',
			});
			if (requestName == process.env.REGISTERPERSON) {
				if (data) {
					data = data.API_ObtenerCustomerInfo_Response_MT;
					output.rutcliente = rut;
					if (data.ES_BUT000) {
						output.nombres =
							(helpers.validateExist(data.ES_BUT000.NAME_FIRST)
								? data.ES_BUT000.NAME_FIRST
								: '') +
							(helpers.validateExist(data.ES_BUT000.NAMEMIDDLE)
								? ' ' + data.ES_BUT000.NAMEMIDDLE
								: '');
						output.apellidos =
							(helpers.validateExist(data.ES_BUT000.NAME_LAST)
								? data.ES_BUT000.NAME_LAST
								: '') +
							(helpers.validateExist(data.ES_BUT000.NAME_LST2)
								? ' ' + data.ES_BUT000.NAME_LST2
								: '');
					}

					if (data.ES_PENSIONADO) {
						if (data.ES_PENSIONADO.item) {
							if (data.ES_PENSIONADO.item.length)
								data.ES_PENSIONADO.item.forEach(pen => {
									if (pen.ESTADO == '02') output.afiliado = true;
								});
						} else {
							if (data.ES_PENSIONADO.ESTADO == '02') output.afiliado = true;
						}
					}
					if (data.ET_TRABAJADOR) {
						if (data.ET_TRABAJADOR.item.length) {
							data.ET_TRABAJADOR.item.forEach(pen => {
								if (pen.ESTADO == '02') {
									output.trabajador = true;
									output.afiliado = true;
								}
							});
						} else {
							if (data.ET_TRABAJADOR.item.ESTADO == '02') {
								output.trabajador = true;
								output.afiliado = true;
							}
						}
					} else output.trabajador = false;
				}
			}
		} catch (e) {
			console.error('Error al obtener registro');
			CatcherServices.save('Log catcher 1', e, 'Service: User - getRegister');
		}
		return res.json({
			status: true,
			data: output,
		});
	}
};

const cacheAvalaible = {
	TYPERENTS: PUBLIC_DIR + 'type-rents.json',
	TYPECONTRACTS: PUBLIC_DIR + 'type-contracts.json',
	COMMUNES: PUBLIC_DIR + 'communes.json',
	REGIONS: PUBLIC_DIR + 'regions.json',
	GENDER: PUBLIC_DIR + 'gender.json',
	NATIONALITIES: PUBLIC_DIR + 'nationalities.json',
};

const getGeneralData = res => {
	var data = {};
	var nameAtribute = '';
	for (const nameData in cacheAvalaible) {
		if ('TYPERENTS' == nameData) nameAtribute = 'tipo_renta';
		if ('TYPECONTRACTS' == nameData) nameAtribute = 'tipo_contrato';
		if ('COMMUNES' == nameData) nameAtribute = 'comunas';
		if ('REGIONS' == nameData) nameAtribute = 'regiones';
		if ('GENDER' == nameData) nameAtribute = 'sexos';
		if ('NATIONALITIES' == nameData) nameAtribute = 'nacionalidades';
		data[nameAtribute] = cacheService.getCache(cacheAvalaible[nameData])[
			Object.keys(cacheService.getCache(cacheAvalaible[nameData]))[0]
		];
	}
	return res.json({
		status: true,
		data,
	});
};

const get = async (rut, res) => {
	rut = helpers.validAndConvertRut(rut, res);
	var person = {
		datos_personales: {},
		datos_laborales: {},
	};
	const listRequestPersonalData = [
		process.env.DATAPERSONAL,
		process.env.DIRECTIONPERSONAL,
		process.env.CONTACTPERSONAL,
		process.env.EMPRESAS,
	];
	for (let requestName of listRequestPersonalData) {
		const URL_FETCH = helpers.addParams(requestName, {
			rut,
		});
		try {
			const { data } = await axios(URL_FETCH, {
				method: 'get',
			});
			if (requestName == process.env.DATAPERSONAL) {
				if (data) {
					person.datos_personales.rutcliente = helpers.validateExist(data.rut) ? data.rut : '';
					person.datos_personales.primer_nombre = helpers.validateExist(data.primer_nombre)
						? data.primer_nombre
						: '';
					person.datos_personales.segundo_nombre = helpers.validateExist(data.segundo_nombre)
						? data.segundo_nombre
						: '';
					person.datos_personales.primer_apellido = helpers.validateExist(data.primer_apellido)
						? data.primer_apellido
						: '';
					person.datos_personales.segundo_apellido = helpers.validateExist(data.segundo_apellido)
						? data.segundo_apellido
						: '';
					person.datos_personales.sexo = helpers.validateExist(data.genero) ? data.genero : '';
					person.datos_personales.fecha_nacimiento = helpers.validateExist(data.fecha_nacimiento)
						? helpers.formatDate(data.fecha_nacimiento)
						: '';
					person.datos_personales.telefono = helpers.validateExist(data.telefono)
						? data.telefono
						: '';
					person.datos_personales.email = helpers.validateExist(data.email) ? data.email : '';
					person.datos_personales.nacionalidad = helpers.validateExist(data.nacionalidad)
						? data.nacionalidad
						: '';
				} else person.datos_personales = {};
			}
			if (requestName == process.env.DIRECTIONPERSONAL) {
				person.datos_personales.direccion = {};
				if (data.direcciones) {
					if (data.direcciones.length) {
						person.datos_personales.direccion.calle = helpers.validateExist(
							data.direcciones[0].calle
						)
							? data.direcciones[0].calle
							: '';
						person.datos_personales.direccion.numero = helpers.validateExist(
							data.direcciones[0].numero
						)
							? String(data.direcciones[0].numero)
							: '';
						person.datos_personales.region = helpers.validateExist(
							data.direcciones[0].codigo_region
						)
							? String(data.direcciones[0].codigo_region)
							: '';
						person.datos_personales.comuna = helpers.validateExist(
							String(data.direcciones[0].codigo_comuna)
						)
							? String(data.direcciones[0].codigo_comuna)
							: '';
					} else person.datos_laborales.empresas = [];
				} else person.datos_personales.direccion = '';
			}
			if (requestName == process.env.CONTACTPERSONAL) {
				if (data) {
					if (data.telefonos.length)
						data.telefonos.forEach(tel => {
							if (tel.codigo_tipo_telefono == 'XXDEFAULT')
								person.datos_personales.telefono = helpers.validateExist(String(tel.telefono))
									? String(tel.telefono)
									: '';
						});
					else person.datos_personales.telefono = '';
					if (data.correos.length)
						data.correos.forEach(cor => {
							if (cor.codigo_tipo_correo == 'XXDEFAULT')
								person.datos_personales.email = helpers.validateExist(
									String(cor.correo_electronico)
								)
									? String(cor.correo_electronico)
									: '';
						});
					else person.datos_personales.email = '';
				} else {
					person.datos_personales.telefono = '';
					person.datos_personales.email = '';
				}
			}
			if (requestName == process.env.EMPRESAS) {
				person.datos_laborales.empresas = [];
				if (data) {
					if (data.empresas.length)
						data.empresas.forEach(em => {
							person.datos_laborales.empresas.push({
								rutempresa: helpers.validateExist(em.rut) ? em.rut : '',
								empresa: helpers.validateExist(String(em.empresa)) ? String(em.empresa) : '',
								faena: helpers.validateExist(String(em.faena)) ? String(em.faena) : '',
								razon_social: helpers.validateExist(em.razon_social) ? em.razon_social : '',
								tipo_contrato: helpers.validateExist(String(em.contrato.codigo_tipo_contrato))
									? String(em.contrato.codigo_tipo_contrato)
									: '',
								fecha_inicio_contrato: helpers.validateExist(
									em.contrato.fecha_inicio_contrato
								)
									? helpers.formatDate(em.contrato.fecha_inicio_contrato)
									: '',
								fecha_fin_contrato: helpers.validateExist(em.contrato.fecha_termino_contrato)
									? helpers.formatDate(em.contrato.fecha_termino_contrato)
									: '',
								antiguedad: helpers.validateExist(String(em.contrato.antiguedad))
									? String(em.contrato.antiguedad)
									: helpers.generateAntiquity(
											String(em.contrato.fecha_inicio_contrato),
											String(em.contrato.fecha_termino_contrato)
									  ),
							});
						});
					else person.datos_laborales.empresas = [];
				} else person.datos_laborales.empresas = [];
			}
		} catch (e) {
			console.error('Error al obtener cliente');
			CatcherServices.save('Log catcher ' + requestName, e, 'Service: User - get');
		}
	}
	return res.json({
		status: true,
		data: person,
	});
};

const userService = {
	getRegisterProcess,
	postRegisterSSO,
	getRegisterSSO,
	getRegisterEmail,
	getRegister,
	getGeneralData,
	get,
};

export default Object.freeze(userService);
