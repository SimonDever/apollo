import { ChangeDetectorRef, Component, KeyValueDiffer, KeyValueDiffers, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbPopover, NgbPopoverConfig } from '@ng-bootstrap/ng-bootstrap';
import { select, Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { LibraryService } from '../../../shared/services/library.service';
import * as fromLibrary from '../../store';
import * as LibraryActions from '../../store/library.actions';

const uuid = require('uuid/v4');

@Component({
	selector: 'app-metadata',
	templateUrl: './metadata.component.html',
	styleUrls: ['./metadata.component.css'],
	providers: [NgbPopoverConfig],
})
export class MetadataComponent implements OnInit, OnDestroy {

	searchTerms: any;
	selectedEntryId: number;
	subs: Subscription;
	metadataSearchResponse$: Observable<any>;
	metadataDetails$: Observable<any>;
	keepers: Map<string, any>;
	savedEntry: any;
	page: number;
	details: Map<any, any>;
	convertedPoster: any;
	conversionStarted = false;
	conversionFinished = false;
	keepersDiffer: KeyValueDiffer<string, any>;
	converting = false;
	selectedEntry$;
	tempEntry;

	@ViewChild('entryPopover', { static: false })
	public entryPopup: NgbPopover;

	@ViewChild('posterPopover', { static: false })
	public posterPopup: NgbPopover;

	@ViewChild('savePopover', { static: false })
	public savePopup: NgbPopover;

	constructor(private store: Store<fromLibrary.LibraryState>,
		private router: Router,
		private libraryService: LibraryService,
		private cdRef: ChangeDetectorRef,
		private differs: KeyValueDiffers,
	) { }

	ngOnInit() {
		console.log('onInit');
		this.page = 1;
		this.keepers = new Map();
		this.details = new Map();
		this.keepersDiffer = this.differs.find(this.keepers).create();
		this.savedEntry = {};

		this.metadataDetails$ = this.store.pipe(select(fromLibrary.getMetadataDetailsResults));

		this.selectedEntry$ = this.store.select(fromLibrary.getSelectedEntry);

		this.subs = this.selectedEntry$.pipe(take(1)).subscribe(entry => {
			// console.log('setting selectedEntry', entry);
			if (entry) {
				this.tempEntry = entry;
			}
		});

		this.subs.add(this.store.pipe(select(fromLibrary.getTempEntry))
			.subscribe(tempEntry => this.tempEntry = tempEntry));

		this.subs.add(this.store.pipe(select(fromLibrary.getSearchTerms))
			.subscribe(searchTerms => this.searchTerms = searchTerms));

		this.subs.add(this.store.pipe(select(fromLibrary.getSelectedEntryId))
			.subscribe(id => this.selectedEntryId = id));

		this.subs.add(this.metadataDetails$.subscribe((details: Map<any, any>) => {
			this.details = details || new Map();
			this.cdRef.detectChanges();
		}));

		this.metadataSearchResponse$ = this.store.pipe(select(fromLibrary.getMetadataSearchResults));
		this.subs.add(this.metadataSearchResponse$.subscribe(response => {
			console.log('metadataSearchResponse, new results:', response);

			this.cdRef.detectChanges();
			/*
			if (this.entryPopup != null) { this.entryPopup.open();	}
			if (this.posterPopup != null) { this.posterPopup.open(); }
			if (this.savePopup != null) { this.savePopup.open(); }
			*/
		}));
	}

	ngOnDestroy() {
		console.log('destroying');
		if (this.subs) {
			this.subs.unsubscribe();
		}

		this.cdRef.detach();
	}

	areDetailsLoaded(id: any) {
		return this.details.has(id);
	}

	getDetails(entry) {
		//console.info(`MetadataComponent.getDetails(${entry.id})`);
		this.store.dispatch(new LibraryActions.SearchForMetadataDetails({ id: entry.id, media_type: entry.media_type }));
	}

	keepField(entry, field): void {
		//console.debug(`keepField(entry, field) - field: ${field}, entry:`, entry);

		if (!entry || !field) {
			//console.debug(`Illegal Arguement, entry: ${entry}, field: ${field}`);
		} else {
			if (this.savedEntry != null) {
				//console.debug('User chose to keep a field so deselecting entire entry');
				this.savedEntry = null;
			}

			if (this.keepers.has(field)) {
				//console.debug(`has field`);
				if (this.keepers.get(field) === entry[field]) {
					//console.debug(`deleting`);
					this.keepers.delete(field);
				} else {
					//console.debug(`updating`);
					this.keepers.set(field, entry[field]);
				}
			} else {
				// console.debug(`does not already have field so saving`);
				this.keepers.set(field, entry[field]);
			}
		}
	}

	isFieldSelected(entry, field): boolean {
		// console.debug(`isFieldSelected(entry, field) - field: ${field}, entry:`, entry);
		if (entry && this.keepers.has(field)) {
			// console.debug(`result: true;`);
			const value = this.keepers.get(field);
			// console.debug(`isFieldSelected - value: `, value);
			// console.debug(`isFieldSelected - entry[field]: ${entry[field]}`);
			return value === entry[field];
		} else {
			// console.debug('isFieldSelected: entry:', entry);
			// console.debug('isFieldSelected: field:', entry);
			// console.debug('isFieldSelected: this.keepers.has(field):', this.keepers.has(field));
		}

		return false;
	}

	cancel() {
		this.router.navigate(['/library/edit']);
	}

	sendUpdateAction(entry) {
		this.store.dispatch(new LibraryActions.UpdateEntry({ entry: entry }));
		this.router.navigate(['/library/edit']);
	}

	finish() {
		if (this.savedEntry == null) {
			if (this.keepers.size > 0) {
				this.savedEntry = {};
				Array.from(this.keepers.entries()).forEach(entry => {
					//console.log(`entry: ${entry[0]}: ${entry[1]}`);
					if (entry[0] !== 'id') {
						this.savedEntry[entry[0]] = entry[1];
					}
				});
				//console.log('finish() - has keepers', this.keepers);
				//console.log('finish() - savedEntry0:', this.savedEntry);
			} else {
				//console.log('savedEntry null and no keepers');
				this.savedEntry = {};
			}
		}

		//console.log('about to merge new things with existing entry', this.tempEntry);

		if( !this.selectedEntryId) {
			console.error('no selected entry id while saving searched metadata in edit, generating uuid');
		}

		this.savedEntry = {
			...this.tempEntry,
			...this.savedEntry,
			...{
				id: this.selectedEntryId || uuid() // TODO: leave id alone or make it whatever moviedb gives us
			}
		};

		this.libraryService.saveEntry(this.savedEntry);
		const img = document.querySelector('#poster-' + this.savedEntry.id) as HTMLImageElement;
		if (img) {
			img.src = this.savedEntry.poster_path;
		}
		this.router.navigate(['/library/edit']);
	}

	isEntrySelected(entry): boolean {
		return this.savedEntry === entry;
	}

	keepEntry(entry): void {
		this.keepers = new Map();
		if (this.savedEntry === entry) {
			this.savedEntry = null;
		} else {
			this.savedEntry = entry;
			this.savedEntry.id = this.selectedEntryId;
		}
	}

	getNextPage(event) {
		//console.debug('getNextPage() entry');
		this.page++;
		this.store.dispatch(new LibraryActions.SearchForMetadata({ keywords: this.searchTerms, page: this.page }));
	}

	getPrevPage(event) {
		//console.debug('getPrevPage() entry');
		this.page--;
		this.store.dispatch(new LibraryActions.SearchForMetadata({ keywords: this.searchTerms, page: this.page }));
	}
}
