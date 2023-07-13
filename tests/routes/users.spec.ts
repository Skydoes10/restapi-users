import bcrypt from 'bcryptjs';
import request from 'supertest';
import connection from '../../src/db/connection';
import User from '../../src/models/user';
import Server from '../../src/server';
import path from 'path';

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
			avatar: path.join(__dirname, '../../src/assets/default-avatar.jpg'),
			username: 'test1',
			email: 'test1@gmail.com',
			password: 'test123',
		},
		{
			avatar: path.join(__dirname, '../../src/assets/default-avatar.jpg'),
			username: 'test2',
			email: 'test2@gmail.com',
			password: 'test123',
			status: false,
		},
		{
			avatar: path.join(__dirname, '../../src/assets/default-avatar.jpg'),
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

describe('Users routes', () => {
	beforeEach(async () => {
		await initDatabase();
	});

	afterEach(async () => {
		await User.clear();
	});

	describe('GET /api/users', () => {
		test('should return 200 and all active users', async () => {
			const user = {
				email: 'test1@gmail.com',
				password: 'test123',
			};
			const agent = request.agent(server.getApp());
			await agent.post('/api/auth/login').send(user);
			const response = await agent.get('/api/users');

			expect(response.status).toBe(200);
			expect(response.body.msg).toEqual('Ok');
			expect(response.body.users).toBeInstanceOf(Array);
			expect(response.body.users.length).toBe(2);
		});

		test('should return 401 when user is not authenticated', async () => {
			const response = await request(server.getApp()).get('/api/users');

			expect(response.status).toBe(401);
			expect(response.body.msg).toEqual('Error');
			expect(response.body.error).toEqual('Token is required');
		});
	});

	describe('GET /api/users/:id', () => {
		test('should return 200 and user when user is found', async () => {
			const user = {
				email: 'test1@gmail.com',
				password: 'test123',
			};

			const agent = request.agent(server.getApp());
			const { body } = await agent.post('/api/auth/login').send(user);

			const response = await agent.get(`/api/users/${body.user.id}`);

			expect(response.status).toBe(200);
			expect(response.body.msg).toEqual('Ok');
			expect(response.body.user).toBeInstanceOf(Object);
			expect(response.body.user.id).toBe(body.user.id);
		});

		test('should return 400 when id is invalid', async () => {
			const user = {
				email: 'test1@gmail.com',
				password: 'test123',
			};

			const agent = request.agent(server.getApp());
			await agent.post('/api/auth/login').send(user);

			const response = await agent.get(`/api/users/123`);

			expect(response.status).toBe(400);
			expect(response.body.msg).toEqual('Error');
			expect(response.body.error).toEqual(['Id must be a valid uuid']);
		});

		test('should return 404 when user is not found', async () => {
			const user = {
				email: 'test1@gmail.com',
				password: 'test123',
			};

			const agent = request.agent(server.getApp());
			await agent.post('/api/auth/login').send(user);

			const response = await agent.get(
				`/api/users/123e4567-e89b-12d3-a456-426614174000`
			);

			expect(response.status).toBe(404);
			expect(response.body.msg).toEqual('Error');
			expect(response.body.error).toEqual('User not found');
		});

		test('should return 401 when user is not authenticated', async () => {
			const response = await request(server.getApp()).get(
				`/api/users/123e4567-e89b-12d3-a456-426614174000`
			);

			expect(response.status).toBe(401);
			expect(response.body.msg).toEqual('Error');
			expect(response.body.error).toEqual('Token is required');
		});
	});

	describe('PUT /api/users/:id', () => {
		test('should return 200 and user when username is updated', async () => {
			const user = {
				email: 'test1@gmail.com',
				password: 'test123',
			};

			const agent = request.agent(server.getApp());
			const { body } = await agent.post('/api/auth/login').send(user);

			const response = await agent
				.put(`/api/users/${body.user.id}`)
				.send({
					username: 'test4',
				});

			expect(response.status).toBe(200);
			expect(response.body.msg).toEqual('Ok');
			expect(response.body.user).toBeInstanceOf(Object);
			expect(response.body.user.username).toEqual('test4');
		});

		test('should return 200 and user when password is updated', async () => {
			const user = {
				email: 'test1@gmail.com',
				password: 'test123',
			};

			const agent = request.agent(server.getApp());
			const { body } = await agent.post('/api/auth/login').send(user);

			const response = await agent
				.put(`/api/users/${body.user.id}`)
				.send({
					password: 'test1234',
				});

			expect(response.status).toBe(200);
			expect(response.body.msg).toEqual('Ok');
			expect(response.body.user).toBeInstanceOf(Object);

			const userUpdated = await User.findOne({
				where: { id: body.user.id },
			});

			const isPasswordValid = await bcrypt.compare(
				'test1234',
				userUpdated!.password
			);

			expect(isPasswordValid).toBeTruthy();
		});

		test('should return 400 when username is taken', async () => {
			const user = {
				email: 'test1@gmail.com',
				password: 'test123',
			};

			const agent = request.agent(server.getApp());
			const { body } = await agent.post('/api/auth/login').send(user);

			const response = await agent
				.put(`/api/users/${body.user.id}`)
				.send({
					username: 'test1',
				});

			expect(response.status).toBe(400);
			expect(response.body.msg).toEqual('Error');
			expect(response.body.error).toEqual('Username is already in use');
		});

		test('should return 400 when password is invalid', async () => {
			const user = {
				email: 'test1@gmail.com',
				password: 'test123',
			};

			const agent = request.agent(server.getApp());
			const { body } = await agent.post('/api/auth/login').send(user);

			const response = await agent
				.put(`/api/users/${body.user.id}`)
				.send({
					password: 'test123',
				});

			expect(response.status).toBe(400);
			expect(response.body.msg).toEqual('Error');
			expect(response.body.error).toEqual('Password is invalid');
		});

		test('should return 400 when id is invalid', async () => {
			const user = {
				email: 'test1@gmail.com',
				password: 'test123',
			};

			const agent = request.agent(server.getApp());
			const { body } = await agent.post('/api/auth/login').send(user);

			const response = await agent.put(`/api/users/123`).send({
				username: 'test4',
			});

			expect(response.status).toBe(400);
			expect(response.body.msg).toEqual('Error');
			expect(response.body.error).toEqual(['Id must be a valid uuid']);
		});

		test('should return 404 when user is not found', async () => {
			const user = {
				email: 'test1@gmail.com',
				password: 'test123',
			};

			const agent = request.agent(server.getApp());
			const { body } = await agent.post('/api/auth/login').send(user);

			const response = await agent
				.put(`/api/users/123e4567-e89b-12d3-a456-426614174000`)
				.send({
					username: 'test4',
				});

			expect(response.status).toBe(404);
			expect(response.body.msg).toEqual('Error');
			expect(response.body.error).toEqual('User not found');
		});

		test('should return 401 when user is not authenticated', async () => {
			const response = await request(server.getApp())
				.put(`/api/users/123e4567-e89b-12d3-a456-426614174000`)
				.send({
					username: 'test4',
				});

			expect(response.status).toBe(401);
			expect(response.body.msg).toEqual('Error');
			expect(response.body.error).toEqual('Token is required');
		});
	});

	describe('DELETE /api/users/:id', () => {
		test('should return 200 and user when user is deleted', async () => {
			const user = {
				email: 'test1@gmail.com',
				password: 'test123',
			};

			const agent = request.agent(server.getApp());
			const { body } = await agent.post('/api/auth/login').send(user);

			const response = await agent.delete(`/api/users/${body.user.id}`);

			expect(response.status).toBe(200);
			expect(response.body.msg).toEqual('Ok');

			const usersCount = await User.count({
				where: { status: true },
			});
			expect(usersCount).toEqual(1);
		});

		test('should return 400 when id is invalid', async () => {
			const user = {
				email: 'test1@gmail.com',
				password: 'test123',
			};

			const agent = request.agent(server.getApp());
			const { body } = await agent.post('/api/auth/login').send(user);

			const response = await agent.delete(`/api/users/123`);

			expect(response.status).toBe(400);
			expect(response.body.msg).toEqual('Error');
			expect(response.body.error).toEqual(['Id must be a valid uuid']);
		});

		test('should return 404 when user is not found', async () => {
			const user = {
				email: 'test1@gmail.com',
				password: 'test123',
			};

			const agent = request.agent(server.getApp());
			const { body } = await agent.post('/api/auth/login').send(user);

			const response = await agent.delete(
				`/api/users/123e4567-e89b-12d3-a456-426614174000`
			);

			expect(response.status).toBe(404);
			expect(response.body.msg).toEqual('Error');
			expect(response.body.error).toEqual('User not found');
		});

		test('should return 401 when user is not authenticated', async () => {
			const response = await request(server.getApp()).delete(
				`/api/users/123e4567-e89b-12d3-a456-426614174000`
			);

			expect(response.status).toBe(401);
			expect(response.body.msg).toEqual('Error');
			expect(response.body.error).toEqual('Token is required');
		});
	});
});
