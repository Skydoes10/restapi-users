import dotenv from 'dotenv';
import path from 'path';
import Server from './server';

dotenv.config({
	path: path.join(__dirname, `../.env.${process.env.NODE_ENV}`),
});
const server = new Server();
server.start();
