import { Injectable, NgZone, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';

import { Observable } from 'rxjs';
import * as fromLibrary from '.';
import { StorageService } from '../../shared/services/storage.service';
import * as LibraryActions from './library.actions';
import { SearchService } from '../../shared/services/search.service';
import { NavigationService } from '../../shared/services/navigation.service';
import { map, mergeMap, tap } from 'rxjs/operators';

@Injectable()
export class LibraryEffects {

	constructor(private router: Router,
		private storageService: StorageService,
		private searchService: SearchService,
		private actions$: Actions,
		private navigationService: NavigationService,
		private zone: NgZone,
		private store: Store<fromLibrary.LibraryState>) {
	}

	@Effect({ dispatch: false })
	updateEntry$ = this.actions$.pipe(
		ofType(LibraryActions.UPDATE_ENTRY),
		map(action => (action as LibraryActions.UpdateEntry).payload.entry),
		mergeMap(entry => this.storageService.updateEntry(entry.id, entry)),
		tap(response => console.log(`library.effects - storage response`, response)));

	@Effect({ dispatch: false })
	loaded$ = this.actions$.pipe(
		ofType(LibraryActions.LOADED),
		tap(() =>	this.router.navigate(['/library'])));

	@Effect()
	load$: Observable<Action> = this.actions$.pipe(
		ofType(LibraryActions.LOAD),
		mergeMap(() => this.storageService.getAllEntries()),
		map(entries => new LibraryActions.Loaded({ entries: entries })));

	@Effect({ dispatch: false })
	addEntry$ = this.actions$.pipe(
		ofType(LibraryActions.ADD_ENTRY),
		map(action => (action as LibraryActions.AddEntry).payload.entry),
		mergeMap(entry => this.storageService.addEntry(entry)),
		tap(response => {
			console.log(`library.effects - storage response`, response);
			this.zone.run(() => this.router.navigate(['/library/view']));
		}));

	@Effect({ dispatch: false })
	importEntry$ = this.actions$.pipe(
		ofType(LibraryActions.IMPORT_ENTRY),
		map(action => (action as LibraryActions.ImportEntry).payload.entry),
		mergeMap(entry => this.storageService.addEntry(entry)),
		tap(response => {
			console.log(`library.effects - storage response`, response);
			this.storageService.importStorageCount++;
		}));

	@Effect({ dispatch: false })
	removeEntry$ = this.actions$.pipe(
		ofType(LibraryActions.REMOVE_ENTRY),
		map(action => (action as LibraryActions.RemoveEntry).payload.id),
		mergeMap(id => this.storageService.removeEntry(id)),
		tap(response => {
			console.log(`library.effects - storage response`, response);
			this.zone.run(() => this.router.navigate(['/library']));
		}));

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
			console.log(`${this.navigationService.metadataParent}/metadata`);
			this.zone.run(() => this.router.navigate([`${this.navigationService.metadataParent}/metadata`]));
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
				config = { // TODO: move to model file or store index, move from setting component too
					boxHeight: '400px',
					boxWidth: '290px',
					virtualScrolling: true
				};
			}
			console.log('effects - getConfig', config);
			return new LibraryActions.GotConfig({ config: config });
		}));
}
