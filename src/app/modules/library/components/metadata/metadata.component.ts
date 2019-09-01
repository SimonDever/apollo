import { StorageService } from './../../../shared/services/storage.service';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef,
	KeyValueChanges, KeyValueDiffer, KeyValueDiffers,
	OnInit, Renderer2, ViewChild, NgZone, Output, OnDestroy, DoCheck, Input } from '@angular/core';
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
import { ElectronService } from 'ngx-electron';

const uuid = require('uuid/v4');
@Component({
	selector: 'app-metadata',
	templateUrl: './metadata.component.html',
	styleUrls: ['./metadata.component.css'],
	providers: [NgbPopoverConfig]
})
export class MetadataComponent implements OnInit, OnDestroy, DoCheck {

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
	@Input()
	entry: any;
	@ViewChild('entryPopover', {static: false}) public entryPopup: NgbPopover;
	@ViewChild('posterPopover', {static: false}) public posterPopup: NgbPopover;
	@ViewChild('savePopover', {static: false}) public savePopup: NgbPopover;

	constructor(private store: Store<fromLibrary.LibraryState>,
		private el: ElementRef,
		private zone: NgZone,
		private renderer: Renderer2,
		private router: Router,
		private electronService: ElectronService,
		private storageService: StorageService,
		private config: NgbPopoverConfig,
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

		this.metadataDetails$ = this.store.pipe(select(fromLibrary.getMetadataDetailsResults));

		this.subs = this.store.pipe(select(fromLibrary.getSearchTerms))
			.subscribe(searchTerms =>	this.searchTerms = searchTerms);

		this.subs.add(this.store.pipe(select(fromLibrary.getSelectedEntryId))
			.subscribe(id => this.selectedEntryId = id));

		this.subs.add(this.metadataDetails$.subscribe((details: Map<any, any>) => {
			this.details = details || new Map();
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
		this.convertedPoster = null;
		if (record.key === 'poster_path') {
			console.log('found poster path value', record.currentValue);
			const posterUrl = `http://image.tmdb.org/t/p/original${record.currentValue}`;
			this.converting = true;
			this.searchService.convertPoster(posterUrl).then(value => {
				const reader = new FileReader();
				reader.addEventListener('load', (function () {
					this.convertedPoster = reader.result;
					this.converting = false;
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

	sendUpdateAction(entry) {
		this.store.dispatch(new LibraryActions.UpdateEntry({ entry: entry }));
		this.navigationService.closeMetadata();
	}

	writeImage(data, filename) {
		console.log('inside writeImage, data, filename:', data, filename);
		const remote = this.electronService.remote;
		const path = `${remote.app.getAppPath()}\\posters\\${filename}`;
		remote.require('fs').writeFile(path, data, 'base64', (function(err) {
			console.log('inside write image inside remote file write', this.savedEntry);
			this.savedEntry.poster_path = path;
			this.sendUpdateAction(this.savedEntry);
			err ? console.log(err) : console.log('poster written to disk');
		}).bind(this));
	}

	finish() {
		if (this.savedEntry == null) {
			if (this.keepers.size > 0) {
				this.savedEntry = {};
				Array.from(this.keepers.entries()).forEach(entry => {
					console.log(`entry: ${entry[0]}: ${entry[1]}`);
					if (entry[0] !== 'poster_path' &&  entry[0] !== 'id') {
						this.savedEntry[entry[0]] = entry[1];
					}
				});
				console.log('finish() - has keepers', this.keepers);
				console.log('finish() - savedEntry0:', this.savedEntry);
			} else {
				console.log('savedEntry null and no keepers');
				this.savedEntry = {};
			}
		}

		this.savedEntry = {
			...this.entry,
			...this.savedEntry,
			...{
				id: this.selectedEntryId
			}
		};

		if (this.convertedPoster && this.convertedPoster.startsWith('data:image')) {
			console.log('converted poster is base64 string');
			const dataParts = this.storageService.base64MimeType(this.convertedPoster);
			if (dataParts.mime && dataParts.data) {
				const mime = dataParts.mime;
				const data = dataParts.data;
				let ext = mime.split('/')[1] || 'png';
				if (ext === 'jpg') { ext = 'jpeg'; }
				const filename = `${uuid()}.${ext}`;
				console.log('writeImage', data.substring(0, 100), filename);
				this.writeImage(data, filename);
			} else {
				console.log('failed to parse data parts');
			}
		} else {
			console.log('no image to save');
			this.sendUpdateAction(this.savedEntry);
		}

		/*
			if (this.savedEntry.poster_path != null) {
				if (this.savedEntry.poster_path.startsWith('data:image')) {
					let ext = this.storageService.base64MimeType(this.savedEntry.poster_path).split('/')[1] || 'png';
					if (ext === 'jpg') { ext = 'jpeg'; }
					const data = this.savedEntry.poster_path.replace(/^data:image\/[a-z]+;base64,/, '');
					const filename = `${uuid()}.${ext}`;
					console.log('writeImage1', data, filename);
					this.writeImage(data, filename);
				} else if (this.savedEntry.poster_path.startsWith('/')) {
					const path = this.savedEntry.poster_path;
					const url = `http://image.tmdb.org/t/p/original${path}`;
					let ext = path ? path.substring(path.lastIndexOf('.') + 1, path.length) : 'png';
					if (ext === 'jpg') { ext = 'jpeg'; }
					console.log('ext', ext);
					const filename = `${uuid()}.${ext}`;
					console.log('filename', filename);
					fetch(url).then((function(response) {
						return response.blob().then((function(data) {
							const reader = new FileReader();
							const file =  new File([data], `test.${ext}`, {	type: `image/${ext}`	});
							reader.addEventListener('load', (function () {
								console.log('writeImage2', reader.result, filename);
								this.writeImage(reader.result, filename);
							}.bind(this)), false);
							if (file) {
								reader.readAsDataURL(file);
							}
						}).bind(this));
					}).bind(this));
				}
			} else {
				this.sendUpdateAction(this.savedEntry);
			}
		} else if (this.keepers != null && this.keepers.size > 0) {

			console.log(`keepers:`);
			console.log(this.keepers);

			this.savedEntry = {};

			// this.savedEntry = {...this.entry, ...this.keepers};
			Array.from(this.keepers.entries()).forEach(entry => {
				console.log(`entry: ${entry[0]}: ${entry[1]}`);
				if (entry[0] !== 'poster_path' &&  entry[0] !== 'id') {
					this.savedEntry[entry[0]] = entry[1];
				}
			});

			this.savedEntry = {
				...this.entry,
				...this.savedEntry,
				...{ id: this.selectedEntryId }
			};

			if (this.savedEntry.poster_path.startsWith('data:image')) {
				let ext = this.storageService.base64MimeType(this.savedEntry.poster_path).split('/')[1] || 'png';
				if (ext === 'jpg') { ext = 'jpeg'; }
				const data = this.savedEntry.poster_path.replace(/^data:image\/[a-z]+;base64,/, '');
				const filename = `${uuid()}.${ext}`;
				console.log('writeImage3', data, filename);
				this.writeImage(data, filename);
			} else if (this.savedEntry.poster_path.startsWith('/')) {
				const path = this.savedEntry.poster_path;
				const url = `http://image.tmdb.org/t/p/original${path}`;
				let ext = path ? path.substring(path.lastIndexOf('.') + 1, path.length) : 'png';
				if (ext === 'jpg') { ext = 'jpeg'; }
				console.log('ext', ext);
				const filename = `${uuid()}.${ext}`;
				console.log('filename', filename);
				fetch(url).then((function(response) {
					console.log('response!', response);
					return response.blob().then((function(data) {
						const reader = new FileReader();
						const file =  new File([data], `test.${ext}`, {	type: `image/${ext}`	});
						//fs.readFile()
						reader.addEventListener('load', (function () {
							const base64ImageString = String(reader.result).replace(/^data:image\/[a-z]+;base64,/, '');
							console.log('writeImage', base64ImageString, filename);
							this.writeImage(base64ImageString, filename);
						}.bind(this)), false);
						if (file) {
							reader.readAsDataURL(file);
						}
					}).bind(this));
				}).bind(this));
			} */

			// ------------

			/*
			if (this.keepers.has('poster_path') && this.conversionStarted && !this.conversionFinished) {
				console.error('Did not get poster data in time for save action');
			} else if (this.convertedPoster != null) {
				console.log('setting converted poster into poster_path');
				const ext = this.storageService.base64MimeType(this.convertedPoster).split('/')[1] || 'png';
				const data = this.convertedPoster.replace(/^data:image\/[a-z]+;base64,/, '');
				const filename = `${this.selectedEntryId}.${ext}`;
				console.log('writeImage3', data, filename);
				this.writeImage(data, filename);
			} */

			/*
			this.store.dispatch(new LibraryActions.UpdateEntry(
				{ entry: this.savedEntry }
			));
			*/

			// this.navigationService.closeMetadata();
		// }
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

			console.log('kicking off poster conversion for', this.savedEntry.poster_path);
			this.convertPoster({key: 'poster_path', currentValue: this.savedEntry.poster_path});
		}
	}

	getNextPage(event) {
		console.debug('getNextPage() entry');
		this.page++;
		this.store.dispatch(new LibraryActions.SearchForMetadata({keywords: this.searchTerms, page: this.page}));
	}

	getPrevPage(event) {
		console.debug('getPrevPage() entry');
		this.page--;
		this.store.dispatch(new LibraryActions.SearchForMetadata({keywords: this.searchTerms, page: this.page}));
	}
}
