import axios from "axios";

// Utility Types --> https://www.typescriptlang.org/docs/handbook/utility-types.html#handbook-content

// ------------------- User
export type userType = {
	id: number;
	name: string;
	email: string;
	followersCount: number;
	followedUsersCount: number;
	listCount: number;
	createdAt: string;
};

export type postUserType = {
	email: string;
	password: string;
	name: string;
};

export type authenticateUserType = Omit<postUserType, "name">;

// ------------------- ListItem
export type completeListItemType = {
	id: number;
	externalApiIdentifier: string;
	imageUrl?: string | null;
	details?: string | null;
	rank: number;
	title: string;
	userComment: string;
	list: simplifiedListType;
};

// Omit<Type, Keys> cria um tipo com todas as properties do Type passado, exceto as properties indicadas em Keys
export type simplifiedListItemType = Omit<completeListItemType, "list">;
export type postListItemType = Omit<completeListItemType, "id" | "list">;
export type putListItemType = Partial<Omit<completeListItemType, "id" | "list">>;

// ------------------- Category
export type categoryType = {
	id: number;
	name: string;
};

// ------------------- List
export type completeListType = {
	id: number;
	title: string;
	likersCount: number;
	category: categoryType;
	draft: boolean;
	createdAt: string;
	itemsCount?: number;
	user: userType;
	items: Array<simplifiedListItemType>;
	shownItems?: number;
	likedByCurrentUser?: boolean;
};

export type simplifiedListType = Omit<completeListType, "user" | "items" | "shownItems">;

// Pick<Type, Keys> cria um tipo com somente as properties de Type indicadas em Keys
export type postListType = Pick<completeListType, "title" | "category">;

// Partial<Type> cria um tipo com todas as properties de Type sendo opcionais
export type putListType = Pick<Partial<completeListType>, "title" | "draft">;

// ------------------- Axios Requests
// axios.defaults.withCredentials = true;
axios.defaults.baseURL = "http://localhost:3000/api/";
// axios.defaults.baseURL = "http://mytopfavorite.com:3000/api/";

const headers = (token: string | null) => ({ headers: { Authorization: `Bearer ${token}` } });

// ----- Session
export const login = (info: authenticateUserType) => axios.post<userType>("/sessions", info);
export const logout = (token: string | null) => axios.delete("/sessions", headers(token));
export const loginStatus = (token: string | null) => axios.get<userType>("/sessions/status", headers(token));

// ----- User
export const createUser = (newUser: postUserType, token: string | null) =>
	axios.post<userType>("/users", newUser, headers(token));
export const initialLoadFeed = (token: string | null) =>
	axios.get<Array<completeListType>>("/users/followed_users_lists", headers(token));
export const paginationLoadFeed = (pageNumber: number, token: string | null) =>
	axios.get<Array<completeListType>>(`/users/followed_users_lists?page=${pageNumber}&per_page=1`, headers(token));
export const searchUserById = (id: number, token: string | null) => axios.get<userType>(`/users/${id}`, headers(token));
export const searchUsersByName = (name: string, token: string | null) =>
	axios.post<Array<userType>>("/users/find_users", { name }, headers(token));
export const followUser = (user_id: number, token: string | null) =>
	axios.post<userType>("/users/follow", { user_id }, headers(token));
export const unfollowUser = (user_id: number, token: string | null) =>
	axios.delete(`/users/unfollow?user_id=${user_id}`, headers(token));
export const checkFollowingUser = (user_id: number, token: string | null) =>
	axios.get<userType>(`/users/${user_id}/check_following`, headers(token));

// ----- List
export const userLists = (id: number, token: string | null) =>
	axios.get<Array<simplifiedListType>>(`/lists?id=${id}`, headers(token));
export const userDrafLists = (token: string | null) =>
	axios.get<Array<simplifiedListType>>(`/lists/draft_lists`, headers(token)); // somente user pode ver suas drafted lists
export const userPublishedLists = (id: number, token: string | null) =>
	axios.get<Array<simplifiedListType | completeListType>>(`/lists/${id}/published_lists`, headers(token));
export const userPublishedListsPaginated = (id: number, page: number, token: string | null) =>
	axios.get<Array<completeListType>>(`/lists/${id}/published_lists?page=${page}&per_page=2`, headers(token));
export const deleteList = (listId: number, token: string | null) =>
	axios.delete<Array<simplifiedListType>>(`/lists/${listId}`, headers(token));
export const createList = (title: string, category_id: number, token: string | null) =>
	axios.post<simplifiedListType>("/lists", { title, category_id }, headers(token));
export const likeList = (id: number, token: string | null) => axios.post<userType>(`/lists/${id}/like`, headers(token));
export const dislikeList = (id: number, token: string | null) => axios.delete(`/lists/${id}/dislike`, headers(token));

export const getSingleList = (id: number, token: string | null) =>
	axios.get<completeListType>(`/lists/${id}`, headers(token));
export const updateList = (id: number, list: putListType, token: string | null) =>
	axios.put<simplifiedListType>(`/lists/${id}`, list, headers(token));

// ----- Category
export const allCategories = (token: string | null) => axios.get<Array<categoryType>>("/categories", headers(token));

// ----- ListItem
export const insertItem = (listId: number, item: postListItemType, token: string | null) =>
	axios.post<completeListItemType>("/list_items", { listId, ...item }, headers(token));
export const updateItem = (item: putListItemType, id: number, token: string | null) =>
	axios.put<completeListItemType>(`/list_items/${id}`, item, headers(token));
export const deleteItem = (itemId: number, token: string | null) =>
	axios.delete(`/list_items/${itemId}`, headers(token));
