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

	constructor(
		private router: Router,
		private storageService: StorageService,
		private searchService: SearchService,
		private actions$: Actions,
		private navigationService: NavigationService,
		private zone: NgZone,
		private store: Store<fromLibrary.LibraryState>) {
	}

	@Effect()
	updateEntry$: Observable<Action> = this.actions$.pipe(
		ofType(LibraryActions.UPDATE_ENTRY),
		map(action => (action as LibraryActions.UpdateEntry).payload.entry),
		mergeMap(entry => this.storageService.updateEntry(Number(entry.id), entry.changes)),
		map(entry => new LibraryActions.UpdateResults(entry)));

	@Effect({ dispatch: false })
	loaded$ = this.actions$.pipe(
		ofType(LibraryActions.LOADED),
		tap(() => this.zone.run(() =>
			this.router.navigate(['/library']))
		));

	@Effect()
	load$: Observable<Action> = this.actions$.pipe(
		ofType(LibraryActions.LOAD),
		mergeMap(() => this.storageService.load()),
		map(entries => new LibraryActions.Loaded({ entries: entries })));

	@Effect()
	addEntry$: Observable<Action> = this.actions$.pipe(
		ofType(LibraryActions.ADD_ENTRY),
		map(action => (action as LibraryActions.AddEntry).payload.entry),
		mergeMap(entry => this.storageService.addEntry(entry)),
		map(entry => new LibraryActions.UpdateResults(entry)),
		tap(() => this.zone.run(() => this.router.navigate(['/library/view']))));

	@Effect()
	importEntry$: Observable<Action> = this.actions$.pipe(
		ofType(LibraryActions.IMPORT_ENTRY),
		map(action => (action as LibraryActions.ImportEntry).payload.entry),
		mergeMap(entry => this.storageService.addEntry(entry)),
		map(entry => new LibraryActions.UpdateResults(entry)));

	@Effect({ dispatch: false })
	removeEntry$ = this.actions$.pipe(
		ofType(LibraryActions.REMOVE_ENTRY),
		map(action => (action as LibraryActions.RemoveEntry).payload.id),
		mergeMap(id => this.storageService.removeEntry(id)),
		tap(count => {
			if (count === 1) {
				this.zone.run(() => this.router.navigate(['/library']));
			}
		}));

	@Effect()
	searchEntries$ = this.actions$.pipe(
		ofType(LibraryActions.SEARCH_ENTRIES),
		map(action => (action as LibraryActions.SearchEntries).payload.searchTerms),
		mergeMap(searchTerms => this.storageService.searchEntry(searchTerms)),
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
		tap(payload => this.searchService.details(payload.id, payload.media_type))); // shouldn't this be map, move actions back in here

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

/* 	@Effect({ dispatch: false })
	showMetadataDetailsResults$ = this.actions$.ofType(LibraryActions.SHOW_METADATA_DETAILS_RESULTS)
		.map(action => (action as LibraryActions.ShowMetadataDetailsResults).payload.details)
		.do(details => {
			//console.log('LibraryEffects :: showMetadataDetailsResults details:')
			//console.log(details);
			//this.zone.run(() => this.router.navigate(['/library/view/metadata']));
		}); */
}
