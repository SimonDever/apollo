import { Update } from '@ngrx/entity';
import { Action } from '@ngrx/store';
import { Entry } from './entry.model';

export const LOAD = '[Entry] Load';
export class Load implements Action {
	readonly type = LOAD;
	constructor() { }
}

export const LOADED = '[Entry] Loaded';
export class Loaded implements Action {
	readonly type = LOADED;
	constructor(public payload: { entries: Entry[] }) { }
}

export const SEARCH_FOR_METADATA = '[Entry] Search For Metadata';
export class SearchForMetadata implements Action {
	readonly type = SEARCH_FOR_METADATA;
	constructor(public payload: { keywords: string, page?: number }) { }
}

export const SEARCH_FOR_METADATA_DETAILS = '[Entry] Search For Metadata Details';
export class SearchForMetadataDetails implements Action {
	readonly type = SEARCH_FOR_METADATA_DETAILS;
	constructor(public payload: { id: string, media_type: string }) { }
}

export const SHOW_METADATA_DETAILS_RESULTS = '[Entry] Show Metadata Details Rsults';
export class ShowMetadataDetailsResults implements Action {
	readonly type = SHOW_METADATA_DETAILS_RESULTS;
	constructor(public payload: { details: any }) { }
}

export const SEARCH_ENTRIES = '[Entry] Search Entries';
export class SearchEntries implements Action {
	readonly type = SEARCH_ENTRIES;
	constructor(public payload: { searchTerms: string }) { }
}

export const UPDATE_ENTRY = '[Entry] Update Entry';
export class UpdateEntry implements Action {
	readonly type = UPDATE_ENTRY;
	constructor(public payload: { entry: Update<Entry> }) { }
}

export const ADD_ENTRY = '[Entry] Add Entry';
export class AddEntry implements Action {
	readonly type = ADD_ENTRY;
	constructor(public payload: { entry: Entry }) { }
}

export const REMOVE_ENTRY = '[Entry] Remove Entry';
export class RemoveEntry implements Action {
	readonly type = REMOVE_ENTRY;
	constructor(public payload: { id: string }) { }
}

export const SELECT_ENTRY = '[Entry] Select';
export class SelectEntry implements Action {
	readonly type = SELECT_ENTRY;
	constructor(public payload: { entry: Entry }) { }
}

export const SELECT_AND_VIEW_ENTRY = '[Entry] Select and View Entry';
export class SelectAndViewEntry implements Action {
	readonly type = SELECT_AND_VIEW_ENTRY;
	constructor(public payload: { entry: Entry }) { }
}

export const SHOW_RESULTS = '[Entry] Show Results';
export class ShowResults implements Action {
	readonly type = SHOW_RESULTS;
	constructor(public payload: { results: Entry[] }) { }
}

export const DESELECT_ENTRY = '[Entry] Deselect Entry';
export class DeselectEntry implements Action {
	readonly type = DESELECT_ENTRY;
	constructor(public payload: { entry: Entry }) { }
}

export const SHOW_METADATA_RESULTS = '[Entry] Show Metadata Results';
export class ShowMetadataResults implements Action {
	readonly type = SHOW_METADATA_RESULTS;
	constructor(public payload: { results: any }) { }
}

export const UPDATE_RESULTS = '[Entry] Update Results';
export class UpdateResults implements Action {
	readonly type = UPDATE_RESULTS;
	constructor(public entry: Entry) { }
}

export type All =
	SelectEntry |
	SelectAndViewEntry |
	SearchEntries |
	UpdateEntry |
	SearchForMetadata |
	ShowMetadataResults |
	SearchForMetadata |
	RemoveEntry |
	SearchForMetadataDetails |
	ShowMetadataDetailsResults |
	AddEntry |
	ShowResults |
	DeselectEntry |
	Load |
	Loaded |
	UpdateResults;
