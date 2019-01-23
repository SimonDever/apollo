import { Injectable, NgZone, EventEmitter } from "@angular/core";
import { Router } from '@angular/router';
import { Actions, Effect } from '@ngrx/effects';
import { Action, Store } from "@ngrx/store";
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/withLatestFrom';
import { Observable } from "rxjs/Observable";
import * as fromLibrary from '.';
import { StorageService } from "../../shared/services/storage.service";
import * as LibraryActions from './library.actions';
import { SearchService } from "../../shared/services/search.service";
import { NavigationService } from "../../shared/services/navigation.service";

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
	updateEntry$: Observable<Action> = this.actions$.ofType(LibraryActions.UPDATE_ENTRY)
		.map(action => (action as LibraryActions.UpdateEntry).payload.entry.changes)
		.mergeMap(changes =>
			this.storageService.updateEntry(changes)
				.do(() => this.zone.run(() => this.router.navigate(['/library/view'])))
				.map(entry => new LibraryActions.UpdateResults(entry)));

	@Effect({ dispatch: false })
	loaded$ = this.actions$.ofType(LibraryActions.LOADED)
		.map(action => (action as LibraryActions.Loaded).payload.entries)
		.map(entries => {
			this.zone.run(() => this.router.navigate(['/library']));
		});

	@Effect()
	load$: Observable<Action> = this.actions$.ofType(LibraryActions.LOAD)
		.map(action => (action as LibraryActions.Load))
		.mergeMap(() => this.storageService.load())
		.map(entries => new LibraryActions.Loaded({ entries: entries }));

	@Effect()
	addEntry$: Observable<Action> = this.actions$.ofType(LibraryActions.ADD_ENTRY)
		.map(action => (action as LibraryActions.AddEntry).payload.entry)
		.mergeMap(entry => this.storageService.addEntry(entry)
			.do(() => this.zone.run(() => this.router.navigate(['/library/view'])))
			.map(entry => new LibraryActions.UpdateResults(entry)));

	@Effect({ dispatch: false })
	removeEntry$ = this.actions$.ofType(LibraryActions.REMOVE_ENTRY)
		.map(action => (action as LibraryActions.RemoveEntry).payload.id)
		.mergeMap(id => this.storageService.removeEntry(id)
			.do((numRemoved) => {
				if(numRemoved !== 1) {
					console.error('Issue with removing entry with id: ' + id + '. numRemoved: ' + numRemoved);
				}
				this.zone.run(() => this.router.navigate(['/library']));
			}));

	@Effect()
	searchEntries$ = this.actions$.ofType(LibraryActions.SEARCH_ENTRIES)
		.map(action => (action as LibraryActions.SearchEntries).payload.searchTerms)
		.mergeMap(searchTerms => this.storageService.searchEntry(searchTerms)
			.map(entries => new LibraryActions.ShowResults({ results: entries })));

	@Effect({ dispatch: false })
	searchForMetadata$ = this.actions$.ofType(LibraryActions.SEARCH_FOR_METADATA)
		.map(action => (action as LibraryActions.SearchForMetadata).payload)
		.do(payload => this.searchService.search(payload.keywords, payload.page));

	@Effect({ dispatch: false })
	searchForMetadataDetails$ = this.actions$.ofType(LibraryActions.SEARCH_FOR_METADATA_DETAILS)
		.map(action => (action as LibraryActions.SearchForMetadataDetails).payload)
		.do(payload => this.searchService.details(payload.id, payload.media_type));

	@Effect({ dispatch: false })
	selectEntry = this.actions$.ofType(LibraryActions.SELECT_ENTRY)
		.map(action => (action as LibraryActions.SelectEntry))
		.do(() => this.zone.run(() => this.router.navigate(['/library/view'])));

	@Effect({ dispatch: false })
	showResults$ = this.actions$.ofType(LibraryActions.SHOW_RESULTS)
		.map(action => (action as LibraryActions.ShowResults))
		.do(() => this.zone.run(() => this.router.navigate(['/library/search'])));

	@Effect({ dispatch: false })
	showMetadataResults$ = this.actions$.ofType(LibraryActions.SHOW_METADATA_RESULTS)
		.map(action => (action as LibraryActions.ShowMetadataResults).payload.results)
		.do(results => {
			this.zone.run(() => this.router.navigate(['/library/view/metadata']));
		});

	@Effect({ dispatch: false })
	showMetadataDetailsResults$ = this.actions$.ofType(LibraryActions.SHOW_METADATA_DETAILS_RESULTS)
		.map(action => (action as LibraryActions.ShowMetadataDetailsResults).payload.details)
		.do(details => {
			//console.log('LibraryEffects :: showMetadataDetailsResults details:')
			//console.log(details);
			//this.zone.run(() => this.router.navigate(['/library/view/metadata']));
		});
}
