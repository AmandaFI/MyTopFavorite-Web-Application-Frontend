import axios from "axios";

const api_key = "477772a0b3b472817057ba0d4e4daacd";
export const posterInitialUrl = "https://image.tmdb.org/t/p/w500/";

export type tmdbBaseResultsResponseType = {
  adult: boolean;
  backdrop_path: string;
  genre_ids: number[];
  id: number;
  original_language: string;
  overview: string;
  popularity: number;
  poster_path: string;
  vote_average: number;
  vote_count: number;
  user_input_text?: string;
};

export type tmdbMovieType = tmdbBaseResultsResponseType & {
  original_title: string;
  release_date: string;
  title: string;
  video: boolean;
};

export type tmdbSeriesType = tmdbBaseResultsResponseType & {
  first_air_date: string;
  name: string;
  original_country: string[];
  original_name: string;
};

export type tmdbPersonType = {
  adult: boolean;
  gender: number;
  id: number;
  known_for: Array<tmdbMovieType>;
  known_for_department: string;
  name: string;
  original_name: string;
  popularity: number;
  profile_path: string;
  user_input_text?: string;
};

export type tmdbResponseType = {
  page: number;
  results: tmdbMovieType[] | tmdbSeriesType[] | tmdbPersonType[];
  total_pages: number;
  total_results: number;
};

export const searchMovieByTitle = (title: string) =>
  axios.get<tmdbResponseType>(
    `https://api.themoviedb.org/3/search/movie?api_key=${api_key}&language=en-US&query=${title}&page=1&include_adult=false`,
    { withCredentials: false }
  );

export const searchSeriesByTitle = (title: string) =>
  axios.get<tmdbResponseType>(
    `https://api.themoviedb.org/3/search/tv?api_key=${api_key}&language=en-US&query=${title}&page=1&include_adult=false`,
    { withCredentials: false }
  );

export const searchPersonByName = (title: string) =>
  axios.get<tmdbResponseType>(
    `https://api.themoviedb.org/3/search/person?api_key=${api_key}&language=en-US&query=${title}&page=1&include_adult=false`,
    { withCredentials: false }
  );
