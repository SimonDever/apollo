import { Component, OnInit, NgZone, ChangeDetectorRef } from '@angular/core';
import { Router, RouterStateSnapshot } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { NavigationService } from '../../../shared/services/navigation.service';
import * as fromLibrary from '../../store';
import { Entry } from '../../store/entry.model';
import * as LibraryActions from '../../store/library.actions';

@Component({
	selector: 'app-entry-list',
	templateUrl: './entry-list.component.html',
	styleUrls: ['./entry-list.component.css']
})
export class EntryListComponent implements OnInit {

	routerState: RouterStateSnapshot;
	entries$: Observable<Entry[]>;
	needEntries$: Observable<boolean>;
	needEntriesSub: Subscription;
	entriesSub: Subscription;

	constructor(private store: Store<fromLibrary.LibraryState>,
		private navigationService: NavigationService,
		private zone: NgZone,
		private router: Router) {
			this.routerState = router.routerState.snapshot;
	}

	ngOnInit() {
		console.log('EntryListComponent Init')

		this.needEntries$ = this.store.pipe(select(fromLibrary.getNeedEntries));

		this.needEntriesSub = this.needEntries$.subscribe(needEntries => {
			if (needEntries) {
				this.store.dispatch(new LibraryActions.Load())
			}
		});

		this.entries$ = this.store.pipe(select(fromLibrary.getAllEntries));
	}

	ngOnDestroy() {
		this.needEntriesSub.unsubscribe();
	}

	entryClicked(entry: Entry) {
		this.navigationService.setViewEntryParent(this.routerState.url);
		this.store.dispatch(new LibraryActions.SelectEntry({ entry: entry }));
	}

	addEntry() {
		let currentLocation = this.routerState.url;
		this.navigationService.setAddEntryParent(currentLocation);
		this.navigationService.setViewEntryParent(currentLocation);
		this.zone.run(() => this.router.navigate(['/library/add']));
	}
}
