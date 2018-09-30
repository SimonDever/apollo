import { Action } from '@ngrx/store';
import { Movie } from './movie';


export const LOAD_MOVIES = '[Movie] Load Movies';
export class LoadMovies implements Action {
	readonly type = LOAD_MOVIES;
	constructor() {
	}
}

export const MOVIES_LOADED = '[Movie] Movies Loaded';
export class MoviesLoaded implements Action {
	readonly type = MOVIES_LOADED;
	constructor(public movies: Movie[]) {
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

export const SHOW_ADD_MOVIE_VIEW = '[Movie] Show Add Movie View';
export class ShowAddMovieView implements Action {
	readonly type = SHOW_ADD_MOVIE_VIEW;
	constructor() {
	}
}

export const CLOSE_MOVIE_VIEW = '[Movie] Close Movie View';
export class CloseMovieView implements Action {
	readonly type = CLOSE_MOVIE_VIEW;
	constructor() {
	}
}

export const MOVIE_VIEW_CLOSED = '[Movie] Movie View Closed';
export class MovieViewClosed implements Action {
	readonly type = MOVIE_VIEW_CLOSED;
	constructor() {
	}
}

export const CLOSE_EDIT_VIEW = '[Movie] Close Edit View';
export class CloseEditView implements Action {
	readonly type = CLOSE_EDIT_VIEW;
	constructor() {
	}
}

export const EDIT_MOVIE = '[Movie] Edit Movie';
export class EditMovie implements Action {
	readonly type = EDIT_MOVIE;
	constructor() {
	}
}

export const ADD_MOVIE = '[Movie] Add Movie';
export class AddMovie implements Action {
	readonly type = ADD_MOVIE;
	constructor(public payload: Movie) {
	}
}

export const MOVIE_ADDED = '[Movie] Movie Added';
export class MovieAdded implements Action {
	readonly type = MOVIE_ADDED;
	constructor(public payload: Movie) {
	}
}

export const CLOSE_SEARCH_VIEW = '[Movie] Close Search View';
export class CloseSearchView implements Action {
	readonly type = CLOSE_SEARCH_VIEW;
	constructor() {
	}
}


export const ADD_MOVIE_VIEW_CLOSED = '[Movie] Add Movie View Closed';
export class AddMovieViewClosed implements Action {
	readonly type = ADD_MOVIE_VIEW_CLOSED;
	constructor() {
	}
}

export const CLOSE_ADD_MOVIE_VIEW = '[Movie] Close Add Movie View';
export class CloseAddMovieView implements Action {
	readonly type = CLOSE_ADD_MOVIE_VIEW;
	constructor() {
	}
}

export const SELECT_MOVIE = '[Movie] Select';
export class SelectMovie implements Action {
	readonly type = SELECT_MOVIE;
	constructor(public payload: Movie) {
	}
}

export const SEARCH_MOVIE = '[Movie] Search';
export class SearchMovie implements Action {
	readonly type = SEARCH_MOVIE;
	constructor(public searchTerms: string) {
	}
}

export const MOVIE_SEARCHED = '[Movie] Searched';
export class MovieSearched implements Action {
	readonly type = MOVIE_SEARCHED;
	constructor(public payload: Movie[]) {
	}
}

export type All = EditMovie | CloseMovieView | CloseEditView |
	LoadMovies | MoviesLoaded | MovieViewClosed |
	SelectMovie | SaveMovie | ShowAddMovieView | CloseAddMovieView | AddMovieViewClosed |
	MovieSaved | SearchMovie | AddMovie | MovieAdded |
	MovieSearched | CloseSearchView;
