import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { StorageService } from '../../shared/services/storage.service';
import { Movie } from '../movie';
import * as fromLibrary from '../redux/index';
import * as LibraryActions from '../redux/library.actions';

@Component({
	selector: 'app-movie-search-results',
	templateUrl: './movie-search-results.component.html',
	styleUrls: ['./movie-search-results.component.css']
})
export class MovieSearchResultsComponent implements OnInit {

	movies$: Observable<Movie[]>;

	constructor(private storageService: StorageService,
		private store: Store<fromLibrary.LibraryState>) { }

	ngOnInit() {
		this.movies$ = this.store.pipe(select(fromLibrary.getSearchResults));
	}

	close() {
		this.store.dispatch(new LibraryActions.CloseSearchView());
	}

	movieClicked(movie: Movie) {
		this.store.dispatch(new LibraryActions.SelectMovie({ movie: movie }));
	}
}
