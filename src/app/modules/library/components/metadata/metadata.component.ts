import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef,
	KeyValueChanges, KeyValueDiffer, KeyValueDiffers,
	OnInit, Renderer2, ViewChild, NgZone, Output, OnDestroy, DoCheck } from '@angular/core';
import { Router } from '@angular/router';
import { NgbPopover, NgbPopoverConfig } from '@ng-bootstrap/ng-bootstrap';
import { select, Store } from '@ngrx/store';
import { Observable ,  Subscription } from 'rxjs';
import { SearchService } from '../../../shared/services/search.service';
import * as fromLibrary from '../../store';
import { Entry } from '../../store/entry.model';
import * as LibraryActions from '../../store/library.actions';
import { NavigationService } from '../../../shared/services/navigation.service';
import { EventEmitter } from 'electron';

@Component({
	selector: 'app-metadata',
	templateUrl: './metadata.component.html',
	styleUrls: ['./metadata.component.css'],
	providers: [NgbPopoverConfig]
})
export class MetadataComponent implements OnInit, OnDestroy, DoCheck {

	//selectedEntry: Entry;
	//selectedEntry$: Observable<any>;
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
	@ViewChild('entryPopover', {static: false}) public entryPopup: NgbPopover;
	@ViewChild('posterPopover', {static: false}) public posterPopup: NgbPopover;
	@ViewChild('savePopover', {static: false}) public savePopup: NgbPopover;

	selectedEntryId: number;

	constructor(private store: Store<fromLibrary.LibraryState>,
		private el: ElementRef,
		private zone: NgZone,
		private renderer: Renderer2,
		private router: Router,
		config: NgbPopoverConfig,
		private cdRef: ChangeDetectorRef,
		private http: HttpClient,
		private searchService: SearchService,
		private differs: KeyValueDiffers,
		private navigationService: NavigationService
	) { }

	ngOnInit() {
		this.page = 1;
		this.keepers = new Map();
		this.details = new Map();
		this.keepersDiffer = this.differs.find(this.keepers).create();
		this.savedEntry = {};

		/*
		this.selectedEntry$ = this.store.pipe(select(fromLibrary.getSelectedEntry));
		this.subs = this.selectedEntry$.subscribe(selectedEntry =>
			this.selectedEntry = selectedEntry
		);
		*/

		this.subs = this.store.pipe(select(fromLibrary.getSelectedEntryId))
			.subscribe(id => this.selectedEntryId = id);

		this.metadataDetails$ = this.store.pipe(select(fromLibrary.getMetadataDetailsResults));
		this.subs.add(this.metadataDetails$.subscribe((details: Map<any, any>) => {
			this.details = details;
			this.cdRef.detectChanges();
		}));

		this.metadataSearchResponse$ = this.store.pipe(select(fromLibrary.getMetadataSearchResults));
		this.subs.add(this.metadataSearchResponse$.subscribe(response => {
			this.cdRef.detectChanges();
			/*
			if (this.entryPopup != null) { this.entryPopup.open();	}
			if (this.posterPopup != null) { this.posterPopup.open(); }
			if (this.savePopup != null) { this.savePopup.open(); }
			*/
		}));
	}

	ngOnDestroy() {
		if (this.subs) {
			this.subs.unsubscribe();
		}
		this.cdRef.detach();
	}

	areDetailsLoaded(id: any) {
		return this.details.has(id);
	}

	getDetails(entry) {
		console.info(`MetadataComponent.getDetails(${entry.id})`);
		this.store.dispatch(new LibraryActions.SearchForMetadataDetails({id: entry.id, media_type: entry.media_type}));
	}

	keepersChanged(changes: KeyValueChanges<string, any>) {
		changes.forEachAddedItem(record => this.convertPoster(record));
		changes.forEachChangedItem(record => this.convertPoster(record));
	}

	ngDoCheck() {
		const changes = this.keepersDiffer.diff(this.keepers);
		if (changes) {
			this.keepersChanged(changes);
		}
	}

