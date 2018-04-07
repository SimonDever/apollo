import { Component, OnInit } from '@angular/core';
import { Movie } from '../../../models/movie';
import { Observable } from 'rxjs/Observable';
import { StorageService } from '../../../storage.service';
import { Store } from '@ngrx/store';
import { AppState } from '../../../redux/state/app.state';

@Component({
	selector: 'app-movie-search-results',
	templateUrl: './movie-search-results.component.html',
	styleUrls: ['./movie-search-results.component.css']
})
export class MovieSearchResultsComponent implements OnInit {

	movies$: Observable<Movie[]>;

	constructor(private storageService: StorageService,
		private store: Store<AppState>) {
	}

	ngOnInit() {
		console.debug('movie-search-results component ngOnInit entry');
		this.movies$ = this.store.select('movieState').select('searchResults');
	}
}
