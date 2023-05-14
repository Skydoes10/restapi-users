export type createUser = {
	username: string;
	email: string;
	password: string;
};

export type loginUser = {
	email: string;
	password: string;
};

export type updateUser = {
	username?: string;
	password?: string;
};

export type payloadUser = {
	id: string;
	username: string;
	email: string;
};
