import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { Movie } from '../movie';
import * as fromLibrary from '../redux';
import * as LibraryActions from '../redux/library.actions';

@Component({
	selector: 'app-movie-list',
	templateUrl: './movie-list.component.html',
	styleUrls: ['./movie-list.component.css']
})
export class MovieListComponent implements OnInit {

	movies$: Observable<Movie[]>;
	needMovies$: Observable<boolean>;
	needMoviesSub: Subscription;
	constructor(private router: Router,
		private route: ActivatedRoute,
		private store: Store<fromLibrary.LibraryState>) {
	}

	ngOnInit() {
		console.log('MovieListComponent Init')

		this.needMovies$ = this.store.pipe(select(fromLibrary.getNeedMovies));

		this.needMoviesSub = this.needMovies$.subscribe(needMovies => {
			if (needMovies) {
				this.store.dispatch(new LibraryActions.Load())
			}
		});

		this.movies$ = this.store.pipe(select(fromLibrary.getAllMovies));
	}

	ngOnDestroy() {
		this.needMoviesSub.unsubscribe();
	}

	movieClicked(movie: Movie) {
		this.store.dispatch(new LibraryActions.SelectMovie({ movie: movie }));
	}
}
