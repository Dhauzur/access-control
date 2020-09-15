const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const options = {
	swaggerDefinition: {
		info: {
			title: 'DRAFT API',
			version: '0.0.1',
		},
		basePath: '/' + process.env.NODE_ENV + '/v1',
	},
	apis: ['./**/data.yaml'],
};
const specs = swaggerJsdoc(options);
module.exports = app => {
	app.use('/swagger', swaggerUi.serve, swaggerUi.setup(specs));
};
