import { Update } from '@ngrx/entity';
import { Action } from '@ngrx/store';
import { Entry } from './entry.model';

export const LOAD = '[Entry] Load';
export class Load implements Action {
	readonly type = LOAD;
	constructor() { }
}

export const LOAD_GENRES = '[Entry] Load Genres';
export class LoadGenres implements Action {
	readonly type = LOAD_GENRES;
	constructor() { }
}

export const LOADED = '[Entry] Loaded';
export class Loaded implements Action {
	readonly type = LOADED;
	constructor(public payload: { entries: Entry[] }) { }
}

export const GENRES_LOADED = '[Entry] Genres Loaded';
export class GenresLoaded implements Action {
	readonly type = GENRES_LOADED;
	constructor(public payload: { genres: string[] }) { }
}

export const SEARCH_FOR_METADATA = '[Entry] Search For Metadata';
export class SearchForMetadata implements Action {
	readonly type = SEARCH_FOR_METADATA;
	constructor(public payload: { keywords: string, page?: number, tempEntry?: Entry }) { }
}

export const SEARCH_FOR_METADATA_DETAILS = '[Entry] Search For Metadata Details';
export class SearchForMetadataDetails implements Action {
	readonly type = SEARCH_FOR_METADATA_DETAILS;
	constructor(public payload: { id: any, media_type: string }) { } // id string or numberm, confirm
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
	constructor(public payload: { entry: Entry }) { }
}

export const ADD_ENTRY = '[Entry] Add Entry';
export class AddEntry implements Action {
	readonly type = ADD_ENTRY;
	constructor(public payload: { entry: Entry }) { }
}

export const REMOVE_ENTRY = '[Entry] Remove Entry';
export class RemoveEntry implements Action {
	readonly type = REMOVE_ENTRY;
	constructor(public payload: { id: any }) { }
}

export const IMPORT_ENTRY = '[Entry] Import Entry';
export class ImportEntry implements Action {
	readonly type = IMPORT_ENTRY;
	constructor(public payload: { entry: any }) { }
}

export const SELECT_ENTRY = '[Entry] Select';
export class SelectEntry implements Action {
	readonly type = SELECT_ENTRY;
	constructor(public payload: { id: any }) { }
}

export const SHOW_RESULTS = '[Entry] Show Results';
export class ShowResults implements Action {
	readonly type = SHOW_RESULTS;
	constructor(public payload: { results: Entry[] }) { }
}

export const DESELECT_ENTRY = '[Entry] Deselect Entry';
export class DeselectEntry implements Action {
	readonly type = DESELECT_ENTRY;
}

export const UPDATE_CONFIG = '[Entry] Update Config';
export class UpdateConfig implements Action {
	readonly type = UPDATE_CONFIG;
	constructor(public payload: { config: any }) { }
}

export const REFRESH_CONFIG = '[Entry] Refresh Config';
export class RefreshConfig implements Action {
	readonly type = REFRESH_CONFIG;
	constructor(public payload: { config: any }) { }
}

export const GET_CONFIG = '[Entry] Get Config';
export class GetConfig implements Action {
	readonly type = GET_CONFIG;
}

export const NEED_ENTRIES = '[Entry] Need Entries';
export class NeedEntries implements Action {
	readonly type = NEED_ENTRIES;
}

export const GOT_CONFIG = '[Entry] Got Config';
export class GotConfig implements Action {
	readonly type = GOT_CONFIG;
	constructor(public payload: { config: any }) { }
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

export const DELETE_ALL_ENTRIES = '[Entry] Delete All Entries';
export class DeleteAllEntries implements Action {
	readonly type = DELETE_ALL_ENTRIES;
	constructor() { }
}

export const ALL_ENTRIES_DELETED = '[Entry] All Entries Deleted';
export class AllEntriesDeleted implements Action {
	readonly type = ALL_ENTRIES_DELETED;
	constructor() { }
}

export const SAVE_API_KEY = '[Entry] Save API Key';
export class SaveApiKey implements Action {
	readonly type = SAVE_API_KEY;
	constructor(public payload: { apiKey: string }) { }
}

export type All =
	SelectEntry |
	SaveApiKey |
	SearchEntries |
	UpdateEntry |
	SearchForMetadata |
	ShowMetadataResults |
	RemoveEntry |
	ImportEntry |
	SearchForMetadataDetails |
	ShowMetadataDetailsResults |
	AddEntry |
	DeleteAllEntries |
	AllEntriesDeleted |
	GetConfig |
	UpdateConfig |
	RefreshConfig |
	GotConfig |
	ShowResults |
	DeselectEntry |
	Load |
	NeedEntries |
	LoadGenres |
	Loaded |
	GenresLoaded |
	UpdateResults;
