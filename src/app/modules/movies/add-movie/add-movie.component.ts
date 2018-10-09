import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Movie } from '../movie';
import * as fromLibrary from '../redux';
import * as LibraryActions from '../redux/library.actions';

@Component({
	selector: 'app-add-movie',
	templateUrl: './add-movie.component.html',
	styleUrls: ['./add-movie.component.css']
})
export class AddMovieComponent implements OnInit {

	public movieForm: FormGroup;

	constructor(private formBuilder: FormBuilder,
		private store: Store<fromLibrary.LibraryState>,
		private router: Router,
		private route: ActivatedRoute) { }

	ngOnInit() {
		this.movieForm = this.formBuilder.group({
			id: [Date.now()],
			title: ['', Validators.required],
			poster: ['']
		});
	}

	submit() {
		const form = this.movieForm.value;
		const movie = new Movie(form.id, form.title, form.poster);
		this.store.dispatch(new LibraryActions.AddMovie({ movie: movie }));
	}

	close() {
		this.router.navigate(['/movies/view']);
	}
}
