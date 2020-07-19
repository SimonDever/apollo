import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';

import { Observable, of } from 'rxjs';
import * as fromLibrary from '.';
import { StorageService } from '../../shared/services/storage.service';
import * as LibraryActions from './library.actions';
import { SearchService } from '../../shared/services/search.service';
import { NavigationService } from '../../shared/services/navigation.service';
import { map, mergeMap, tap, switchMap } from 'rxjs/operators';
import { Entry } from './entry.model';
import { ConfigService } from '../../shared/services/config.service';
import { LibraryService } from '../../shared/services/library.service';
import { initialState } from './search.reducer';

@Injectable()
export class LibraryEffects {

	constructor(private router: Router,
		private storageService: StorageService,
		private searchService: SearchService,
		private configService: ConfigService,
		private libraryService: LibraryService,
		private actions$: Actions,
		private navigationService: NavigationService,
		private zone: NgZone,
		private store: Store<fromLibrary.LibraryState>) {
	}

	@Effect()
	updateEntry$: Observable<Action> = this.actions$.pipe(
		ofType(LibraryActions.UPDATE_ENTRY),
		map(action => (action as LibraryActions.UpdateEntry).payload.entry),
		tap(entry => console.log('libraryEffects :: updateEntry', entry)),
		mergeMap(entry => this.storageService.updateEntry(entry.id, entry)),
		switchMap((entry: Entry) => [
			new LibraryActions.SelectEntry({id: entry.id}),
			new LibraryActions.LoadGenres()
		]));
		
	@Effect()
	deleteAllEntries$: Observable<Action> = this.actions$.pipe(
		ofType(LibraryActions.DELETE_ALL_ENTRIES),
		map(action => (action as LibraryActions.DeleteAllEntries)),
		map(() => new LibraryActions.AllEntriesDeleted()));

	@Effect()
	allEntriesDeleted$: Observable<Action> = this.actions$.pipe(
		ofType(LibraryActions.ALL_ENTRIES_DELETED),
		map(action => (action as LibraryActions.AllEntriesDeleted)),
		map(() => new LibraryActions.LoadGenres()));

	@Effect({ dispatch: false })
	loaded$ = this.actions$.pipe(
		ofType(LibraryActions.LOADED),
		tap(() =>	this.router.navigate(['/library'])));

	@Effect()
	load$: Observable<Action> = this.actions$.pipe(
		ofType(LibraryActions.LOAD),
		mergeMap(() => this.storageService.getAllEntries()),
		tap(entries => console.log('getAllEntries - entry:', entries)),
		map(entries => new LibraryActions.Loaded({ entries: entries })));

	@Effect()
	loadGenres$: Observable<Action> = this.actions$.pipe(
		ofType(LibraryActions.LOAD_GENRES),
		tap(() => console.log('libraryEffects :: loadGenres :: cleanArrays')),
		mergeMap(() => this.storageService.cleanArrays()),
		tap(() => console.log('libraryEffects :: loadGenres :: getAllGenres')),
		mergeMap(() => this.storageService.getAllGenres()),
		map(genres => new LibraryActions.GenresLoaded({ genres: genres })));
	
	@Effect()
	addEntry$ = this.actions$.pipe(
		ofType(LibraryActions.ADD_ENTRY),
		map(action => (action as LibraryActions.AddEntry).payload.entry),
		tap(entry => {
			console.log('libraryEffects :: addEntry :: entry', entry);
			console.log('libraryEffects :: addEntry :: cleanArrays');
		}),
		map(entry => this.searchService.cleanArrays(entry)),
		tap(entry => console.log('libraryEffects :: addEntry :: after clean', entry)),
		mergeMap(entry => this.storageService.addEntry(entry)),
		tap(entry => console.log('libraryEffects :: addEntry :: after add', entry)),
		switchMap(entry => [
			new LibraryActions.SelectEntry({ id: entry.id }),
			new LibraryActions.LoadGenres()
		]));

