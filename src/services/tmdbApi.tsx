import axios from "axios";

const api_key = "477772a0b3b472817057ba0d4e4daacd";
export const posterInitialUrl = "https://image.tmdb.org/t/p/w500/";

export type CategoryUrlSegmentType = "person" | "tv" | "movie";

interface tmdbBaseResultsCategorizedResponseType {
	category: CategoryUrlSegmentType;
	id: number;
}

interface tmdbBaseResultsResponseType extends tmdbBaseResultsCategorizedResponseType {
	poster_path: string;
}

export interface tmdbMovieType extends tmdbBaseResultsResponseType {
	category: "movie";
	original_title: string;
	release_date: string;
}

export interface tmdbSeriesType extends tmdbBaseResultsResponseType {
	category: "tv";
	first_air_date: string;
	original_name: string;
}

export interface tmdbPersonType extends tmdbBaseResultsCategorizedResponseType {
	category: "person";
	known_for_department: string;
	original_name: string;
	profile_path: string;
}

export type tmdbResponseType = {
	page: number;
	results: (tmdbMovieType | tmdbSeriesType | tmdbPersonType)[];
	total_pages: number;
	total_results: number;
};

// export const searchMovieByTitle = (title: string) =>
//   axios.get<tmdbResponseType>(
//     `https://api.themoviedb.org/3/search/movie?api_key=${api_key}&language=en-US&query=${title}&page=1&include_adult=false`,
//     { withCredentials: false }
//   );

// export const searchSeriesByTitle = (title: string) =>
//   axios.get<tmdbResponseType>(
//     `https://api.themoviedb.org/3/search/tv?api_key=${api_key}&language=en-US&query=${title}&page=1&include_adult=false`,
//     { withCredentials: false }
//   );

// export const searchPersonByName = (title: string) =>
//   axios.get<tmdbResponseType>(
//     `https://api.themoviedb.org/3/search/person?api_key=${api_key}&language=en-US&query=${title}&page=1&include_adult=false`,
//     { withCredentials: false }
//   );

export const searchItemByTitle = (title: string, category: string) =>
	axios.get<tmdbResponseType>(
		`https://api.themoviedb.org/3/search/${category}?api_key=${api_key}&language=en-US&query=${title}&page=1&include_adult=false`,
		{ withCredentials: false }
	);
