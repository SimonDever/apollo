import { SelectMovie } from './../actions/movie.actions';
import * as MovieActions from '../actions/movie.actions';
import { MovieState } from '../state/app.state';
import { Movie } from '../../models/movie';

type Action = MovieActions.All;

export function movieReducer(state = {} as MovieState, action: Action) {
	switch (action.type) {

		case MovieActions.LOAD_MOVIES: {
			return Object.assign({}, state, {
				loading: true
			});
		}

		case MovieActions.MOVIES_LOADED: {
			return Object.assign({}, state, {
				movies: action.payload,
				loading: false
			});
		}

		case MovieActions.MOVIE_SAVED: {
			let movieIndex = state.movies.findIndex(movie => movie.id == action.payload.id);
			let movies = [...state.movies];
			movies.splice(movieIndex, 1, action.payload);

			let searchResultsIndex = state.searchResults.findIndex(movie => movie.id == action.payload.id);
			let searchResults = [...state.searchResults];
			searchResults.splice(searchResultsIndex, 1, action.payload);

			return Object.assign({}, state, {
				movies: movies,
				searchResults: searchResults,
				selectedMovie: action.payload
			});
		}

		case MovieActions.SELECT_MOVIE: {
			return Object.assign({}, state, {
				selectedMovie: action.payload,
				previousLocation: action.previousLocation
			});
		}

		case MovieActions.SEARCH_MOVIE: {
			return Object.assign({}, state, {
				searchTerms: action.payload
			});
		}

		case MovieActions.MOVIE_SEARCHED: {
			const searchResults = state.searchTerms === '' ? [] : action.payload;
			return Object.assign({}, state, {
				searchResults: searchResults
			});
		}

		case MovieActions.CLEAR_SEARCH: {
			return Object.assign({}, state, {
				searchResults: [],
				searchTerms: '',
				selectedMovie: null
			});
		}

		default: return state;
	}
}
