import axios from "axios";

// import { wrapper } from 'axios-cookiejar-support';
// import { CookieJar } from 'tough-cookie';

// declare module 'axios' {
// 	interface AxiosRequestConfig {
// 		jar?: CookieJar;
//   }
// }

// const jar = new CookieJar();
// const client = wrapper(axios.create({ jar }));

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

export const axiosInstance = axios.create({
	withCredentials: true,
	baseURL: "http://127.0.0.1:3000/api/"
});

// axios.defaults.withCredentials = true;
// axios.defaults.baseURL = "http://192.168.15.7:3000/api";

// axiosInstance.interceptors.request.use((x) => {
// 	console.log(x);
// 	return x;
// });

// axiosInstance.interceptors.response.use((x) => {
// 	console.log(x);
// 	return x;
// });


export const login = (info: authenticationType) =>
	axiosInstance.post<loggedUserType>("/sessions", info, {
	});

export const createUser = (newUser: userType) =>
	axiosInstance.post<loggedUserType>("/users", newUser, {
	});

export const loadFeed = () =>
	axiosInstance.get<Array<completeListType>>("/users/followed_users_lists", {
	});
