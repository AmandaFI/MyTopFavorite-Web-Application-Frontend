import axios from "axios";

export type authenticationType = {
	email: string;
	password: string;
};

export type loggedUserType = {
	id: number;
	name: string;
	email: string;
	followers_count: number;
	followed_users_count: number;
	list_count: number;
	created_at: string;
};

export type userType = {
	email: string;
	encrypted_password: string;
	name: string;
};

export type temporaryMetadata = {
	x: number;
	y: number;
	z: number;
};

export type listItemType = {
	id: number;
	external_api_identifier: string;
	metadata: Array<temporaryMetadata>;
	rank: number;
	title: string;
	user_comment: string;
};

export type categoryType = {
	id: number;
	name: string;
};

export type completeListType = {
	id: number;
	title: string;
	likers_count: number;
	category: categoryType;
	items: Array<listItemType>;
};


axios.defaults.withCredentials = true
axios.defaults.baseURL = 'http://localhost:3000/api/'

export const login = (info: authenticationType) => axios.post<loggedUserType>('/sessions', info)
export const loginStatus = () => axios.get<loggedUserType>('/sessions/status')
export const createUser = (newUser: userType) => axios.post<loggedUserType>('/users', newUser)
export const loadFeed = () => axios.get<Array<completeListType>>('/users/followed_users_lists')


