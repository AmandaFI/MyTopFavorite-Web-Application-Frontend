import axios from "axios";

export type authenticationType = {
  email: string;
  password: string;
};

export type loggedUserType = {
  id: number;
  name: string;
  email: string;
  followersCount: number;
  followedUsersCount: number;
  listCount: number;
  createdAt: string;
};

export type userType = {
  email: string;
  encryptedPassword: string;
  name: string;
};

export type postListItemType = {
  externalApiIdentifier: string;
  imageUrl?: string;
  details?: string;
  rank: number;
  title: string;
  userComment?: string;
};

export type listItemType = {
  id: number;
  externalApiIdentifier: string;
  imageUrl: string | null;
  details: string | null;
  rank: number;
  title: string;
  userComment: string | null;
};

export type categoryType = {
  id: number;
  name: string;
};

export type listType = {
  id: number;
  title: string;
  likersCount: number;
  itemsCount: number;
  createdAt: string;
  category: categoryType;
  draft: boolean;
};

export type completeListType = {
  id: number;
  title: string;
  likersCount: number;
  category: categoryType;
  user: loggedUserType;
  items: Array<listItemType>;
};

export type createList = {
  title: string;
  categoryId: number;
};

axios.defaults.withCredentials = true;
// axios.defaults.baseURL = 'http://localhost:3000/api/'
axios.defaults.baseURL = "http://mytopfavorite.com:3000/api/";

// ----- Session
export const login = (info: authenticationType) => axios.post<loggedUserType>("/sessions", info);
export const logout = () => axios.delete("/sessions");
export const loginStatus = () => axios.get<loggedUserType>("/sessions/status");

// ----- User
export const createUser = (newUser: userType) => axios.post<loggedUserType>("/users", newUser);
export const loadFeed = () => axios.get<Array<completeListType>>("/users/followed_users_lists");

// ----- List
export const userLists = () => axios.get<Array<listType>>("/lists");
export const userDrafLists = () => axios.get<Array<listType>>("/lists/draft_lists");
export const userPublishedLists = () => axios.get<Array<listType>>("/lists/published_lists");
export const deleteList = (listId: number) => axios.delete<Array<listType>>(`/lists/${listId}`);
export const createList = (title: string, category_id: number) =>
  axios.post<listType>("/lists", { title: title, category_id: category_id });
export const likeList = (id: number) => axios.post<loggedUserType>(`/lists/${id}/like`);
export const getSingleList = (id: number) => axios.get<completeListType>(`/lists/${id}`);

// ----- Category
export const allCategories = () => axios.get<Array<categoryType>>("/categories");

// ----- ListItem
export const insertItems = (item: postListItemType) => axios.post<listType>("/list_items", item);
