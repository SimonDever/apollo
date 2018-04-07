import { Movie } from "../../models/movie";

export class AppState {
	movieState: MovieState;
}

export class MovieState {
	searchResults: Movie[];
	searchTerms: string;
	movies: Movie[];
	selectedMovie: Movie;
	loading: boolean;
}