	@Effect()
	importEntry$ = this.actions$.pipe(
		ofType(LibraryActions.IMPORT_ENTRY),
		map(action => (action as LibraryActions.ImportEntry).payload.entry),
		mergeMap(entry => this.searchService.getFirstResult(entry)),
		map(entry => {
			console.log('libraryEffects :: importEntry$ :: got first entry result', entry);
			this.libraryService.convertUrlPath(entry);
			return new LibraryActions.AddEntry({entry});
		}));

	@Effect({ dispatch: false })
	saveApiKey$ = this.actions$.pipe(
		ofType(LibraryActions.SAVE_API_KEY),
		map(action => (action as LibraryActions.SaveApiKey).payload.apiKey),
		tap(apiKey => this.configService.save(apiKey)));

	@Effect()
	removeEntry$ = this.actions$.pipe(
		ofType(LibraryActions.REMOVE_ENTRY),
		map(action => (action as LibraryActions.RemoveEntry).payload.id),
		mergeMap(id => this.storageService.removeEntry(id)),
		switchMap(() => [
			/* console.log(`library.effects - storage response`, response);
			this.zone.run(() => this.router.navigate(['/library'])); */
			new LibraryActions.Load(),
			new LibraryActions.LoadGenres()
		]));

	@Effect()
	searchEntries$: Observable<Action> = this.actions$.pipe(
		ofType(LibraryActions.SEARCH_ENTRIES),
		map(action => (action as LibraryActions.SearchEntries).payload.searchTerms),
		mergeMap(searchTerms => this.storageService.searchEntry(searchTerms)),
		tap(response => console.log(`library.effects - storage response`, response)),
		map(entries => new LibraryActions.ShowResults({ results: entries })));

	@Effect({ dispatch: false })
	searchForMetadata$ = this.actions$.pipe(
		ofType(LibraryActions.SEARCH_FOR_METADATA),
		map(action => (action as LibraryActions.SearchForMetadata).payload),
		tap(payload => this.searchService.search(payload.keywords, payload.page)));

	@Effect({ dispatch: false })
	searchForMetadataDetails$ = this.actions$.pipe(
		ofType(LibraryActions.SEARCH_FOR_METADATA_DETAILS),
		map(action => (action as LibraryActions.SearchForMetadataDetails).payload),
		tap(payload => this.searchService.details(payload.id, payload.media_type)));

	@Effect({ dispatch: false })
	showResults$ = this.actions$.pipe(
		ofType(LibraryActions.SHOW_RESULTS),
		map(action => (action as LibraryActions.ShowResults)),
		tap(() => this.zone.run(() =>
			this.router.navigate(['/library/search'])
		)));

	@Effect({ dispatch: false })
	showMetadataResults$ = this.actions$.pipe(
		ofType(LibraryActions.SHOW_METADATA_RESULTS),
		map(action => (action as LibraryActions.ShowMetadataResults).payload.results),
		tap(results => {
			this.zone.run(() => this.router.navigate(['/library/edit/metadata']));
		}));

	@Effect({ dispatch: false })
	gotConfig$ = this.actions$.pipe(
		ofType(LibraryActions.GOT_CONFIG),
		map(action => (action as LibraryActions.GotConfig).payload.config),
		tap(config => console.log('library.effects - gotConfig - config', config)),
		mergeMap(config => this.storageService.setConfig(config)),
		tap(response => console.log(`library.effects - gotConfig - storage response`, response)));

	@Effect()
	getConfig$: Observable<Action> = this.actions$.pipe(
		ofType(LibraryActions.GET_CONFIG),
		mergeMap(() => this.storageService.getConfig()),
		map(config => {
			if (config == null || (Array.isArray(config) && config.length === 0)) {
				config = initialState.config;
			}
			console.log('effects - getConfig', config);
			return new LibraryActions.GotConfig({ config: config });
		}));
}
