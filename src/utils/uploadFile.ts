import cloudinary from 'cloudinary';
cloudinary.v2.config(process.env.CLOUDINARY_URL!);

export const uploadFile = (
	tempFilePath: string,
	model: string
): Promise<{ public_id: string; url: string }> => {
	return new Promise((resolve, reject) => {
		cloudinary.v2.uploader.upload(
			tempFilePath,
			{
				folder: model,
			},
			(err, result) => {
				if (err) {
					reject(err);
				} else
					resolve({
						public_id: result!.public_id,
						url: result!.secure_url,
					});
			}
		);
	});
};

export const deleteFile = (public_id: string, model: string): Promise<any> => {
	return new Promise((resolve, reject) => {
		cloudinary.v2.uploader.destroy(
			`${model}/${public_id}`,
			(err, result) => {
				if (err) {
					reject(err);
				} else {
					resolve(result);
				}
			}
		);
	});
};

export const getDefaultAvatar = (): Promise<{
	public_id: string;
	url: string;
}> => {
	return new Promise((resolve, reject) => {
		cloudinary.v2.api.resource('avatars/default-avatar', (err, result) => {
			if (err) {
				reject(err);
			} else {
				resolve({
					public_id: result!.public_id,
					url: result!.secure_url,
				});
			}
		});
	});
};
