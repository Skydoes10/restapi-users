import cors from 'cors';
import express from 'express';
import db from '../db/connection';
import { authRouter, usersRouter } from '../routes';

class Server {
	private app: express.Application;
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
		this.app.use(cors());

		// Body parser
		this.app.use(express.json());
	}

	routes() {
		this.app.use(this.apiPaths.auth, authRouter);
		this.app.use(this.apiPaths.users, usersRouter);
	}

	start() {
		this.app.listen(this.port, () => {
			console.log(`Server listening on port ${this.port}`);
		});
	}
}

export default Server;
