import jwt from 'jsonwebtoken';

type payload = {
	id: string;
};

export const generateJWT = (payload: payload) => {
	return new Promise((resolve, reject) => {
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
