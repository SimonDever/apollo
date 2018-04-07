import { Action } from '@ngrx/store';
import { Movie } from '../../models/movie';


export const LOAD_MOVIES = '[Movie] Load Movies';
export class LoadMovies implements Action {
	readonly type = LOAD_MOVIES;
	constructor() {
	}
}

export const SAVE_MOVIE = '[Movie] Save Movie';
export class SaveMovie implements Action {
	readonly type = SAVE_MOVIE;
	constructor(public payload: Movie) {
	}
}

export const MOVIE_SAVED = '[Movie] Movie Saved';
export class MovieSaved implements Action {
	readonly type = MOVIE_SAVED;
	constructor(public payload: Movie) {
	}
}

export const CLEAR_SEARCH = '[Movie] Clear Search';
export class ClearSearch implements Action {
	readonly type = CLEAR_SEARCH;
	constructor() {
	}
}

export const MOVIES_LOADED = '[Movie] Movies Loaded';
export class MoviesLoaded implements Action {
	readonly type = MOVIES_LOADED;
	constructor(public payload: Movie[]) {
	}
}

export const SELECT_MOVIE = '[Movie] Select';
export class SelectMovie implements Action {
	readonly type = SELECT_MOVIE;
	constructor(public payload: Movie) {
	}
}
/*
export const LOAD_MOVIE = '[Movie] Load';
export class LoadMovie implements Action {
	readonly type = LOAD_MOVIE;
	constructor(public id: number) {
	}
}
*/
export const SEARCH_MOVIE = '[Movie] Search';
export class SearchMovie implements Action {
	readonly type = SEARCH_MOVIE;
	constructor(public payload: string) {
	}
}
/*
export const MOVIE_LOADED = '[Movie] Loaded';
export class MovieLoaded implements Action {
	readonly type = MOVIE_LOADED;
	constructor(public id: number) {
	}
}
*/
export const MOVIE_SEARCHED = '[Movie] Searched';
export class MovieSearched implements Action {
	readonly type = MOVIE_SEARCHED;
	constructor(public payload: Movie[]) {
	}
}

export type All = LoadMovies | MoviesLoaded |
	/*MovieLoaded | LoadMovie |*/ SelectMovie | SaveMovie |
	MovieSaved | SearchMovie | MovieSearched | ClearSearch;
