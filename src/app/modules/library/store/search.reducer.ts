import * as LibraryActions from './library.actions';
import { Entry } from './entry.model';

export interface State {
	needEntries: boolean;
	tempEntry: Entry;
	selectedEntryId: any;
	searchResults: Entry[];
	searchTerms: string;
	metadataSearchResults: any;
	metadataDetailsResults: Map<any, any>;
	config: any;
	apiKey: string;
}

export const initialState: State = {
	needEntries: true,
	tempEntry: null,
	selectedEntryId: null,
	searchResults: [],
	searchTerms: '',
	metadataSearchResults: null,
	metadataDetailsResults: new Map(),
	config: null,
	apiKey: ''
};

export function reducer(state: State = initialState, action: LibraryActions.All): State {
	switch (action.type) {
		case LibraryActions.SHOW_RESULTS: {
			return Object.assign({}, state, {
				searchResults: action.payload.results
			});
		}

		case LibraryActions.SHOW_METADATA_RESULTS: {
			return Object.assign({}, state, {
				metadataSearchResults: action.payload.results
			});
		}

		case LibraryActions.SEARCH_FOR_METADATA: {
			return Object.assign({}, state, {
				tempEntry: action.payload.tempEntry
			});
		}

		case LibraryActions.SAVE_API_KEY: {
			return Object.assign({}, state, {
				apiKey: action.payload.apiKey
			});
		}

		case LibraryActions.SHOW_METADATA_DETAILS_RESULTS: {
			const newResults = new Map(state.metadataDetailsResults);
			newResults.set(action.payload.details.id, action.payload.details);
			return Object.assign({}, state, {
				metadataDetailsResults: newResults
			});
		}

		case LibraryActions.UPDATE_ENTRY: {
			return Object.assign({}, state, {
				metadataSearchResults: null,
				metadataDetailsResults: null
			});
		}

		case LibraryActions.SEARCH_ENTRIES: {
			return Object.assign({}, state, {
				searchTerms: action.payload.searchTerms,
				metadataSearchResults: null,
				metadataDetailsResults: null
			});
		}

		case LibraryActions.LOADED: {
			return Object.assign({}, state, {
				needEntries: false
			});
		}

		case LibraryActions.SELECT_ENTRY: {
			return Object.assign({}, state, {
				selectedEntryId: action.payload.id
			});
		}

		case LibraryActions.DESELECT_ENTRY: {
			return Object.assign({}, state, {
				selectedEntryId: null,
				metadataSearchResults: null,
				metadataDetailsResults: null
			});
		}

		case LibraryActions.ADD_ENTRY: {
			return Object.assign({}, state, {
				selectedEntryId: action.payload.entry.id
			});
		}

		case LibraryActions.REFRESH_CONFIG: {
			return Object.assign({}, state, {
				config: action.payload.config
			});
		}

		case LibraryActions.UPDATE_CONFIG: {
			return Object.assign({}, state, {
				config: action.payload.config
			});
		}

		case LibraryActions.GOT_CONFIG: {
			return Object.assign({}, state, {
				config: action.payload.config
			});
		}

		case LibraryActions.REMOVE_ENTRY: {
			let searchResults = state.searchResults;
			if (state.searchResults != null) {
				const searchResultsIndex = state.searchResults.findIndex(entry => entry.id === action.payload.id);
				searchResults = [...state.searchResults];
				searchResults.splice(searchResultsIndex, 1);
			}

			return Object.assign({}, state, {
				selectedEntryId: null,
				metadataSearchResults: null,
				metadataDetailsResults: null,
				searchResults: searchResults
			});
		}

		case LibraryActions.UPDATE_RESULTS: {
			const searchResults = state.searchResults;
			if (searchResults != null) {
				const searchResultsIndex = searchResults.findIndex(entry => entry.id === action.entry.id);
				searchResults.splice(searchResultsIndex, 1, action.entry);
				return Object.assign({}, state, {
					searchResults: searchResults
				});
			}
			return state;
		}

		default: {
			return state;
		}
	}
}
