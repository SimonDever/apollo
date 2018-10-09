import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { NavigationService } from '../../shared/services/navigation.service';
import { Movie } from '../movie';
import * as fromLibrary from '../redux';
import * as LibraryActions from '../redux/library.actions';

@Component({
	selector: 'app-movie-edit',
	templateUrl: './movie-edit.component.html',
	styleUrls: ['./movie-edit.component.css']
})
export class MovieEditComponent implements OnInit {

	selectedMovie$: Observable<any>;
	newMovie: Movie;
	movieForm: FormGroup;
	model$: Observable<FormGroup>;
	selectedMovieSub: Subscription;

	constructor(private formBuilder: FormBuilder,
		private store: Store<fromLibrary.State>,
		private router: Router,
		private navigationService: NavigationService,
		private route: ActivatedRoute) {

		this.newMovie = new Movie('', '', '');
		this.movieForm = this.formBuilder.group({
			id: '',
			title: ['', Validators.required],
			poster: ['']
		});
	}

	ngOnInit() {
		console.log('MovieEditComponent Init');

		this.selectedMovie$ = this.store.pipe(select(fromLibrary.getSelectedMovie));

		this.selectedMovieSub = this.selectedMovie$.subscribe(selectedMovie => {
			this.movieForm.patchValue({
				id: selectedMovie.id,
				title: selectedMovie.title,
				poster: selectedMovie.poster
			});
		});

		this.onChanges();
	}

	ngOnDestroy() {
		this.selectedMovieSub.unsubscribe();
	}

	onChanges() {
		this.movieForm.valueChanges.subscribe(val => {
			this.newMovie.id = val.id;
			this.newMovie.title = val.title;
			this.newMovie.poster = val.poster;
			console.log(`onChanges :: newMovie`, this.newMovie);
		});

		this.selectedMovieSub.unsubscribe();
	}

	submit() {
		this.store.dispatch(new LibraryActions.UpdateResults(this.newMovie));
		this.store.dispatch(new LibraryActions.UpdateMovie({
			movie: {
				id: this.newMovie.id,
				changes: this.newMovie
			}
		}));
	}

	close() {
		this.router.navigate(['/movies/view']);
	}
}
