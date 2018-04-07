import { Observable } from 'rxjs/Observable';
import { StorageService } from './../../../storage.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from '../../../redux/state/app.state';
import { Movie } from '../../../models/movie';

@Component({
	selector: 'app-movie',
	templateUrl: './movie.component.html',
	styleUrls: ['./movie.component.css']
})
export class MovieComponent implements OnInit {

	movie$: Observable<Movie>;

	constructor(private store: Store<AppState>,
		private route: ActivatedRoute,
		private router: Router,
		private storageService: StorageService) { }

	ngOnInit() {
		console.debug('movie-component ngOnInit entry');
		this.movie$ = this.store.select('movieState').select('selectedMovie');
	}
}
