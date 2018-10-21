import * as LibraryActions from "./library.actions";
import { Entry } from "./entry.model";

export interface State {
	needEntries: boolean;
	selectedEntry: Entry;
	searchResults: Entry[];
	searchTerms: string;
}

export const initialState: State = {
	needEntries: true,
	selectedEntry: null,
	searchResults: [],
	searchTerms: ''
};

export function reducer(state: State = initialState, action: LibraryActions.All): State {
	switch (action.type) {
		case LibraryActions.SHOW_RESULTS: {
			return Object.assign({}, state, {
				searchResults: action.payload.results
			});
		}

		case LibraryActions.SEARCH_ENTRIES: {
			return Object.assign({}, state, {
				searchTerms: action.payload.searchTerms
			});
		}

		case LibraryActions.LOADED: {
			return Object.assign({}, state, {
				needEntries: false
			});
		}

		case LibraryActions.UPDATE_ENTRY: {
			return Object.assign({}, state, {
				selectedEntry: action.payload.entry.changes
			});
		}

		case LibraryActions.SELECT_ENTRY: {
			return Object.assign({}, state, {
				selectedEntry: action.payload.entry
			});
		}

		case LibraryActions.ADD_ENTRY: {
			return Object.assign({}, state, {
				selectedEntry: action.payload.entry
			});
		}

		case LibraryActions.REMOVE_ENTRY: {
			let searchResults = state.searchResults;
			if (state.searchResults != null) {
				let searchResultsIndex = state.searchResults.findIndex(entry => entry.id == action.payload.id);
				searchResults = [...state.searchResults];
				searchResults.splice(searchResultsIndex, 1);
			}

			return Object.assign({}, state, {
				selectedEntry: null,
				searchResults: searchResults
			});
		}

		case LibraryActions.UPDATE_RESULTS: {
			let searchResults = state.searchResults;
			if (state.searchResults != null) {
				let searchResultsIndex = state.searchResults.findIndex(entry => entry.id == action.entry.id);
				searchResults = [...state.searchResults];
				searchResults.splice(searchResultsIndex, 1, action.entry);
			}
			return Object.assign({}, state, {
				searchResults: searchResults
			});
		}

		default: {
			return state;
		}
	}
}
