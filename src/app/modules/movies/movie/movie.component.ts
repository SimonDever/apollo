import { Observable } from 'rxjs/Observable';
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { publishReplay } from 'rxjs/operators';
import "rxjs/add/operator/publishReplay";

import { AppState } from '../../../app.state';
import { Movie } from '../movie';
import * as MovieActions from '../movie.actions';
import { Subscription } from 'rxjs/Subscription';

@Component({
	selector: 'app-movie',
	templateUrl: './movie.component.html',
	styleUrls: ['./movie.component.css']
})
export class MovieComponent implements OnInit {

	movie: Movie;
	selectedMovieSubscription: Subscription;

	constructor(private store: Store<AppState>) { }

	ngOnInit() {
		this.selectedMovieSubscription = this.store.select('movieState').select('selectedMovie')
			.subscribe(selectedMovie => this.movie = selectedMovie);
	}

	ngOnDestroy() {
		this.selectedMovieSubscription.unsubscribe();
	}

	edit() {
		this.store.dispatch(new MovieActions.EditMovie());
	}

	close() {
		this.store.dispatch(new MovieActions.CloseMovieView());
	}

	searchMetadataProvider() {
		this.store.dispatch(new MovieActions.SearchMetadataProvider(this.movie));
	}
}
