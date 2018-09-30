import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { StorageService } from '../../../storage.service';
import { AppState } from '../../../app.state';
import { Store } from '@ngrx/store';
import * as MovieActions from '../movie.actions';
import { Movie } from '../movie';
import { ISubscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';

@Component({
	selector: 'app-movie-list',
	templateUrl: './movie-list.component.html',
	styleUrls: ['./movie-list.component.css']
})
export class MovieListComponent implements OnInit {

	movies$: Observable<Movie[]>;

	constructor(private router: Router,
		private route: ActivatedRoute,
		private store: Store<AppState>) { }

	ngOnInit() {
		this.movies$ = this.store.select('movieState').select('movies')
			.publishReplay(1).refCount();
		this.store.dispatch(new MovieActions.LoadMovies());
	}

	movieClicked(movie: Movie) {
		this.store.dispatch(new MovieActions.SelectMovie(movie));
	}
}
