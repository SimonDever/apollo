import { Component, OnInit } from '@angular/core';
import { Movie } from '../../../models/movie';
import { Observable } from 'rxjs/Observable';
import { StorageService } from '../../../storage.service';
import { Store } from '@ngrx/store';
import { AppState } from '../../../redux/state/app.state';
import * as MovieActions from '../../../redux/actions/movie.actions';
import { Subscription } from 'rxjs/Subscription';

@Component({
	selector: 'app-movie-search-results',
	templateUrl: './movie-search-results.component.html',
	styleUrls: ['./movie-search-results.component.css']
})
export class MovieSearchResultsComponent implements OnInit {

	movies$: Observable<Movie[]>;
	searchTerms$: Observable<string>;

	constructor(private storageService: StorageService,
		private store: Store<AppState>) { }

	ngOnInit() {
		this.searchTerms$ = this.store.select('movieState').select('searchTerms')
			.publishReplay(1).refCount();
		this.movies$ = this.store.select('movieState').select('searchResults')
			.publishReplay(1).refCount();
	}

	close() {
		this.store.dispatch(new MovieActions.CloseSearchView());
	}

	movieClicked(movie: Movie) {
		this.store.dispatch(new MovieActions.SelectMovie(movie));
	}
}
