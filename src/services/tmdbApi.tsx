// import axios from "axios";

const api_key = "477772a0b3b472817057ba0d4e4daacd";

export type responseResultType = {
	adult: boolean;
	backdrop_path: string;
	genre_ids: number[];
	id: number;
	original_language: string;
	original_title: string;
	overview: string;
	popularity: number;
	poster_path: string;
	release_date: string;
	title: string;
	video: boolean;
	vote_average: number;
	vote_count: number;
	user_input_text?: string;
};

type responseType = {
	page: number;
	results: responseResultType[];
	total_pages: number;
	total_results: number;
};

export const searchMovieByTitle = (title: string) => true;
// axios.get<responseType>(
// 	`https://api.themoviedb.org/3/search/movie?api_key=${api_key}&language=en-US&query=${title}&page=1&include_adult=false`
// );
