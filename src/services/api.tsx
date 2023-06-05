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
	metadata: temporaryMetadata;
	rank: number;
	title: string;
	user_comment: string;
};

export type categoryType = {
	id: number;
	name: string;
};

export type listType = {
	id: number;
	title: string;
	likers_count: number;
	items_count: number;
	created_at: string;
	category: categoryType;
}

export type completeListType = {
	id: number;
	title: string;
	likers_count: number;
	category: categoryType;
	user: loggedUserType;
	items: Array<listItemType>;
};

export type createList = {
	title: string,
	category_id: number
}


axios.defaults.withCredentials = true
// axios.defaults.baseURL = 'http://localhost:3000/api/'
axios.defaults.baseURL = 'http://mytopfavorite.com:3000/api/'


// ----- Session
export const login = (info: authenticationType) => axios.post<loggedUserType>('/sessions', info)
export const logout = () => axios.delete('/sessions')
export const loginStatus = () => axios.get<loggedUserType>('/sessions/status')

// ----- User
export const createUser = (newUser: userType) => axios.post<loggedUserType>('/users', newUser)
export const loadFeed = () => axios.get<Array<completeListType>>('/users/followed_users_lists')

// ----- List
export const userLists = () => axios.get<Array<listType>>('/lists')
export const deleteList = (listId: number) => axios.delete<Array<listType>>(`/lists/${listId}`)
export const createList = (title: string, category_id: number) => axios.post<listType>('/lists', {title: title, category_id: category_id})
export const likeList = (id: number) => axios.post<loggedUserType>(`/lists/${id}/like`)

// ----- Category
export const allCategories = () => axios.get<Array<categoryType>>('/categories')


