import axios from 'axios';
import CatcherServices from '../services/catcher';
import moment from 'moment';
import { logger } from './pino';

var iniTime = null,
	finTime = null;

export const api = axios.create({
	baseURL: process.env.API,
});

api.interceptors.request.use(config => {
	iniTime = moment();
	return config;
});

api.interceptors.response.use(response => {
	return response;
});

api.interceptors.response.use(
	response => response,
	error => {
		return error;
	}
);

/**
 * Performs api calls sending the required authentication headers
 * @param {String} url
 * @param {Object} options
 * @param {Object} headers
 */
const fetch = async (url, options, headers) => {
	// headers['blabla']
	const response = await api(url, {
		headers,
		...options,
	});
	return await _checkStatus(response, url);
};

/**
 * checkstatus of the api response
 * @param {Object} response
 * @return {Object} response || error
 * @private
 */
const _checkStatus = (res, url) => {
	finTime = moment();
	const msDiff = moment(finTime).diff(iniTime, 'milliseconds');
	if (res.status >= 200 && res.status < 300) {
		logger.info(
			msDiff + 'ms. ' + moment().format('YYYY-MM-DD hh:mm:ss') + ' STATUS: ' + res.status + '::' + url
		);
		return res;
	} else {
		logger.info(
			msDiff +
				'ms. ' +
				moment().format('YYYY-MM-DD hh:mm:ss') +
				' ERROR: ' +
				res.response.status +
				'::' +
				url
		);
		CatcherServices.save(
			res.response.status ? res.response.status : res.response.data.status,
			msDiff + 'ms.' + res.response.data.descripcion
				? res.response.data.descripcion
				: 'Sin descripción',
			res.config.url
		);
		throw res;
	}
};

export default fetch;
