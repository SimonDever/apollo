import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import * as MovieActions from '../../movies/movie.actions';
import { AppState } from '../../../app.state';
import { Subscription } from 'rxjs/Subscription';

@Component({
	selector: 'app-menu',
	templateUrl: './menu.component.html',
	styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

	searchForm: FormGroup;
	contextTitle: string;
	contextTitleSubscription: Subscription;

	constructor(private formBuilder: FormBuilder,
		private store: Store<AppState>) { }

	ngOnInit() {
		this.searchForm = this.formBuilder.group({ title: '' });
		this.contextTitleSubscription = this.store.select('movieState').select('contextTitle')
			.subscribe(contextTitle => this.contextTitle = contextTitle);
	}

	ngOnDestroy(): void {
		this.contextTitleSubscription.unsubscribe();
	}

	search() {
		this.store.dispatch(new MovieActions.SearchMovie(this.searchForm.value.title));
	}

	addMovie() {
		this.store.dispatch(new MovieActions.ShowAddMovieView());
	}
}
