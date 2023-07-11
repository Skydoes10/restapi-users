import dotenv from 'dotenv';
import path from 'path';
import { DataSource } from 'typeorm';
import User from '../models/user';
dotenv.config({
	path: path.join(__dirname, `../../.env.${process.env.NODE_ENV}`),
});

const connection = new DataSource({
	type: 'postgres',
	host: process.env.DB_HOST,
	port: Number(process.env.DB_PORT),
	username: process.env.DB_USERNAME,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_NAME,
	entities: [User],
	synchronize: true,
	logging: false,
});

export default connection;
