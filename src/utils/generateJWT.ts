import jwt from 'jsonwebtoken';
import { payloadUser } from '../types/user';

export const generateJWT = (user: payloadUser) => {
	return new Promise((resolve, reject) => {
		const payload = { user };
		jwt.sign(
			payload,
			process.env.SECRET_KEY as string,
			{
				expiresIn: '4h',
			},
			(err, token) => {
				if (err) {
					reject(err);
				} else {
					resolve(token);
				}
			}
		);
	});
};
