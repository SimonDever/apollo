import { Component, OnInit } from '@angular/core';
import { Movie } from '../movie';
import { Observable } from 'rxjs/Observable';
import { StorageService } from '../../../storage.service';
import { Store } from '@ngrx/store';
import { AppState } from '../../../app.state';
import * as MovieActions from '../movie.actions';
import { Subscription } from 'rxjs/Subscription';

@Component({
	selector: 'app-movie-search-results',
	templateUrl: './movie-search-results.component.html',
	styleUrls: ['./movie-search-results.component.css']
})
export class MovieSearchResultsComponent implements OnInit {

	movies: Movie[];
	searchResultsSubscription: Subscription;
	searchTerms: string;
	searchTermsSubscription: Subscription;

	constructor(private storageService: StorageService,
		private store: Store<AppState>) { }

	ngOnInit() {
		this.searchTermsSubscription = this.store.select('movieState').select('searchTerms')
			.subscribe(searchTerms => this.searchTerms = searchTerms);
			
		this.searchResultsSubscription = this.store.select('movieState').select('searchResults')
			.subscribe(movies => this.movies = movies);
	}

	ngOnDestroy(): void {
		this.searchTermsSubscription.unsubscribe();
		this.searchResultsSubscription.unsubscribe();
	}

	close() {
		this.store.dispatch(new MovieActions.CloseSearchView());
	}

	movieClicked(movie: Movie) {
		this.store.dispatch(new MovieActions.SelectMovie(movie));
	}
}
