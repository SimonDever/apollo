import { ActivatedRoute, Router } from '@angular/router';
import { SelectMovie } from './../actions/movie.actions';
import { Injectable } from "@angular/core";
import { Effect, Actions } from '@ngrx/effects';
import { Observable } from "rxjs/Observable";
import { Action } from "@ngrx/store";
import { StorageService } from "../../storage.service";
import * as MovieAction from '../actions/movie.actions';
import { Movie } from '../../models/movie';

import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/do';

@Injectable()
export class MovieEffects {

	constructor(
		private router: Router,
		private route: ActivatedRoute,
		private storageService: StorageService,
		private actions$: Actions) {
	}

	@Effect()
	loadMovies$: Observable<Action> = this.actions$.ofType(MovieAction.LOAD_MOVIES)
		.mergeMap(action => {
			return this.storageService.getMovies()
				.map(movies => new MovieAction.MoviesLoaded(movies));
		});

	@Effect({ dispatch: false })
	selectMovie = this.actions$.ofType(MovieAction.SELECT_MOVIE)
		.map(action => (action as MovieAction.SelectMovie).payload)
		.map(movie => {
			this.router.navigateByUrl('/movies/h/' + movie.id)
		});

	@Effect()
	saveMovie: Observable<Action> = this.actions$.ofType(MovieAction.SAVE_MOVIE)
		.map(action => (action as MovieAction.SaveMovie).payload)
		.mergeMap(movie =>
			this.storageService.saveMovie(movie)
				.do(_ => this.router.navigateByUrl('/movies/h/' + movie.id))
				.map(_ => new MovieAction.MovieSaved(movie))
		);

	@Effect()
	searchMovie: Observable<Action> = this.actions$.ofType(MovieAction.SEARCH_MOVIE)
		.map(action => (action as MovieAction.SearchMovie).payload)
		.mergeMap(title =>
			this.storageService.searchMovie(title)
				.do(_ => this.router.navigateByUrl(title === '' ? '' : '/movies/s/' + title))
				.map(movies => {
					if (title === '') return new MovieAction.MoviesLoaded(movies);
					return new MovieAction.MovieSearched(movies);
				})
		);

	@Effect({ dispatch: false })
	clearSearch = this.actions$.ofType(MovieAction.CLEAR_SEARCH)
		.map(action => (action as MovieAction.ClearSearch))
		.map(_ =>
			this.router.navigateByUrl('')
		);
}
