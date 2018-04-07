import { StorageService } from './../../../storage.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AppState } from '../../../redux/state/app.state';
import { Store } from '@ngrx/store';
import { InMemoryDbService } from 'angular-in-memory-web-api';
import * as MovieActions from '../../../redux/actions/movie.actions';
import { Observable } from 'rxjs/Observable';
import { Movie } from '../../../models/movie';

@Component({
	selector: 'app-menu',
	templateUrl: './menu.component.html',
	styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

	searchForm: FormGroup;

	constructor(
		private route: ActivatedRoute,
		private storageService: StorageService,
		private router: Router,
		private formBuilder: FormBuilder,
		private store: Store<AppState>
	) { }

	ngOnInit() {
		console.debug('menu-component ngOnInit entry');
		this.createForm();
	}

	createForm() {
		this.searchForm = this.formBuilder.group({
			title: ''
		});
	}

	search() {
		this.store.dispatch(new MovieActions.SearchMovie(this.searchForm.value.title));
	}
}
