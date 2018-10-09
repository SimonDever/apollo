import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import "rxjs/add/operator/publishReplay";
import { Observable } from 'rxjs/Observable';
import { NavigationService } from '../../shared/services/navigation.service';
import { Movie } from '../movie';
import * as fromLibrary from '../redux';
import * as LibraryActions from '../redux/library.actions';


@Component({
	selector: 'app-movie',
	templateUrl: './movie.component.html',
	styleUrls: ['./movie.component.css']
})
export class MovieComponent implements OnInit {

	movie$: Observable<Movie>;
	previousUrl: string;

	constructor(private store: Store<fromLibrary.LibraryState>,
		private router: Router,
		private navigationService: NavigationService,
		private route: ActivatedRoute) { }

	ngOnInit() {
		this.movie$ = this.store.pipe(select(fromLibrary.getSelectedMovie));
		this.previousUrl = this.navigationService.getPreviousUrl();
		console.log('MovieComponent Init');
		console.log(`previousUrl: ${this.previousUrl}`);
	}

	edit() {
		this.router.navigate(['/movies/edit']);
	}

	close() {
		this.store.dispatch(new LibraryActions.CloseMovieView({ previousUrl: this.previousUrl }));
	}

	searchMetadataProvider() {
		console.log('searchMetadataProvider() entry');
	}
}
