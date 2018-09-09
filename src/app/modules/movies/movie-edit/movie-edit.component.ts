import { Observable } from 'rxjs/Observable';
import { Component, OnInit, Input } from '@angular/core';
import * as MovieActions from '../../../redux/actions/movie.actions';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AppState } from '../../../redux/state/app.state';
import { Store } from '@ngrx/store';
import { Subscription } from '../../../../../node_modules/rxjs/Subscription';

@Component({
	selector: 'app-movie-edit',
	templateUrl: './movie-edit.component.html',
	styleUrls: ['./movie-edit.component.css']
})
export class MovieEditComponent implements OnInit {

	/* Do we need this if we're populating from store in ngOnInit?
	Do I need to allow this to override what's in store or vice versa? */
	@Input()
	public movieForm: FormGroup;
	selectedMovieSubscription: Subscription;

	constructor(private formBuilder: FormBuilder,
		private store: Store<AppState>) { }

	ngOnInit() {
		this.movieForm = this.formBuilder.group({
			id: [''],
			title: ['', Validators.required],
			poster: ['']
		});

		this.selectedMovieSubscription = this.store.select('movieState').select('selectedMovie')
			.subscribe(selectedMovie => this.movieForm.setValue(selectedMovie));
	}

	submit() {
		this.store.dispatch(new MovieActions.SaveMovie(this.movieForm.value));
	}

	close() {
		this.selectedMovieSubscription.unsubscribe();
		this.store.dispatch(new MovieActions.CloseEditView());
	}
}
