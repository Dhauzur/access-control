import draft from './draft';
import proxy from './proxy';
import file from './file';
import user from './user';
import email from './email';
import crm from './crm';
const gateway = '/' + process.env.NODE_ENV + '/v1';
export default app => {
	app.use(gateway, crm);
	app.use(gateway, email);
	app.use(gateway, proxy);
	app.use(gateway, user);
	app.use(gateway, file);
	app.use(gateway, draft);
};
