import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { AppState } from '../../../redux/state/app.state';
import { Store } from '@ngrx/store';
import * as MovieActions from '../../../redux/actions/movie.actions';
import { Observable } from 'rxjs/Observable';

@Component({
	selector: 'app-menu',
	templateUrl: './menu.component.html',
	styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

	searchForm: FormGroup;
	contextTitle$: Observable<string>;

	constructor(private formBuilder: FormBuilder,
		private store: Store<AppState>) { }

	ngOnInit() {
		this.searchForm = this.formBuilder.group({ title: '' });

		this.contextTitle$ = this.store.select('movieState').select('contextTitle')
			.publishReplay(1).refCount();
	}

	search() {
		this.store.dispatch(new MovieActions.SearchMovie(this.searchForm.value.title));
	}

	addMovie() {
		this.store.dispatch(new MovieActions.ShowAddMovieView());
	}
}
