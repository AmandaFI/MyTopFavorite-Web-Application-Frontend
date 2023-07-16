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

export type basicUserType = Omit<userType, "followersCount" | "followedUsersCount" | "listCount">;

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

export type completeListTypeBasicUser = {
	id: number;
	title: string;
	likersCount: number;
	category: categoryType;
	draft: boolean;
	createdAt: string;
	itemsCount?: number;
	user: basicUserType;
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
axios.defaults.withCredentials = true;
axios.defaults.baseURL = "http://localhost:3000/api/"; // Ruby on Rails
// axios.defaults.baseURL = "http://localhost:3001/api/"; // NestJS
// axios.defaults.baseURL = "http://mytopfavorite.com:3000/api/";

// ----- Session
export const login = (info: authenticateUserType) => axios.post<userType>("/sessions", info); // --------
export const logout = () => axios.delete("/sessions");
export const loginStatus = () => axios.get<userType>("/sessions/status");

// ----- User
export const createUser = (newUser: postUserType) => axios.post<basicUserType>("/users", newUser);
export const initialLoadFeed = () => axios.get<Array<completeListTypeBasicUser>>("/users/followed_users_lists");
export const paginationLoadFeed = (pageNumber: number) =>
	axios.get<Array<completeListTypeBasicUser>>(`/users/followed_users_lists?page=${pageNumber}&per_page=1`);
export const searchUserById = (id: number) => axios.get<userType>(`/users/${id}`);
export const searchUsersByName = (name: string) => axios.post<Array<basicUserType>>("/users/find_users", { name });
export const followUser = (userId: number) => axios.post<basicUserType>("/users/follow", { userId });
export const unfollowUser = (userId: number) => axios.delete(`/users/unfollow?user_id=${userId}`);
export const checkFollowingUser = (userId: number) => axios.get<basicUserType>(`/users/${userId}/check_following`);

// ----- List
export const userLists = (id: number) => axios.get<Array<basicUserType>>(`/lists?id=${id}`);
export const userDrafLists = () => axios.get<Array<simplifiedListType>>(`/lists/draft_lists`); // somente user pode ver suas drafted lists
export const userPublishedLists = (id: number) =>
	axios.get<Array<simplifiedListType | completeListType>>(`/lists/${id}/published_lists`);
export const userPublishedListsPaginated = (id: number, page: number) =>
	axios.get<Array<completeListType>>(`/lists/${id}/published_lists?page=${page}&per_page=2`);
export const deleteList = (listId: number) => axios.delete<Array<simplifiedListType>>(`/lists/${listId}`);
export const createList = (title: string, categoryId: number) =>
	axios.post<simplifiedListType>("/lists", { title, categoryId });
export const likeList = (id: number) => axios.post<basicUserType>(`/lists/${id}/like`);
export const dislikeList = (id: number) => axios.delete(`/lists/${id}/dislike`);

export const getSingleList = (id: number) => axios.get<completeListType>(`/lists/${id}`);
export const updateList = (id: number, list: putListType) => axios.put<simplifiedListType>(`/lists/${id}`, list);

// ----- Category
export const allCategories = () => axios.get<Array<categoryType>>("/categories");

// ----- ListItem
export const insertItem = (listId: number, item: postListItemType) =>
	axios.post<completeListItemType>("/list_items", { listId, ...item });
export const updateItem = (item: putListItemType, id: number) =>
	axios.put<completeListItemType>(`/list_items/${id}`, item);
export const deleteItem = (itemId: number) => axios.delete(`/list_items/${itemId}`);
