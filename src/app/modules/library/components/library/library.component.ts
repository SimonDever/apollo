import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subscription, config } from 'rxjs';

import * as fromLibrary from '../../store';
import * as LibraryActions from '../../store/library.actions';
import { map } from 'rxjs/operators';

@Component({
	selector: 'app-library',
	templateUrl: './library.component.html',
	styleUrls: ['./library.component.css']
})
export class LibraryComponent implements OnInit, OnDestroy {

	config: any;
	config$: Observable<any>;
	subs: Subscription;
	
	constructor(
		private store: Store<fromLibrary.LibraryState>,
	) {}

	ngOnInit() {
		
		this.store.dispatch(new LibraryActions.GetConfig());
		
		this.config$ = this.store.select(fromLibrary.getConfig);

		this.subs = this.config$.pipe(
			map(config => this.config = config))
			.subscribe();
	}

	ngOnDestroy() {
		if (this.subs) {
			this.subs.unsubscribe();
		}
	}
}
