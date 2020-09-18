import './config/envs.js';
import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import path from 'path';
import mongoose from 'mongoose';
import routes from './routes/index';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import fileUpload from 'express-fileupload';
import { logger } from './config/pino';
import responseTime from 'response-time';
import catcherService from './services/catcher';

const app = express();
const MONGO_OPTIONS = {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useCreateIndex: true,
	useFindAndModify: false,
};

//Security
const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 1000, // limit each IP to 1000 requests per windowMs
});

const deleteErrors = async () => {
	try {
		logger.info('Borrando errores anteriores');
		await catcherService.deleteAll();
	} catch (error) {
		console.error('Error al borrar errores registrados: ' + error);
	}
};

const connectToDB = async () => {
	try {
		logger.info('Intentando conectar a BD... ' + process.env.URL_DB_MONGO);
		await mongoose.connect(process.env.URL_DB_MONGO, MONGO_OPTIONS);
		logger.info('Base de datos conectada correctamente');
	} catch (error) {
		console.error('Error al conectar a base de datos: ', error);
	}
};
app.use(limiter);
app.use(cors());
app.use(helmet());
//Security

app.use(responseTime());
app.use(fileUpload());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: false }));
app.use(bodyParser.json({ limit: '50mb' }));

app.get('/', (req, res) => res.render('home', { date: new Date() }));
app.get('/errors', async (req, res) => {
	const errors = await catcherService.getAll();
	res.render('home', { errors });
});
app.get('/errors/delete', async (req, res) => {
	const errors = await catcherService.deleteAll();
	res.render('home', { errors });
});

routes(app);
connectToDB().then(() => {
	deleteErrors();
});

module.exports = app;