	convertPoster(record) {
		this.conversionStarted = true;
		this.conversionFinished = false;
		this.convertedPoster = null;
		if (record.key === 'poster_path') {
			const posterUrl = `http://image.tmdb.org/t/p/original${record.currentValue}`;
			this.searchService.convertPoster(posterUrl).then(value => {
				const reader = new FileReader();
				reader.addEventListener('load', (function () {
					this.convertedPoster = reader.result;
					this.conversionFinished = true;
					this.conversionStarted = false;
				}.bind(this)), false);
				if (value) {
					reader.readAsDataURL(value);
				}
			});
		}
	}

	keepField(entry, field): void {
		console.debug(`keepField(entry, field) - field: ${field}, entry:`, entry);

		if (!entry || !field) {
			console.debug(`Illegal Arguement, entry: ${entry}, field: ${field}`);
		} else {
			if (this.savedEntry != null) {
				console.debug('User chose to keep a field so deselecting entire entry');
				this.savedEntry = null;
			}

			if (this.keepers.has(field)) {
				console.debug(`has field`);
				if (this.keepers.get(field) === entry[field]) {
					console.debug(`deleting`);
					this.keepers.delete(field);
				} else {
					console.debug(`updating`);
					this.keepers.set(field, entry[field]);
				}
			} else {
				console.debug(`does not already have field so saving`);
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
		this.navigationService.closeMetadata();
	}

	finish() {
		if (this.savedEntry != null) {
			const posterUrl = `http://image.tmdb.org/t/p/original${this.savedEntry.poster_path}`;
			this.searchService.convertPoster(posterUrl).then(value => {
				const reader = new FileReader();

				reader.addEventListener('load', (function () {
					this.selectedEntry.poster_path = reader.result;

					// TODO: this should be fixed
					this.selectedEntry.title = this.savedEntry.title || this.savedEntry.name;
					this.selectedEntry.overview = this.savedEntry.overview;


					this.store.dispatch(new LibraryActions.UpdateEntry({
						entry: {
							id: this.selectedEntry.id,
							changes: this.selectedEntry
						}
					}));
					this.navigationService.closeMetadata(true);
				}).bind(this), false);

				if (value) {
					reader.readAsDataURL(value);
				}
			});
		} else if (this.keepers != null && this.keepers.size > 0) {

			console.log(`keepers:`);
			console.log(this.keepers);

			Array.from(this.keepers.entries()).forEach(entry => {
				console.log(`entry: ${entry[0]}: ${entry[1]}`);
				if (entry[0] !== 'poster_path' && entry[0] !== 'id') {
					this.selectedEntry[entry[0]] = entry[1];
				}
			});

			if (this.keepers.has('title'))	{
				this.selectedEntry.title = this.keepers.get('title');
			}

			if (this.keepers.has('overview')) {
				this.selectedEntry.overview = this.keepers.get('overview');
			}

			if (this.keepers.has('poster_path') && this.conversionStarted && !this.conversionFinished) {
				console.error('Did not get poster data in time for save action');
			} else if (this.convertedPoster != null) {
				this.selectedEntry.poster_path = this.convertedPoster;
			}

			this.store.dispatch(new LibraryActions.UpdateEntry({
				entry: {
					id: this.selectedEntry.id,
					changes: this.selectedEntry
				}
			}));

			this.navigationService.closeMetadata();
		}
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
		}
	}

	getNextPage(event) {
		console.debug('searchMetadataProvider() entry');
		this.page++;
		console.debug(`searchMetadataProvider() searching metadata providers with terms ${this.selectedEntry.title}`);
		this.store.dispatch(new LibraryActions.SearchForMetadata({keywords: this.selectedEntry.title, page: this.page}));
	}

	getPrevPage(event) {
		console.debug('searchMetadataProvider() entry');
		this.page--;
		console.debug(`searchMetadataProvider() searching metadata providers with terms ${this.selectedEntry.title}`);
		this.store.dispatch(new LibraryActions.SearchForMetadata({keywords: this.selectedEntry.title, page: this.page}));
	}
}
