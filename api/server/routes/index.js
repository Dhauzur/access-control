import image from './image';
const gateway = '/' + process.env.NODE_ENV + '/v1';
export default app => {
	app.use(gateway, image);
};
