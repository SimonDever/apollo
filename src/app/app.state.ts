import { Movie } from "./modules/movies/movie";

export class AppState {
	movieState: MovieState;
}

export class MovieState {
	searchResults: Movie[];
	searchTerms: string;
	movies: Movie[];
	selectedMovie: Movie;
	loading: boolean;
	contextTitle: string;
}
