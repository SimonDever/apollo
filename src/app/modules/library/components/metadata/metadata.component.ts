import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef,
	KeyValueChanges, KeyValueDiffer, KeyValueDiffers,
	OnInit, Renderer2, ViewChild, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { NgbPopover, NgbPopoverConfig } from '@ng-bootstrap/ng-bootstrap';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { SearchService } from '../../../shared/services/search.service';
import * as fromLibrary from '../../store';
import { Entry } from '../../store/entry.model';
import * as LibraryActions from '../../store/library.actions';

@Component({
	selector: 'app-metadata',
	templateUrl: './metadata.component.html',
	styleUrls: ['./metadata.component.css'],
	providers: [NgbPopoverConfig]
})
export class MetadataComponent implements OnInit {
	
	selectedEntry: Entry;
	selectedEntry$: Observable<any>;
	selectedEntrySub: Subscription;
	metadataSearchResponse$: Observable<any>;
	responseSubscription: Subscription;
	metadataDetails$: Observable<any>;
	metadataDetailsSubscription: Subscription;
	keepers: Map<string, any>;
	savedEntry: any;
	page: number;
	details: Map<any, any>;
	convertedPoster: any;
	conversionStarted = false;
	conversionFinished = false;
	keepersDiffer: KeyValueDiffer<string, any>;
	@ViewChild('entryPopover') public entryPopup: NgbPopover;
	@ViewChild('posterPopover') public posterPopup: NgbPopover;
	@ViewChild('savePopover') public savePopup: NgbPopover;

	constructor(private store: Store<fromLibrary.LibraryState>,
		private el: ElementRef,
		private zone: NgZone,
		private renderer: Renderer2,
		private router: Router,
		config: NgbPopoverConfig,
		private cdRef:ChangeDetectorRef,
		private http: HttpClient,
		private searchService: SearchService,
		private differs: KeyValueDiffers
	) { }

	ngOnInit() {
		this.page = 1;
		this.keepers = new Map();
		this.details = new Map();
		this.keepersDiffer = this.differs.find(this.keepers).create();
		this.savedEntry = {};
		this.selectedEntry$ = this.store.pipe(select(fromLibrary.getSelectedEntry));
		this.selectedEntrySub = this.selectedEntry$.subscribe(selectedEntry => this.selectedEntry = selectedEntry);
		this.metadataDetails$ = this.store.pipe(select(fromLibrary.getMetadataDetailsResults));
		this.metadataDetailsSubscription = this.metadataDetails$.subscribe((details:Map<any, any>) => {
			this.details = details;
			this.cdRef.detectChanges();
		});
		this.metadataSearchResponse$ = this.store.pipe(select(fromLibrary.getMetadataSearchResults));
		this.responseSubscription = this.metadataSearchResponse$.subscribe(response => {
			this.cdRef.detectChanges();
			if (this.entryPopup != null) {
				//this.entryPopup.open();
			}
			if (this.posterPopup != null) {
				//this.posterPopup.open();
			}
			if (this.savePopup != null) {
				//this.savePopup.open();
			}
		});
	}

	ngOnDestroy() {
		this.responseSubscription.unsubscribe();
		this.metadataDetailsSubscription.unsubscribe();
		this.selectedEntrySub.unsubscribe();
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
		if(record.key === 'poster_path') {
			const posterUrl = `http://image.tmdb.org/t/p/original${record.currentValue}`;
			this.searchService.convertPoster(posterUrl).then(value => {
				const reader = new FileReader();
				reader.addEventListener("load", (function () {
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

	keep(event, entry, field): void {
		console.debug(`keep :: field: ${field}`);
		console.debug(entry);
		if(this.savedEntry != null) {
			this.savedEntry = null;
		}
		const has = this.keepers.has(field);
		const value = this.keepers.get(field);
		if (has && value != null && value === entry[field]) {
			this.keepers.delete(field);
		} else {
			this.keepers.set(field, entry[field]);
		}
	}

	isFieldSelected(entry, field): boolean {
		const has = this.keepers.has(field);
		const value = this.keepers.get(field);
		return has && value != null && value === entry[field];
	}

	cancel() {
		this.zone.run(() => this.router.navigate(['/library/view']));
	}


	finish(entryId: string) {
		if(this.savedEntry != null) {
			const posterUrl = `http://image.tmdb.org/t/p/original${this.savedEntry.poster_path}`;
			this.searchService.convertPoster(posterUrl).then(value => {
				const reader = new FileReader();

				reader.addEventListener("load", (function () {
					this.selectedEntry.poster_path = reader.result;
					this.selectedEntry.title = this.savedEntry.title;
					this.selectedEntry.overview = this.savedEntry.overview;
					this.store.dispatch(new LibraryActions.UpdateEntry({
						entry: {
							id: this.selectedEntry.id,
							changes: this.selectedEntry
						}
					}));
				}).bind(this), false);

				if (value) {
					reader.readAsDataURL(value);
				}
			});
		} else if(this.keepers != null && this.keepers.size > 0) {

			console.log(`keepers:`);
			console.log(this.keepers);
			
			Array.from(this.keepers.entries()).forEach(entry => {
				console.log(`entry: ${entry[0]}: ${entry[1]}`);
				if(entry[0] != 'poster_path' && entry[0] != 'id') {
					this.selectedEntry[entry[0]] = entry[1];
				}
			});

			if(this.keepers.has('title'))	{
				this.selectedEntry.title = this.keepers.get('title');
			}

			if(this.keepers.has('overview')) {
				this.selectedEntry.overview = this.keepers.get('overview');
			}

			if(this.keepers.has('poster_path') && this.conversionStarted && !this.conversionFinished) {
				console.error('Did not get poster data in time for save action');
			} else if(this.convertedPoster != null) {
				this.selectedEntry.poster_path = this.convertedPoster;
			}

			this.store.dispatch(new LibraryActions.UpdateEntry({
				entry: {
					id: this.selectedEntry.id,
					changes: this.selectedEntry
				}
			}));
		}
	}

	isEntrySelected(entry): boolean {
		return this.savedEntry === entry;
	}

	save(event, entry): void {
		if(this.keepers.size > 0) { 
			this.keepers = new Map();
		}
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
