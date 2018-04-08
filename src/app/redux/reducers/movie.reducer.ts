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
			let index = state.movies.findIndex(movie => movie.id == action.payload.id);
			let a = [...state.movies];
			a.splice(index, 1, action.payload);
			return Object.assign({}, state, {
				movies: a,
				selectedMovie: action.payload
			});
		}

		case MovieActions.SELECT_MOVIE: {
			return Object.assign({}, state, {
				selectedMovie: action.payload
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
				searchTerms: ''
			});
		}

		default: return state;
	}
}
