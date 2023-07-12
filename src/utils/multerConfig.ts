import multer from 'multer';
import { handleError } from './handleError';
import { Response } from 'express';

export const multerConfig = multer({
	storage: multer.diskStorage({
		destination: function (req, file, cb) {
			cb(null, 'uploads/');
		},
		filename: function (req, file, cb) {
			cb(null, Date.now() + '-' + file.originalname);
		},
	}),
	fileFilter: function (req, file, cb) {
		if (
			file.mimetype !== 'image/png' &&
			file.mimetype !== 'image/jpeg' &&
			file.mimetype !== 'image/jpg'
		) {
			const res = req.res as Response;
			return handleError(
				400,
				'File type not allowed, types allowed: png, jpg, jpeg',
				res
			);
		} else {
			cb(null, true);
		}
	},
	limits: {
		fileSize: 1024 * 1024 * 2,
	},
});
