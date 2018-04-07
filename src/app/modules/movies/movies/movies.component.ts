import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Movie } from '../../../models/movie';
import { StorageService } from '../../../storage.service';
import { AppState } from '../../../redux/state/app.state';
import { Store } from '@ngrx/store';
import * as MovieActions from '../../../redux/actions/movie.actions';

@Component({
	selector: 'app-movies',
	templateUrl: './movies.component.html',
	styleUrls: ['./movies.component.css']
})
export class MoviesComponent implements OnInit {

	movies$: Observable<Movie[]>;

	constructor(private storageService: StorageService,
		private store: Store<AppState>) {
	}

	ngOnInit() {
		console.debug('movies-component ngOnInit entry');
		this.store.dispatch(new MovieActions.LoadMovies());
	}

}
