import { Component, OnInit, NgZone, ChangeDetectorRef, OnDestroy } from '@angular/core';
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
export class EntryListComponent implements OnInit, OnDestroy {

	routerState: RouterStateSnapshot;
	entries$: Observable<Entry[]>;
	needEntries$: Observable<boolean>;
	selectedEntry$: Observable<Entry>;
	selectedEntry: Entry;
	subs: Subscription;
	entriesSub: Subscription;

	constructor(private store: Store<fromLibrary.LibraryState>,
		private navigationService: NavigationService,
		private zone: NgZone,
		private router: Router) {
			this.routerState = router.routerState.snapshot;
	}

	ngOnInit() {
		console.log('EntryListComponent Init')

		this.selectedEntry$ = this.store.pipe(select(fromLibrary.getSelectedEntry));
		this.entries$ = this.store.pipe(select(fromLibrary.getAllEntries));
		this.needEntries$ = this.store.pipe(select(fromLibrary.getNeedEntries));

		this.subs = this.needEntries$.subscribe(needEntries => {
			if (needEntries) {
				this.store.dispatch(new LibraryActions.Load())
			}
		});

		this.subs.add(this.selectedEntry$.subscribe(selectedEntry => {
			this.selectedEntry = selectedEntry;
		}));
	}

	ngOnDestroy() {
		if(this.subs) {
			this.subs.unsubscribe();
		}
	}

	edit(id: string) {
		console.debug(`edit(id): ${id}`);
		
		this.navigationService.setEditEntryParent(this.routerState.url);
		this.zone.run(() => this.router.navigate(['/library/edit']));
	}

	trash(id: string) {
		console.debug(`trash(id): ${id}`);
		this.store.dispatch(new LibraryActions.RemoveEntry({id: id}))
	}

	toggleActions(entry: Entry) {
		if(this.selectedEntry === entry) {
			this.closeActions(entry);
		} else {
			this.entryClicked(entry);
		}
	}

	entryClicked(entry: Entry) {
		//this.navigationService.setViewEntryParent(this.routerState.url);
		//this.store.dispatch(new LibraryActions.SelectAndViewEntry({ entry: entry }));
		this.store.dispatch(new LibraryActions.SelectEntry({ entry: entry }));
	}

	closeActions(entry: Entry) {
		this.store.dispatch(new LibraryActions.DeselectEntry({ entry: entry }));
	}

	addEntry() {
		let currentLocation = this.routerState.url;
		this.navigationService.setAddEntryParent(currentLocation);
		this.navigationService.setViewEntryParent(currentLocation);
		this.zone.run(() => this.router.navigate(['/library/add']));
	}
}
