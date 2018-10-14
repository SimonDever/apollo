import { Injectable } from "@angular/core";
import { ActivatedRoute, Router } from '@angular/router';
import { Actions, Effect } from '@ngrx/effects';
import { Action, Store } from "@ngrx/store";
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/withLatestFrom';
import { Observable } from "rxjs/Observable";
import { StorageService } from "../../shared/services/storage.service";
import { Movie } from './movie';
import * as fromLibrary from '.';
import * as LibraryActions from './library.actions';

@Injectable()
export class LibraryEffects {

	constructor(
		private router: Router,
		private route: ActivatedRoute,
		private storageService: StorageService,
		private actions$: Actions,
		private store: Store<fromLibrary.LibraryState>) {
	}

	@Effect({ dispatch: false })
	updateMovie$ = this.actions$.ofType(LibraryActions.UPDATE_MOVIE)
		.map(action => (action as LibraryActions.UpdateMovie).payload.movie.changes)
		.mergeMap(changes => this.storageService.updateMovie({
			id: changes.id,
			title: changes.title,
			poster: changes.poster
		}).do(() => this.router.navigate(['/library/view'])));

	@Effect()
	load$: Observable<Action> = this.actions$.ofType(LibraryActions.LOAD)
		.map(action => (action as LibraryActions.Load))
		.mergeMap(() => this.storageService.getMovies()
			.map(movies => new LibraryActions.Loaded({ movies: movies })));

	@Effect({ dispatch: false })
	addMovie$ = this.actions$.ofType(LibraryActions.ADD_MOVIE)
		.map(action => (action as LibraryActions.AddMovie).payload.movie)
		.mergeMap(movie => this.storageService.addMovie(movie)
			.do(() => this.router.navigate(['/library/view'])));

	@Effect()
	searchMovies$ = this.actions$.ofType(LibraryActions.SEARCH_MOVIES)
		.map(action => (action as LibraryActions.SearchMovies).payload.searchTerms)
		.mergeMap(searchTerms => this.storageService.searchMovie(searchTerms)
			.map(movies => new LibraryActions.ShowResults({
				results: movies
			})));

	@Effect({ dispatch: false })
	selectMovie = this.actions$.ofType(LibraryActions.SELECT_MOVIE)
		.map(action => (action as LibraryActions.SelectMovie))
		.map(() => this.router.navigate(['/library/view']));

	@Effect({ dispatch: false })
	showResults$ = this.actions$.ofType(LibraryActions.SHOW_RESULTS)
		.map(action => (action as LibraryActions.ShowResults))
		.mergeMap(() => this.router.navigate(['/library/search']));
}
