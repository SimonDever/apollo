import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { Movie } from '../store/movie';
import * as fromLibrary from '../store';
import * as LibraryActions from '../store/library.actions';
import { NavigationService } from '../../shared/services/navigation.service';

@Component({
	selector: 'app-add-movie',
	templateUrl: './add-movie.component.html',
	styleUrls: ['./add-movie.component.css']
})
export class AddMovieComponent implements OnInit {

	public movieForm: FormGroup;

	constructor(private navigationService: NavigationService,
		private formBuilder: FormBuilder,
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

	save() {
		const form = this.movieForm.value;
		const movie: Movie = { id: form.id, title: form.title, poster: form.poster };
		this.store.dispatch(new LibraryActions.AddMovie({	movie: movie }));
	}

	close() {
		this.navigationService.goBack();
	}
}
