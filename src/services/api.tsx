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

const axiosInstance = axios.create({
	withCredentials: true,
	// baseURL: "http://192.168.15.4:3000/api",
});

// axios.defaults.withCredentials = true;
// axios.defaults.baseURL = "http://192.168.15.7:3000/api";

axiosInstance.interceptors.request.use((x) => {
	console.log(x);
	return x;
});

axiosInstance.interceptors.response.use((x) => {
	console.log(x);
	return x;
});

export const login = (info: authenticationType) =>
	axiosInstance.post<loggedUserType>("http://192.168.15.7:3000/api/sessions", info, {
		withCredentials: true,
	});

export const createUser = (newUser: userType) =>
	axiosInstance.post<loggedUserType>("http://192.168.15.7:3000/api/users", newUser, {
		withCredentials: true,
	});

export const loadFeed = () =>
	axiosInstance.get<Array<completeListType>>("http://192.168.15.7:3000/api/users/followed_users_lists", {
		withCredentials: true,
	});
