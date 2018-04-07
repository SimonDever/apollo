import { Component, OnInit } from '@angular/core';
import * as MovieActions from '../../../redux/actions/movie.actions';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { StorageService } from '../../../storage.service';
import { AppState } from '../../../redux/state/app.state';
import { Store } from '@ngrx/store';

@Component({
	selector: 'app-movie-edit',
	templateUrl: './movie-edit.component.html',
	styleUrls: ['./movie-edit.component.css']
})
export class MovieEditComponent implements OnInit {

	movieForm: FormGroup;

	constructor(private route: ActivatedRoute,
		private storageService: StorageService,
		private router: Router,
		private formBuilder: FormBuilder,
		private store: Store<AppState>) { }

	ngOnInit() {
		this.createForm();
		this.route.params.map(params => params.id)
			.switchMap(id => this.storageService.getMovie(id))
			.subscribe(movie => {
				this.movieForm.setValue(movie);
			});
	}

	createForm() {
		this.movieForm = this.formBuilder.group({
			id: [''],
			title: ['', Validators.required]
		});
	}

	submit() {
		let movie = this.movieForm.value;
		this.store.dispatch(new MovieActions.SaveMovie(movie));
	}
}
