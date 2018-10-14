import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromRoot from '../../../app.reducer';
import * as fromLibrary from './library.reducer';
import * as fromSearch from './search.reducer';

export interface LibraryState {
	movies: fromLibrary.State;
	search: fromSearch.State;
}

export interface State extends fromRoot.State {
	library: LibraryState;
}

export const reducers = {
	movies: fromLibrary.reducer,
	search: fromSearch.reducer
};

export const selectLibraryState = createFeatureSelector<LibraryState>('library');

export const getMoviesState = createSelector(
	selectLibraryState, (library: LibraryState) => library.movies
)

export const selectSearchState = createSelector(
	selectLibraryState, (library: LibraryState) => library.search
);

export const getMovies = createSelector(
	selectLibraryState,
	state => state.movies.entities
);

export const getNeedMovies = createSelector(
	selectSearchState,
	state => state.needMovies
);

export const getSearchTerms = createSelector(
	selectSearchState,
	state => state.searchTerms
)

export const getSearchResults = createSelector(
	selectSearchState,
	state => state.searchResults
)

export const getSelectedMovie = createSelector(
	selectSearchState,
	state => state.selectedMovie
)

export const {
	selectIds: getMovieIds,
	selectEntities: getMovieEntities,
	selectAll: getAllMovies,
	selectTotal: getTotalMovies
} = fromLibrary.adapter.getSelectors(getMoviesState);
