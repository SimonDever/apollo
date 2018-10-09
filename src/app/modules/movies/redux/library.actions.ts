import { Update } from '@ngrx/entity';
import { Action } from '@ngrx/store';
import { Movie } from '../movie';

export const LOAD = '[Movie] Load';
export class Load implements Action {
	readonly type = LOAD;
	constructor() { }
}

export const LOADED = '[Movie] Loaded';
export class Loaded implements Action {
	readonly type = LOADED;
	constructor(public payload: { movies: Movie[] }) { }
}

export const UPDATE_MOVIE = '[Movie] Update Movie';
export class UpdateMovie implements Action {
	readonly type = UPDATE_MOVIE;
	constructor(public payload: { movie: Update<Movie> }) { }
}

export const CLOSE_MOVIE_VIEW = '[Movie] Close Movie View';
export class CloseMovieView implements Action {
	readonly type = CLOSE_MOVIE_VIEW;
	constructor(public payload: { previousUrl: string }) {
	}
}

export const ADD_MOVIE = '[Movie] Add Movie';
export class AddMovie implements Action {
	readonly type = ADD_MOVIE;
	constructor(public payload: { movie: Movie }) {
	}
}

export const CLOSE_SEARCH_VIEW = '[Movie] Close Search View';
export class CloseSearchView implements Action {
	readonly type = CLOSE_SEARCH_VIEW;
	constructor() {
	}
}

export const SELECT_MOVIE = '[Movie] Select';
export class SelectMovie implements Action {
	readonly type = SELECT_MOVIE;
	constructor(public payload: { movie: Movie }) {
	}
}

export const SHOW_RESULTS = '[Movie] Show Results';
export class ShowResults implements Action {
	readonly type = SHOW_RESULTS;
	constructor(public payload: {
		results: Movie[],
		searchTerms: string
	}) { }
}

export const UPDATE_RESULTS = '[Movie] Update Results';
export class UpdateResults implements Action {
	readonly type = UPDATE_RESULTS;
	constructor(public movie: Movie) {
	}
}

export type LibraryActions =
	CloseMovieView |
	SelectMovie |
	UpdateMovie |
	AddMovie |
	ShowResults |
	CloseSearchView |
	Load |
	Loaded |
	UpdateResults;
