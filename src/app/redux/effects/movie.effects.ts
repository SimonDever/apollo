import { ActivatedRoute, Router } from '@angular/router';
import { SelectMovie } from './../actions/movie.actions';
import { Injectable } from "@angular/core";
import { Effect, Actions } from '@ngrx/effects';
import { Observable } from "rxjs/Observable";
import { Action, Store } from "@ngrx/store";
import { StorageService } from "../../storage.service";
import { Movie } from '../../models/movie';
import { AppState } from '../state/app.state';
import * as MovieAction from '../actions/movie.actions';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/withLatestFrom';

@Injectable()
export class MovieEffects {

	constructor(
		private router: Router,
		private route: ActivatedRoute,
		private storageService: StorageService,
		private actions$: Actions,
		private store: Store<AppState>) {
	}

	@Effect()
	loadMovies$: Observable<Action> = this.actions$.ofType(MovieAction.LOAD_MOVIES)
		.mergeMap(action => {
			return this.storageService.getMovies()
				.map(movies => new MovieAction.MoviesLoaded(movies));
		});

	@Effect({ dispatch: false })
	moviesLoaded = this.actions$.ofType(MovieAction.MOVIES_LOADED)
		.map(action => (action as MovieAction.MoviesLoaded).movies)
		.map(movies => { });

	@Effect({ dispatch: false })
	movieViewClosed = this.actions$.ofType(MovieAction.MOVIE_VIEW_CLOSED)
		.map(action => (action as MovieAction.MovieViewClosed))
		.map(_ => { });
	/*
	.withLatestFrom(this.store.select(state => state.movieState))
	.map(([action, movieState]) => {
		if (movieState.searchResults != null && movieState.searchTerms != null) {
			console.log('Found search results and search terms so redirecting to search results component');
			return this.router.navigateByUrl('/movies/s/' + movieState.searchTerms)
		} else {
			console.log('No search results or search terms found so redirecting to movie list')
			return this.router.navigateByUrl('/movies');
		}
	});
	*/
	@Effect({ dispatch: false })
	editMovie = this.actions$.ofType(MovieAction.EDIT_MOVIE)
		.map(action => (action as MovieAction.EditMovie))
		/* .map(action => (action as MovieAction.EditMovie).payload) */
		.map(_ => {
			this.router.navigateByUrl('/movies/edit');
		});

	@Effect({ dispatch: false })
	addMovie =this.actions$.ofType(MovieAction.SHOW_ADD_MOVIE_VIEW)
		.map(action => (action as MovieAction.ShowAddMovieView))
		.map(_ => {
			this.router.navigateByUrl('movies/add');
		});

	/*
	.withLatestFrom(this.store.select(state => state.movieState))
	.switchMap(([action, movieState]) => {
		if (movieState.selectedMovie != null) {
	*/

	@Effect()
	closeMovieView$: Observable<Action> = this.actions$.ofType(MovieAction.CLOSE_MOVIE_VIEW)
		.map(action => (action as MovieAction.CloseMovieView))
		.withLatestFrom(this.store.select(state => state.movieState))
		.map(([action, movieState]) => {
			if (movieState.searchResults != null && movieState.searchTerms != null) {
				console.log('Found search results and search terms so redirecting to search results component');
				return this.router.navigateByUrl('/movies/s/' + movieState.searchTerms)
			} else {
				console.log('No search results or search terms found so redirecting to movie list')
				return this.router.navigateByUrl('/movies');
			}
		})
		.map(_ => new MovieAction.MovieViewClosed());
	/*
	.withLatestFrom(this.store.select(state => state.movieState))
	.switchMap(([action, movieState]) => {
		if (movieState.selectedMovie != null) {
			console.log('selectedMovie: ', movieState.selectedMovie);
			this.router.navigateByUrl('/movies/h/' + movieState.selectedMovie.id);
			return new MovieAction.MovieViewClosed();
		}
	});
	*/

	@Effect({ dispatch: false })
	closeSearchView = this.actions$.ofType(MovieAction.CLOSE_SEARCH_VIEW)
		.map(action => { return this.router.navigateByUrl('/movies') });

	@Effect({ dispatch: false })
	selectMovie = this.actions$.ofType(MovieAction.SELECT_MOVIE)
		.map(action => (action as MovieAction.SelectMovie).payload)
		.map(movie => {
			this.router.navigateByUrl('/movies/h/' + movie.id)
		});

	@Effect()
	saveMovie$: Observable<Action> = this.actions$.ofType(MovieAction.SAVE_MOVIE)
		.map(action => (action as MovieAction.SaveMovie).payload)
		.mergeMap(movie =>
			this.storageService.saveMovie(movie)
				.do(_ => this.router.navigateByUrl('/movies/h/' + movie.id))
				.map(_ => new MovieAction.MovieSaved(movie)));


	@Effect()
	addMovie$: Observable<Action> = this.actions$.ofType(MovieAction.ADD_MOVIE)
		.map(action => (action as MovieAction.AddMovie).payload)
		.mergeMap(movie =>
			this.storageService.saveMovie(movie)
				.do(_ => this.router.navigateByUrl('/movies/h/' + movie.id))
				.map(_ => new MovieAction.MovieAdded(movie)));

	@Effect({ dispatch: false })
	movieAdded$ = this.actions$.ofType(MovieAction.MOVIE_ADDED)
			.map(action => (action as MovieAction.MovieAdded).payload)
			.mergeMap(movie => this.storageService.addMovie(movie)
				.do(_ => this.router.navigateByUrl('/movies/h/' + movie.id)));

	@Effect()
	searchMovie$: Observable<Action> = this.actions$.ofType(MovieAction.SEARCH_MOVIE)
		.map(action => (action as MovieAction.SearchMovie).searchTerms)
		.mergeMap(searchTerms =>
			this.storageService.searchMovie(searchTerms)
				.do(_ => this.router.navigateByUrl(searchTerms === '' ? '' : '/movies/s/' + searchTerms))
				.map(movies => new MovieAction.MovieSearched(movies)));


	@Effect({ dispatch: false })
	closeEditView = this.actions$.ofType(MovieAction.CLOSE_EDIT_VIEW)
		.map(action => (action as MovieAction.CloseEditView))
		.withLatestFrom(this.store.select(state => state.movieState))
		.switchMap(([action, movieState]) => {
			if (movieState.selectedMovie != null) {
				return this.router.navigateByUrl('/movies/h/' + movieState.selectedMovie.id);
			} else {
				console.error("Should have a selectedMovie set in state as we're leaving edit mode.");
				return this.router.navigateByUrl('/movies');
			}
		});

	@Effect()
	closeAddMovieView = this.actions$.ofType(MovieAction.CLOSE_ADD_MOVIE_VIEW)
		.map(action => (action as MovieAction.CloseAddMovieView))
		.map(movies => new MovieAction.AddMovieViewClosed())
		.do(_ => {
			return this.router.navigateByUrl('/movies');
		});

			
	@Effect({ dispatch: false })
	addMovieViewClosed = this.actions$.ofType(MovieAction.ADD_MOVIE_VIEW_CLOSED)
		.map(action => (action as MovieAction.AddMovieViewClosed))
		.map(_ => { });
}
