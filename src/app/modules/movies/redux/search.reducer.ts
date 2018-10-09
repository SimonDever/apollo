import * as LibraryActions from "./library.actions";
import { Movie } from "../movie";

export interface State {
	needMovies: boolean;
	selectedMovie: Movie;
	searchResults: Movie[];
	searchTerms: string;
}

export const initialState: State = {
	needMovies: true,
	selectedMovie: null,
	searchResults: [],
	searchTerms: ''
};

export function reducer(state: State = initialState, action: LibraryActions.LibraryActions): State {
	switch (action.type) {
		case LibraryActions.SHOW_RESULTS: {
			return Object.assign({}, state, {
				searchResults: action.payload.searchTerms ? action.payload.results : [],
				searchTerms: action.payload.searchTerms
			});
		}

		case LibraryActions.LOADED: {
			return Object.assign({}, state, {
				needMovies: false
			});
		}

		case LibraryActions.SELECT_MOVIE: {
			return Object.assign({}, state, {
				selectedMovie: action.payload.movie
			});
		}

		case LibraryActions.ADD_MOVIE: {
			return Object.assign({}, state, {
				selectedMovie: action.payload.movie
			});
		}

		case LibraryActions.CLOSE_MOVIE_VIEW: {
			return Object.assign({}, state, {
				selectedMovie: null
			})
		}

		case LibraryActions.UPDATE_RESULTS: {
			let searchResults = state.searchResults;
			if (state.searchResults != null) {
				let searchResultsIndex = state.searchResults.findIndex(movie => movie.id == action.movie.id);
				searchResults = [...state.searchResults];
				searchResults.splice(searchResultsIndex, 1, action.movie);
			}
			return Object.assign({}, state, {
				searchResults: searchResults,
				selectedMovie: action.movie
			});
		}

		case LibraryActions.CLOSE_SEARCH_VIEW: {
			return Object.assign({}, state, {
				searchResults: null,
				searchTerms: '',
				selectedMovie: null
			});
		}

		default: {
			return state;
		}
	}
}
