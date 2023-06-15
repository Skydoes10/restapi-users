import { Response } from 'express';

export const handleError = (
	code: number,
	message: string | string[],
	res: Response
) => {
	res.status(code).json({
		msg: 'Error',
		error: message,
	});
};
