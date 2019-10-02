import { Component, OnInit, NgZone, ViewChildren, QueryList, ViewChild, AfterViewInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { Router, RouterStateSnapshot } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Observable ,  Subscription } from 'rxjs';
import { NavigationService } from '../../../shared/services/navigation.service';
import * as fromLibrary from '../../store';
import * as LibraryAction from '../../store/library.actions';
import { Entry } from '../../store/entry.model';
import { trigger, transition, style, animate } from '@angular/animations';


// todo: guard to ensure selected entry or route to /library

@Component({
	selector: 'app-view-entry',
	templateUrl: './view-entry.component.html',
	styleUrls: ['../add-entry/add-entry.component.css'],
	animations: [
		trigger('fadeInOut', [
			transition(':enter', [
				style({opacity: 0}),
				animate('.5s ease-out', style({opacity: 1}))
			]),
			transition(':leave', [
				style({opacity: 1}),
				animate('.5s ease-in', style({opacity: 0}))
			])
		])
	]
})
export class ViewEntryComponent implements OnInit, AfterViewInit, OnDestroy {

	entry$: Observable<Entry>;
	entry: Entry;
	serializedData: any;
	grid: any;
	subs: Subscription;
	routerState: RouterStateSnapshot;

	constructor(private store: Store<fromLibrary.LibraryState>,
		private router: Router,
		private zone: NgZone,
		private cdRef: ChangeDetectorRef,
		private navigationService: NavigationService) {
			this.routerState = router.routerState.snapshot;
		}

	ngAfterViewInit() {
		this.zone.run(() => this.cdRef.detectChanges());
	}

	ngOnInit() {
		console.debug('ViewEntryComponent Init');
		this.entry$ = this.store.pipe(select(fromLibrary.getSelectedEntry));
		this.subs = this.entry$.subscribe(entry => this.entry = entry);
	}

	ngOnDestroy() {
		if (this.subs) {
			this.subs.unsubscribe();
		}
	}

	edit() {
		this.navigationService.setEditEntryParent(this.routerState.url)
		this.zone.run(() => this.router.navigate(['/library/edit']));
	}

	close() {
		this.navigationService.closeViewEntry();
	}

	trash(id: string) {
		console.debug(`trash(id): ${id}`);
		this.store.dispatch(new LibraryAction.RemoveEntry({id: id}))
	}

	searchMetadataProvider(title) {
		console.debug('searchMetadataProvider() entry');
		this.navigationService.setMetadataParent(this.routerState.url);
		console.debug(`searchMetadataProvider() searching metadata providers with terms ${title}`);
		this.store.dispatch(new LibraryAction.SearchForMetadata({keywords: title}));
	}
}
