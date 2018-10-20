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

export const SELECT_ENTRY = '[Entry] Select';
export class SelectEntry implements Action {
	readonly type = SELECT_ENTRY;
	constructor(public payload: { entry: Entry }) { }
}

export const SHOW_RESULTS = '[Entry] Show Results';
export class ShowResults implements Action {
	readonly type = SHOW_RESULTS;
	constructor(public payload: { results: Entry[] }) { }
}

export const UPDATE_RESULTS = '[Entry] Update Results';
export class UpdateResults implements Action {
	readonly type = UPDATE_RESULTS;
	constructor(public entry: Entry) { }
}

export type All =
	SelectEntry |
	SearchEntries |
	UpdateEntry |
	AddEntry |
	ShowResults |
	Load |
	Loaded |
	UpdateResults;
