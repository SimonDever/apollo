import { Observable } from 'rxjs/Observable';
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { publishReplay } from 'rxjs/operators';
import "rxjs/add/operator/publishReplay";

import { AppState } from '../../../app.state';
import { Movie } from '../movie';
import * as MovieActions from '../movie.actions';

@Component({
	selector: 'app-movie',
	templateUrl: './movie.component.html',
	styleUrls: ['./movie.component.css']
})
export class MovieComponent implements OnInit {

	movie$: Observable<Movie>;

	constructor(private store: Store<AppState>) { }

	ngOnInit() {
		this.movie$ = this.store.select('movieState').select('selectedMovie')
			.publishReplay(1).refCount();
	}

	edit() {
		this.store.dispatch(new MovieActions.EditMovie());
	}

	close() {
		this.store.dispatch(new MovieActions.CloseMovieView());
	}
}
