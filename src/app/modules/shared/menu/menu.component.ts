import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import * as fromLibrary from '../../library/store/index';
import * as LibraryActions from '../../library/store/library.actions';
import { Store } from '@ngrx/store';
import { NavigationService } from '../services/navigation.service';

@Component({
	selector: 'app-menu',
	templateUrl: './menu.component.html',
	styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

	title: string;

	searchForm: FormGroup;

	constructor(private activatedRoute: ActivatedRoute,
		private formBuilder: FormBuilder,
		private navigationService: NavigationService,
		private router: Router,
		private store: Store<fromLibrary.LibraryState>) {
			this.title = '';
		}

	ngOnInit() {
		this.searchForm = this.formBuilder.group({ title: '' });
	}

	search() {
		this.store.dispatch(new LibraryActions.SearchMovies({
			searchTerms: this.searchForm.value.title
		}));
	}

	showMovieList() {
		this.router.navigate(['/library']);
	}

	showSettings() {
		this.router.navigate(['/settings']);
	}

	addMovie() {
		this.router.navigate(['/library/add']);
	}
}
