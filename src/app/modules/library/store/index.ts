import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromRoot from '../../../app.reducer';
import * as fromLibrary from './library.reducer';
import * as fromSearch from './search.reducer';

export interface State extends fromRoot.State {
	library: LibraryState;
};

export interface LibraryState {
	collection: fromLibrary.State;
	search: fromSearch.State;
};

export const reducers = {
	collection: fromLibrary.reducer,
	search: fromSearch.reducer
};

export const selectLibraryState = createFeatureSelector<LibraryState>('library');

export const getCollectionState = createSelector(
	selectLibraryState, (library: LibraryState) => library.collection
);

export const selectSearchState = createSelector(
	selectLibraryState, (library: LibraryState) => library.search
);

export const getNeedEntries = createSelector(
	selectSearchState,
	state => state.needEntries
);

export const getSearchTerms = createSelector(
	selectSearchState,
	state => state.searchTerms
);

export const getSearchResults = createSelector(
	selectSearchState,
	state => state.searchResults
);

export const getMetadataSearchResults = createSelector(
	selectSearchState,
	state => state.metadataSearchResults
);

export const getMetadataDetailsResults = createSelector(
	selectSearchState,
	state => state.metadataDetailsResults
);

export const getSelectedEntry = createSelector(
	selectSearchState,
	state => state.selectedEntry
);

export const {
	selectIds: getEntryIds,
	selectEntities: getEntryEntities,
	selectAll: getAllEntries,
	selectTotal: getTotalEntries
} = fromLibrary.adapter.getSelectors(getCollectionState);
