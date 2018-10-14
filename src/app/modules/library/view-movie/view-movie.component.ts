import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import "rxjs/add/operator/publishReplay";
import { Observable } from 'rxjs/Observable';
import { NavigationService } from '../../shared/services/navigation.service';
import { Movie } from '../store/movie';
import * as fromLibrary from '../store';
import * as LibraryActions from '../store/library.actions';
import { Subscription } from 'rxjs/Subscription';

@Component({
	selector: 'app-view-movie',
	templateUrl: './view-movie.component.html',
	styleUrls: ['./view-movie.component.css']
})
export class ViewMovieComponent implements OnInit {

	movie$: Observable<Movie>;

	constructor(private store: Store<fromLibrary.LibraryState>,
		private router: Router,
		private navigationService: NavigationService) { }

	ngOnInit() {
		console.log('MovieComponent Init');
		this.movie$ = this.store.pipe(select(fromLibrary.getSelectedMovie));
	}

	edit() {
		this.router.navigate(['/library/edit']);
	}

	close() {
		this.navigationService.goBack();
	}

	searchMetadataProvider() {
		console.log('searchMetadataProvider() entry');
	}
}
