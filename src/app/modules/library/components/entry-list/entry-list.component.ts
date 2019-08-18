import { Component, OnInit, NgZone, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { Router, RouterStateSnapshot } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Observable ,  Subscription } from 'rxjs';
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
	selectedEntryId: string;
	subs: Subscription;
	entriesSub: Subscription;

	constructor(private store: Store<fromLibrary.LibraryState>,
		private navigationService: NavigationService,
		private zone: NgZone,
		private router: Router) {
			this.routerState = router.routerState.snapshot;
	}

	ngOnInit() {
		console.log('EntryListComponent Init');
		this.entries$ = this.store.pipe(select(fromLibrary.getAllEntries));
		this.needEntries$ = this.store.pipe(select(fromLibrary.getNeedEntries));
		this.subs = this.needEntries$.subscribe(needEntries => {
			if (needEntries) {
				this.store.dispatch(new LibraryActions.Load());
			}
		});
		this.subs.add(this.store.pipe(select(fromLibrary.getSelectedEntryId))
			.subscribe(id => this.selectedEntryId = id));
	}

	ngOnDestroy() {
		if (this.subs) {
			this.subs.unsubscribe();
		}
	}

	edit() {
		console.debug(`entry-list.edit() - selectedEntryId: ${this.selectedEntryId}`);
		this.navigationService.setEditEntryParent(this.routerState.url);
		this.zone.run(() => this.router.navigate(['/library/edit']));
	}

	trash() {
		console.debug(`entry-list.trash() - selectedEntryId: ${this.selectedEntryId}`);
		this.store.dispatch(new LibraryActions.RemoveEntry({id: this.selectedEntryId}));
	}

	toggleActions(entry: any) {
		if (this.selectedEntryId === entry.id) {
			console.log('closing actions');
			this.closeActions();
		} else {
			console.log('showing actions');
			this.entryClicked(entry.id);
		}
	}

	entryClicked(id: number) {
		this.store.dispatch(new LibraryActions.SelectEntry({ id: id }));
	}

	closeActions() {
		this.store.dispatch(new LibraryActions.DeselectEntry());
	}

	addEntry() {
		const currentLocation = this.routerState.url;
		this.navigationService.setAddEntryParent(currentLocation);
		this.navigationService.setViewEntryParent(currentLocation);
		this.zone.run(() => this.router.navigate(['/library/add']));
	}
}
