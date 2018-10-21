import { Injectable } from "@angular/core";
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

@Injectable()
export class LibraryEffects {

	constructor(
		private router: Router,
		private storageService: StorageService,
		private actions$: Actions,
		private store: Store<fromLibrary.LibraryState>) {
	}

	@Effect()
	updateEntry$: Observable<Action> = this.actions$.ofType(LibraryActions.UPDATE_ENTRY)
		.map(action => (action as LibraryActions.UpdateEntry).payload.entry.changes)
		.mergeMap(changes =>
			this.storageService.updateEntry({
				id: changes.id, title: changes.title, poster: changes.poster
			})
			.do(() => this.router.navigate(['/library/view']))
			.map(entry => new LibraryActions.UpdateResults(entry)));

	@Effect()
	load$: Observable<Action> = this.actions$.ofType(LibraryActions.LOAD)
		.map(action => (action as LibraryActions.Load))
		.mergeMap(() => this.storageService.load())
		.map(entries => new LibraryActions.Loaded({ entries: entries }));

	@Effect()
	addEntry$: Observable<Action> = this.actions$.ofType(LibraryActions.ADD_ENTRY)
		.map(action => (action as LibraryActions.AddEntry).payload.entry)
		.mergeMap(entry => this.storageService.addEntry(entry)
			.do(() => this.router.navigate(['/library/view']))
			.map(entry => new LibraryActions.UpdateResults(entry)));

	@Effect({ dispatch: false })
	removeEntry$ = this.actions$.ofType(LibraryActions.REMOVE_ENTRY)
		.map(action => (action as LibraryActions.RemoveEntry).payload.id)
		.mergeMap(id => this.storageService.removeEntry(id)
			.do(numRemoved => {
				console.log(`Removed ${numRemoved}`);
				this.router.navigate(['/library'])
			}));

	@Effect()
	searchEntries$ = this.actions$.ofType(LibraryActions.SEARCH_ENTRIES)
		.map(action => (action as LibraryActions.SearchEntries).payload.searchTerms)
		.mergeMap(searchTerms => this.storageService.searchEntry(searchTerms)
			.map(entries => new LibraryActions.ShowResults({ results: entries })));

	@Effect({ dispatch: false })
	selectEntry = this.actions$.ofType(LibraryActions.SELECT_ENTRY)
		.map(action => (action as LibraryActions.SelectEntry))
		.do(() => this.router.navigate(['/library/view']));

	@Effect({ dispatch: false })
	showResults$ = this.actions$.ofType(LibraryActions.SHOW_RESULTS)
		.map(action => (action as LibraryActions.ShowResults))
		.do(() => this.router.navigate(['/library/search']));
}
