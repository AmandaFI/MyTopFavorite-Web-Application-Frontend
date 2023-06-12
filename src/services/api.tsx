import axios from "axios";

export type authenticationType = {
  email: string;
  password: string;
};

export type userType = {
  id: number;
  name: string;
  email: string;
  followersCount: number;
  followedUsersCount: number;
  listCount: number;
  createdAt: string;
};

export type createUserType = {
  email: string;
  encryptedPassword: string;
  name: string;
};

export interface postListItemType {
  externalApiIdentifier: string;
  imageUrl?: string | null;
  details?: string | null;
  rank: number;
  title: string;
  userComment: string;
}

export interface listItemType extends postListItemType {
  id: number;
}

export interface listItemApiResponse extends postListItemType {
  id: number;
  list: listType;
}

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
  user: userType;
  items: Array<listItemType>;
  shownItems?: number;
};

export type createList = {
  title: string;
  categoryId: number;
};

export type updateList = {
  title?: string;
  draft?: boolean;
};

axios.defaults.withCredentials = true;
// axios.defaults.baseURL = 'http://localhost:3000/api/'
axios.defaults.baseURL = "http://mytopfavorite.com:3000/api/";

// ----- Session
export const login = (info: authenticationType) => axios.post<userType>("/sessions", info);
export const logout = () => axios.delete("/sessions");
export const loginStatus = () => axios.get<userType>("/sessions/status");

// ----- User
export const createUser = (newUser: createUserType) => axios.post<userType>("/users", newUser);
export const initialLoadFeed = () => axios.get<Array<completeListType>>("/users/followed_users_lists");
export const paginationLoadFeed = (pageNumber: number) =>
  axios.get<Array<completeListType>>(`/users/followed_users_lists?page=${pageNumber}&per_page=1`);
export const searchUserById = (id: number) => axios.get<createUserType>(`/users/${id}`);
export const searchUsersByName = (name: string) => axios.post<Array<createUserType>>("/users/find_users", { name });
export const followUser = (user_id: number) => axios.post<userType>("/users/follow", { user_id });
export const unfollowUser = (user_id: number) => axios.delete("/users/unfollow", { data: { user_id } });

// ----- List
export const userLists = (id: number) => axios.get<Array<listType>>("/lists", { params: { id } });
export const userDrafLists = (id: number) => axios.get<Array<listType>>("/lists/draft_lists", { params: { id } });

export const userPublishedLists = (id: number, complete_and_paginated: boolean) =>
  axios.get<Array<listType | completeListType>>("/lists/published_lists", { params: { id, complete_and_paginated } });
export const userPublishedListsPaginated = (id: number, complete_and_paginated: boolean, page: number) =>
  axios.get<Array<completeListType>>("/lists/published_lists", {
    params: { id, complete_and_paginated, page, per_page: 2 },
  });

export const deleteList = (listId: number) => axios.delete<Array<listType>>(`/lists/${listId}`);
export const createList = (title: string, category_id: number) =>
  axios.post<listType>("/lists", { title, category_id });
export const likeList = (id: number) => axios.post<userType>(`/lists/${id}/like`);
export const getSingleList = (id: number) => axios.get<completeListType>(`/lists/${id}`);
export const updateList = (id: number, list: updateList) => axios.put<listType>(`/lists/${id}`, list);

// ----- Category
export const allCategories = () => axios.get<Array<categoryType>>("/categories");

// ----- ListItem
export const insertItem = (listId: number, item: postListItemType) =>
  axios.post<listItemApiResponse>("/list_items", { listId, ...item });
export const updateItem = (item: listItemType) => axios.put<listItemApiResponse>(`/list_items/${item.id}`, item);
export const deleteItem = (itemId: number) => axios.delete(`/list_items/${itemId}`);
