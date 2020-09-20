import './config/envs.js';
import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import path from 'path';
import routes from './routes/index';
import rateLimit from 'express-rate-limit';

const app = express();

var raspividStream = require('raspivid-stream');

var videoStream = raspividStream();

// To stream over websockets:
videoStream.on('data', data => {
	console.log(data);
	// ws.send(data, { binary: true }, (error) => { if (error) console.error(error); });
});

app.use(cors());

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: false }));
app.use(bodyParser.json({ limit: '50mb' }));

app.get('/', (req, res) => res.sendFile(__dirname + '/index.html'));

routes(app);

module.exports = app;
