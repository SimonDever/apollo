import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { AppState } from '../../../app.state';
import * as MovieActions from '../movie.actions';

@Component({
  selector: 'app-add-movie',
  templateUrl: './add-movie.component.html',
  styleUrls: ['./add-movie.component.css']
})
export class AddMovieComponent implements OnInit {

	public movieForm: FormGroup;

	constructor(private formBuilder: FormBuilder,
		private store: Store<AppState>) { }

	ngOnInit() {
		this.movieForm = this.formBuilder.group({
			title: ['', Validators.required],
			poster: ['']
		});
	}

	submit() {
		this.store.dispatch(new MovieActions.AddMovie(this.movieForm.value));
	}

	close() {
		this.store.dispatch(new MovieActions.CloseAddMovieView());
	}
}
