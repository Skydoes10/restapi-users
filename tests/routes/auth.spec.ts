import bcrypt from 'bcryptjs';
import request from 'supertest';
import connection from '../../src/db/connection';
import User from '../../src/models/user';
import Server from '../../src/server';

let server: Server;

beforeAll(async () => {
	server = new Server();
	server.start();

	connection.setOptions({
		entities: [User],
		synchronize: true,
		logging: false,
	});

	await connection.initialize();
});

afterAll((done) => {
	server.close(done);
	connection.destroy();
});

const initDatabase = async () => {
	const users = [
		{
			username: 'test1',
			email: 'test1@gmail.com',
			password: 'test123',
		},
		{
			username: 'test2',
			email: 'test2@gmail.com',
			password: 'test123',
		},
		{
			username: 'test3',
			email: 'test3@gmail.com',
			password: 'test123',
		},
	];

	for (const user of users) {
		await User.create({
			...user,
			password: bcrypt.hashSync(user.password, 10),
		}).save();
	}
};

describe('Auth routes', () => {
	beforeEach(async () => {
		await initDatabase();
	});

	afterEach(async () => {
		await User.clear();
	});

	describe('POST /api/auth/login', () => {
		test('should return 200 and user when login is successful', async () => {
			const user = {
				email: 'test1@gmail.com',
				password: 'test123',
			};
			const response = await request(server.getApp())
				.post('/api/auth/login')
				.send(user);
			expect(response.status).toBe(200);
			expect(response.body.msg).toEqual('Ok');
			expect(response.body.user).toHaveProperty('id');
			expect(response.body.user).toHaveProperty('username');
			expect(response.body.user).toHaveProperty('email');
			expect(response.headers['set-cookie'][0]).toMatch(/token=.+;/);
		});

		test('should return 400 when email is not provided', async () => {
			const user = {
				password: 'test123',
			};
			const response = await request(server.getApp())
				.post('/api/auth/login')
				.send(user);
			expect(response.status).toBe(400);
			expect(response.body.msg).toEqual('Error');
			expect(response.body.error).toEqual(['Email is required']);
		});

		test('should return 400 when email is invalid', async () => {
			const user = {
				email: '',
				password: 'test123',
			};
			const response = await request(server.getApp())
				.post('/api/auth/login')
				.send(user);
			expect(response.status).toBe(400);
			expect(response.body.msg).toEqual('Error');
			expect(response.body.error).toEqual(['Invalid email']);
		});

		test('should return 400 when password is not provided', async () => {
			const user = {
				email: 'test1@gmail.com',
			};
			const response = await request(server.getApp())
				.post('/api/auth/login')
				.send(user);
			expect(response.status).toBe(400);
			expect(response.body.msg).toEqual('Error');
			expect(response.body.error).toEqual(['Password is required']);
		});

		test('should return 400 when credentials are invalid', async () => {
			let user = {
				email: 'test@gmail.com',
				password: 'test123',
			};
			const response = await request(server.getApp())
				.post('/api/auth/login')
				.send(user);
			expect(response.status).toBe(400);
			expect(response.body.msg).toEqual('Error');
			expect(response.body.error).toEqual('Invalid credentials');

			user = {
				email: 'test1@gmail.com',
				password: 'test12345',
			};

			const response2 = await request(server.getApp())
				.post('/api/auth/login')
				.send(user);
			expect(response2.status).toBe(400);
			expect(response2.body.msg).toEqual('Error');
			expect(response2.body.error).toEqual('Invalid credentials');
		});
	});

	describe('POST /api/auth/register', () => {
		test('should return 200 and user when register is successful', async () => {
			const user = {
				username: 'test4',
				email: 'test4@gmail.com',
				password: 'test123',
			};

			const response = await request(server.getApp())
				.post('/api/auth/register')
				.send(user);
			expect(response.status).toBe(200);
			expect(response.body.msg).toEqual('Ok');
			expect(response.body.user).toHaveProperty('id');
			expect(response.body.user).toHaveProperty('username');
			expect(response.body.user).toHaveProperty('email');
			expect(response.headers['set-cookie'][0]).toMatch(/token=.+;/);

			const userCount = await User.count();
			expect(userCount).toBe(4);
		});

		test('should return 400 when username is not provided', async () => {
			const user = {
				email: 'test4@gmail.com',
				password: 'test123',
			};
			const response = await request(server.getApp())
				.post('/api/auth/register')
				.send(user);
			expect(response.status).toBe(400);
			expect(response.body.msg).toEqual('Error');
			expect(response.body.error).toEqual(['Username is required']);
		});

		test('should return 400 when username is invalid', async () => {
			const user = {
				username: '',
				email: 'test4@gmail.com',
				password: 'test123',
			};
			const response = await request(server.getApp())
				.post('/api/auth/register')
				.send(user);
			expect(response.status).toBe(400);
			expect(response.body.msg).toEqual('Error');
			expect(response.body.error).toEqual([
				'Username must be at least 3 characters',
			]);
		});

		test('should return 400 when email is not provided', async () => {
			const user = {
				username: 'test4',
				password: 'test123',
			};
			const response = await request(server.getApp())
				.post('/api/auth/register')
				.send(user);
			expect(response.status).toBe(400);
			expect(response.body.msg).toEqual('Error');
			expect(response.body.error).toEqual(['Email is required']);
		});

		test('should return 400 when email is invalid', async () => {
			const user = {
				username: 'test4',
				email: '',
				password: 'test123',
			};
			const response = await request(server.getApp())
				.post('/api/auth/register')
				.send(user);
			expect(response.status).toBe(400);
			expect(response.body.msg).toEqual('Error');
			expect(response.body.error).toEqual(['Invalid email']);
		});

		test('should return 400 when password is not provided', async () => {
			const user = {
				username: 'test4',
				email: 'test4@gmail.com',
			};
			const response = await request(server.getApp())
				.post('/api/auth/register')
				.send(user);
			expect(response.status).toBe(400);
			expect(response.body.msg).toEqual('Error');
			expect(response.body.error).toEqual(['Password is required']);
		});

		test('should return 400 when password is invalid', async () => {
			const user = {
				username: 'test4',
				email: 'test4@gmail.com',
				password: '',
			};
			const response = await request(server.getApp())
				.post('/api/auth/register')
				.send(user);
			expect(response.status).toBe(400);
			expect(response.body.msg).toEqual('Error');
			expect(response.body.error).toEqual([
				'Password must be at least 6 characters',
			]);
		});

		test('should return 400 when email is already taken', async () => {
			const user = {
				username: 'test4',
				email: 'test3@gmail.com',
				password: 'test123',
			};
			const response = await request(server.getApp())
				.post('/api/auth/register')
				.send(user);
			expect(response.status).toBe(400);
			expect(response.body.msg).toEqual('Error');
			expect(response.body.error).toEqual('Email already exists');
		});

		test('should return 400 when username is already taken', async () => {
			const user = {
				username: 'test3',
				email: 'test4@gmail.com',
				password: 'test123',
			};
			const response = await request(server.getApp())
				.post('/api/auth/register')
				.send(user);
			expect(response.status).toBe(400);
			expect(response.body.msg).toEqual('Error');
			expect(response.body.error).toEqual('Username already exists');
		});
	});

	describe('POST /api/auth/logout', () => {
		test('should return 200 and clear cookie', async () => {
			const user = {
				username: 'test1',
				email: 'test1@gmail.com',
				password: 'test123',
			};

			const agent = request.agent(server.getApp());

			await agent.post('/api/auth/login').send(user);

			const response = await agent.post('/api/auth/logout');

			expect(response.status).toBe(200);
			expect(response.body.msg).toEqual('Ok');
			expect(response.headers['set-cookie'][0]).toMatch(/token=;/);
		});

		test('should return 401 when user is not logged in', async () => {
			const response = await request(server.getApp()).post(
				'/api/auth/logout'
			);
			expect(response.status).toBe(401);
			expect(response.body.msg).toEqual('Error');
			expect(response.body.error).toEqual('Token is required');
		});
	});
});
