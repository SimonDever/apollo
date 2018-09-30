import { SelectMovie } from './movie.actions';
import * as MovieActions from './movie.actions';
import { MovieState } from '../../app.state';
import { Movie } from './movie';

type Action = MovieActions.All;

export function movieReducer(state = {} as MovieState, action: Action) {
	switch (action.type) {

		case MovieActions.SEARCH_METADATA_PROVIDER: {
			return Object.assign({}, state, {});
		}

		case MovieActions.LOAD_MOVIES: {
			return Object.assign({}, state, {
				loading: true,
				contextTitle: ''
			});
		}

		case MovieActions.EDIT_MOVIE: {
			return Object.assign({}, state, {
				contextTitle: 'Edit Mode'
			})
		}

		case MovieActions.ADD_MOVIE: {
			let movies = state.movies;
			if (state.movies != null) {
				let nextMovieIndex = Math.max.apply(Math, movies.map(movie => movie.id));
				action.payload.id = nextMovieIndex++;
				movies = [...state.movies];
				movies.push(action.payload);
			}

			return Object.assign({}, state, {
				movies: movies,
				selectedMovie: action.payload,
				contextTitle: ''
			});
		}

		case MovieActions.CLOSE_ADD_MOVIE_VIEW: {
			return Object.assign({}, state, {
				contextTitle: ''
			})
		}

		case MovieActions.ADD_MOVIE_VIEW_CLOSED: {
			return Object.assign({}, state, {
				contextTitle: ''
			})
		}

		case MovieActions.SHOW_ADD_MOVIE_VIEW: {
			return Object.assign({}, state, {
				contextTitle: 'Add Movie'
			})
		}

		case MovieActions.CLOSE_MOVIE_VIEW: {
			return Object.assign({}, state, {
			})
		}

		case MovieActions.CLOSE_EDIT_VIEW: {
			return Object.assign({}, state, {
				contextTitle: ''
			})
		}

		case MovieActions.MOVIE_VIEW_CLOSED: {
			return Object.assign({}, state, {
				selectedMovie: null
			})
		}

		case MovieActions.MOVIES_LOADED: {
			return Object.assign({}, state, {
				movies: action.movies,
				loading: false,
				contextTitle: ''
			});
		}

		case MovieActions.SAVE_MOVIE: {
			return Object.assign({}, state, {
			})
		}

		case MovieActions.MOVIE_SAVED: {
			let movies = state.movies;
			if (state.movies != null) {
				let movieIndex = state.movies.findIndex(movie => movie.id == action.payload.id);
				movies = [...state.movies];
				movies.splice(movieIndex, 1, action.payload);
			}

			let searchResults = state.searchResults;
			if (state.searchResults != null) {
				let searchResultsIndex = state.searchResults.findIndex(movie => movie.id == action.payload.id);
				searchResults = [...state.searchResults];
				searchResults.splice(searchResultsIndex, 1, action.payload);
			}

			return Object.assign({}, state, {
				movies: movies,
				searchResults: searchResults,
				selectedMovie: action.payload,
				contextTitle: ''
			});
		}

		case MovieActions.SELECT_MOVIE: {
			return Object.assign({}, state, {
				selectedMovie: action.payload
			});
		}

		case MovieActions.SEARCH_MOVIE: {
			return Object.assign({}, state, {
				searchTerms: action.searchTerms
			});
		}

		case MovieActions.MOVIE_SEARCHED: {
			const searchResults = state.searchTerms === '' ? [] : action.payload;
			return Object.assign({}, state, {
				searchResults: searchResults,
				contextTitle: 'Search Results'
			});
		}

		case MovieActions.CLOSE_SEARCH_VIEW: {
			return Object.assign({}, state, {
				searchResults: null,
				searchTerms: '',
				selectedMovie: null,
				contextTitle: ''
			});
		}

		default: return state;
	}
}
