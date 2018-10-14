import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/take';
import { NavigationService } from '../../shared/services/navigation.service';
import { Movie } from '../store/movie';
import * as fromLibrary from '../store';
import * as LibraryActions from '../store/library.actions';

@Component({
	selector: 'app-edit-movie',
	templateUrl: './edit-movie.component.html',
	styleUrls: ['./edit-movie.component.css']
})
export class EditMovieComponent implements OnInit {

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

		this.newMovie = {
			id: '',
			title: '',
			poster: ''
		};
		this.movieForm = this.formBuilder.group({
			id: '',
			title: ['', Validators.required],
			poster: ['']
		});
	}

	ngOnInit() {
		console.log('EditMovieComponent Init');

		this.store.pipe(select(fromLibrary.getSelectedMovie))
			.take(1).subscribe(selectedMovie => {
				this.newMovie = selectedMovie;
				this.movieForm.patchValue({
					id: selectedMovie.id,
					title: selectedMovie.title,
					poster: selectedMovie.poster
				});
			});

		this.onChanges();
	}

	onChanges() {
		this.movieForm.valueChanges.subscribe(val => {
			this.newMovie.id = val.id;
			this.newMovie.title = val.title;
			this.newMovie.poster = val.poster;
			console.log(`onChanges :: newMovie`, this.newMovie);
		});
	}

	save() {
		this.store.dispatch(new LibraryActions.UpdateResults(this.newMovie));
		console.log(`saving: ${this.newMovie.title}`)
		this.store.dispatch(new LibraryActions.UpdateMovie({
			movie: {
				id: this.newMovie.id,
				changes: this.newMovie
			}
		}));
	}

	close() {
		/* this.router.navigate(['/library/view']); */
		this.navigationService.goBack();
	}
}
