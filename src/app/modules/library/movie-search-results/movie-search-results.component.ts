import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Movie } from '../store/movie';
import * as fromLibrary from '../store/index';
import * as LibraryActions from '../store/library.actions';
import { Router, ActivatedRoute } from '@angular/router';
import { NavigationService } from '../../shared/services/navigation.service';

@Component({
	selector: 'app-movie-search-results',
	templateUrl: './movie-search-results.component.html',
	styleUrls: ['./movie-search-results.component.css']
})
export class MovieSearchResultsComponent implements OnInit {

	movies$: Observable<Movie[]>;

	constructor(private navigationService: NavigationService,
		private router: Router,
		private route: ActivatedRoute,
		private store: Store<fromLibrary.LibraryState>) {
	}

	ngOnInit() {
		this.movies$ = this.store.pipe(select(fromLibrary.getSearchResults));
	}

	close() {
		/* this.router.navigate(['/library']); */
		this.navigationService.goBack();
	}

	movieClicked(movie: Movie) {
		this.store.dispatch(new LibraryActions.SelectMovie({ movie: movie }));
	}
}
