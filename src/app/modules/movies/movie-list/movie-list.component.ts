import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { StorageService } from '../../../storage.service';
import { AppState } from '../../../redux/state/app.state';
import { Store } from '@ngrx/store';
import * as MovieActions from '../../../redux/actions/movie.actions';
import { Movie } from '../../../models/movie';

@Component({
	selector: 'app-movie-list',
	templateUrl: './movie-list.component.html',
	styleUrls: ['./movie-list.component.css']
})
export class MovieListComponent implements OnInit {

	movies$ = this.store.select('movieState').select('movies');

	constructor(private router: Router,
		private route: ActivatedRoute,
		private store: Store<AppState>) { }

	ngOnInit() {
		console.debug('movie-list component ngOnInit entry');
		this.store.dispatch(new MovieActions.LoadMovies());
	}

	movieClicked(movie: Movie) {
		let location = '/movies';
		this.store.dispatch(new MovieActions.SelectMovie(movie, location));
	}
}
