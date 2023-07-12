import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import http from 'http';
import morgan from 'morgan';
import db from './db/connection';
import { authRouter, usersRouter } from './routes';

class Server {
	private app: express.Application;
	private server: http.Server | undefined;
	private port: string;
	private apiPaths = {
		auth: '/api/auth',
		users: '/api/users',
	};

	constructor() {
		this.app = express();
		this.port = process.env.PORT || '3000';

		// Database connection
		this.dbConnection();

		// Middlewares
		this.middlewares();

		// Routes
		this.routes();
	}

	async dbConnection() {
		try {
			await db.initialize();
			console.log('Database connected');
		} catch (error) {
			console.error(error);
			throw new Error('Error connecting to database');
		}
	}

	middlewares() {
		// CORS
		this.app.use(
			cors({
				origin: process.env.DEV_CLIENT_URL,
				credentials: true,
			})
		);

		// Body parser
		this.app.use(express.json());

		// Cookie parser
		this.app.use(cookieParser());

		// Morgan
		this.app.use(morgan('dev'));
	}

	routes() {
		this.app.use(this.apiPaths.auth, authRouter);
		this.app.use(this.apiPaths.users, usersRouter);
	}

	getApp() {
		return this.app;
	}

	start() {
		this.server = this.app.listen(this.port, () => {
			console.log(`Server listening on port ${this.port}`);
		});
	}

	close(callback: () => void) {
		if (this.server) {
			this.server.close(callback);
		}
	}
}

export default Server;
