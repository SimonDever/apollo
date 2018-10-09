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
import { Movie } from '../movie';
import * as fromLibrary from './';
import * as LibraryActions from './library.actions';

@Injectable()
export class MovieEffects {

	constructor(
		private router: Router,
		private route: ActivatedRoute,
		private storageService: StorageService,
		private actions$: Actions,
		private store: Store<fromLibrary.LibraryState>) {
	}

	@Effect({ dispatch: false })
	updateMovie$ = this.actions$.ofType(LibraryActions.UPDATE_MOVIE)
		.map(action => (action as LibraryActions.UpdateMovie).payload)
		.mergeMap(payload => {
			const changes = payload.movie.changes;
			const movie = new Movie(changes.id, changes.title, changes.poster);
			return this.storageService.updateMovie(movie)
				.do(() => this.router.navigate(['/movies/view']))
		});

	@Effect()
	load$: Observable<Action> = this.actions$.ofType(LibraryActions.LOAD)
		.map(action => (action as LibraryActions.Load))
		.mergeMap(() => this.storageService.getMovies()
			.map(movies => new LibraryActions.Loaded({ movies: movies })));

	@Effect({ dispatch: false })
	addMovie$ = this.actions$.ofType(LibraryActions.ADD_MOVIE)
		.map(action => (action as LibraryActions.AddMovie).payload.movie)
		.mergeMap(movie => this.storageService.addMovie(movie)
			.do(() => this.router.navigate(['/movies/view'])));

	@Effect({ dispatch: false })
	selectMovie = this.actions$.ofType(LibraryActions.SELECT_MOVIE)
		.map(action => (action as LibraryActions.SelectMovie).payload.movie)
		.map(movie => this.router.navigate(['/movies/view']));

	@Effect({ dispatch: false })
	closeSearchView = this.actions$.ofType(LibraryActions.CLOSE_SEARCH_VIEW)
		.map(() => this.router.navigate(['/movies']));

	@Effect({ dispatch: false })
	closeMovieView = this.actions$.ofType(LibraryActions.CLOSE_MOVIE_VIEW)
		.map(action => (action as LibraryActions.CloseMovieView).payload.previousUrl)
		.mergeMap(previousUrl => this.router.navigate([previousUrl]));

	@Effect({ dispatch: false })
	showResults$ = this.actions$.ofType(LibraryActions.SHOW_RESULTS)
		.map(action => (action as LibraryActions.ShowResults).payload.searchTerms)
		.mergeMap(searchTerms =>
			this.router.navigate(['/movies/search']));
}
