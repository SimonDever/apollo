import { DomSanitizer } from '@angular/platform-browser';
import { Component, OnInit, ViewChild, KeyValueDiffers, ChangeDetectorRef, DoCheck, OnDestroy, AfterViewInit, OnChanges } from '@angular/core';
import { Entry } from '../../../library/store/entry.model';
import { StorageService } from '../../../shared/services/storage.service';
import { ElectronService } from 'ngx-electron';
import { Store, select } from '@ngrx/store';
import * as fromLibrary from '../../../library/store';
import * as LibraryActions from '../../../library/store/library.actions';
import { trigger, style, transition, animate } from '@angular/animations';
import { Subscription, Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { NgbCheckBox } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { Router } from '@angular/router';

const uuid = require('uuid/v4');

// TODO: auto cull of posters previously downloaded but not in use

@Component({
	selector: 'app-settings-list',
	templateUrl: './settings-list.component.html',
	styleUrls: ['./settings-list.component.css'],
	animations: [
		trigger('fadeInOut', [
			transition(':enter', [
				style({ opacity: 0 }),
				animate('.5s ease-out', style({ opacity: 1 }))
			]),
			transition(':leave', [
				style({ opacity: 1 }),
				animate('.5s ease-in', style({ opacity: 0 }))
			])
		])
	]
})
export class SettingsListComponent implements OnInit, OnChanges, DoCheck, OnDestroy, AfterViewInit {

	importData: Array<any>;
	config: any;
	ready: boolean;
	config$: Observable<any>;
	subs: Subscription;
	configForm: FormGroup;
	differ: any;
	posterCount: number;
	notLoading: boolean;
	estimatedCount: number;
	readingFile: boolean;
	readingFileCount: number;
	tempCount: number;
	interval: any;
	updater;
	updateAvailable;

	constructor(private formBuilder: FormBuilder,
		private sanitization: DomSanitizer,
		private storageService: StorageService,
		private router: Router,
		private cdRef: ChangeDetectorRef,
		private store: Store<fromLibrary.LibraryState>,
		private electronService: ElectronService,
		private differs: KeyValueDiffers) {
		this.differ = this.differs.find([]).create();
	}

	ngOnInit() {

		this.tempCount = 0;
		this.readingFile = false;
		this.readingFileCount = 0;
		this.notLoading = true;
		this.posterCount = 0;
		this.estimatedCount = 0;
		this.storageService.importStorageCount = 0;
		this.ready = false;
		this.store.dispatch(new LibraryActions.GetConfig());
		this.config$ = this.store.select(fromLibrary.getConfig);
		this.subs = this.config$.pipe(map(config => {
			console.log('SettingsListComponent - ngOnInit :: config', config);
			const configFormGroup = {};
			const defaultConfig: any = {
				virtualScrolling: true,
				boxWidth: '290px',
				boxHeight: '400px'
			};
			config = { ...defaultConfig, ...(config || {}) };
			Object.entries(config).forEach(([key, value]) => {
				if (this.isKeyEnumerable(key)) {
					console.log(`adding ${key} to the form group`);
					configFormGroup[key] = new FormControl(value);
				}
			});

			console.log('configFormGroup', configFormGroup);
			this.configForm = this.formBuilder.group(configFormGroup);
			this.config = config;
			this.cdRef.detectChanges();
		})).subscribe();
	}

	ngAfterViewInit() {
		this.ready = true;
	}

	ngDoCheck() {
		if (this.differ.diff(this.config)) {
			this.configForm.patchValue(this.config);
		}
	}

	getStatus() {
		const savingNewDetails = this.storageService.importStorageCount > 0
			&& this.storageService.importStorageCount < this.estimatedCount;
		if (this.readingFile) {
			return 'Reading movie details from file';
		} else if (this.posterCount > 0 && this.storageService.importStorageCount === 0
			&& this.estimatedCount > 0) {
			return 'Saving movie posters to disk';
		} else if (savingNewDetails) {
			return 'Saving movie details to new database';
		} else if (this.estimatedCount === 0) {
			return 'Nothing loaded';
		} else if (this.posterCount === this.estimatedCount && this.storageService.importStorageCount === this.estimatedCount) {
			return `Finished loading ${this.estimatedCount} movies`;
		}
	}

	ngOnDestroy() {
		this.cdRef.detach();
		if (this.subs) {
			this.subs.unsubscribe();
		}
	}

	isKeyEnumerable(key: string) {
		return key !== 'id' && key !== '_id';
	}

	close() {
		this.router.navigate(['/library']);
	}

	save() {
		const config = this.configForm.value;
		// this.config = config;
		console.log('save() :: config', config);
		this.store.dispatch(new LibraryActions.GotConfig({ config: config }));
	}

	progressStyle() {
		const progressStyle = 'width:' + this.progressPercentage() + '%';
		console.log('progressStyle ::', style);
		return this.sanitization.bypassSecurityTrustStyle(progressStyle);
	}

	ngOnChanges() {
		if (this.progressPercentage() !== 0 && this.progressPercentage() !== 100) {

		}
	}

	progressPercentage() {
		console.log('check prog: this.posterCount: ', this.posterCount);
		/* console.log('progressPercentage :: estimatedCount: ' + this.estimatedCount
			+ 'importStorageCount: ' + this.storageService.importStorageCount
			+ ', percentage: ' + this.storageService.importStorageCount / this.estimatedCount
			+ '(' + ((this.storageService.importStorageCount / this.estimatedCount) * 100) + '%)'); */
		if (this.estimatedCount === 0 && !this.readingFile) {
			console.log(`progressPercentage - Nothing loaded, this.estimatedCount: ${this.estimatedCount}`);
			return 0;
		} else if (this.readingFile ||
			(this.storageService.importStorageCount === 0 && this.estimatedCount > 0)) {
			/* console.log(`progressPercentage - Reading file, this.readingFileCount: ${this.readingFileCount}, perc: ${(this.readingFileCount / this.estimatedCount) * 100}`); */
			if (this.posterCount >= this.estimatedCount) { return 100; }
			return Math.ceil((this.posterCount / this.estimatedCount) * 100); // (this.readingFileCount / this.estimatedCount) * 100;


			/*	else if (this.posterCount > 0 && this.posterCount < this.estimatedCount
				&& this.storageService.importStorageCount === 0) {
				console.log(`progressPercentage - Writing posters to disk, this.posterCount: ${this.posterCount}, perc: ${(this.posterCount / this.estimatedCount) * 100}`);
				return Math.ceil((this.posterCount / this.estimatedCount) * 100);
			*/

		} else if (this.storageService.importStorageCount > 0
			&& this.storageService.importStorageCount < this.estimatedCount) {
			console.log(`progressPercentage - Loading movie into database, this.storageService.importStorageCount: ${this.storageService.importStorageCount}, perc: ${(this.storageService.importStorageCount / this.estimatedCount) * 100}`);
			return Math.ceil((this.storageService.importStorageCount / this.estimatedCount) * 100);
		} else if (this.storageService.importStorageCount === this.estimatedCount) {
			return 100;
		}

		console.log('oops, no progress');
		return 0;
		// const percentage = (this.storageService.importStorageCount / this.estimatedCount) * 100;
		// const percentage = this.posterCount / this.estimatedCount;
		// return percentage;
	}

	onChange(event) {
		this.estimatedCount = 0;
		this.readingFile = true;
		this.tempCount = 0;
		this.posterCount = 0;
		this.storageService.importStorageCount = 0;
		console.log('onChange :: entry');
		console.log(event.target.files[0].name);
		const reader = new FileReader();
		reader.onload = (function (f) {
			return function (e) {
				f.onReaderLoad(e);
			};
		})(this);
		reader.readAsText(event.target.files[0]);
	}

	/*
	stillLoading() {
		if (this.notLoading) { return false; }
		console.log('stillLoading() :: this.posterCount', this.posterCount);
		console.log('stillLoading() :: this.estimatedCount - ', this.estimatedCount);
		console.log('stillLoading() returning (this.posterCount < this.estimatedCount) ', this.posterCount < this.estimatedCount);
		return this.posterCount < this.estimatedCount;
	}
	*/


	onReaderLoad(event) {
		this.readingFile = false;
		const obj = JSON.parse(event.target.result);
		this.estimatedCount = Object.keys(obj).length;
		console.log('onReaderLoad :: obj: ', obj);
		for (const data of obj) {
			this.tempCount++;
			console.log('data:', data);
			const out: Entry = {
				id: uuid(),
			};
			if (data.files) {
				out.files = [];
				data.files.forEach((element, index) => {
					if (index === 0) { out.file = element.path; }
					if (element.path !== '') {
						out.files.push(element.path);
					}
				});
			}
			if (data.currentMatch == null) {
				console.log('could not find current match number');
				data.currentMatch = 0;
			}

			const match = data.matches[data.currentMatch];
			if (match) {
				if (match.Title) { out.title = match.Title; }
				if (match.Plot) { out.overview = match.Plot; }
				if (match.Poster) {
					const poster: string = match.Poster;
					if (poster.startsWith('data:image')) {
						console.log('starts with base64 stuff');
						const matchData = poster.replace(/^data:image\/[a-z]+;base64,/, '');
						const poster_path = `./posters/${out.id}.png`;
						console.log('attempting to write poster to ');
						console.log(poster_path);
						this.electronService.remote.require('fs').writeFile(poster_path, matchData, 'base64', (err) => {
							err ? console.log(err) : console.log('poster written to disk');
							this.posterCount++;
							this.cdRef.detectChanges();
						});
						out.poster_path = poster_path;
					} else {
						console.log('not base64 poster, just going to save whatever it is');
						out.poster_path = match.Poster;
						this.posterCount++;
						this.cdRef.detectChanges();
					}
				}
			} else {
				this.posterCount++;
				this.cdRef.detectChanges();
			}
			if (match.Year) { out.year = match.Year; }
			if (match.Rated) { out.rated = match.Rated; }
			if (match.Released) { out.released = match.Released; }
			if (match.Runtime) { out.runtime = match.Runtime; }
			if (match.Genre) { out.genre = match.Genre; }
			if (match.Director) { out.director = match.Director; }
			if (match.Writer) { out.writer = match.Writer; }
			if (match.Actors) { out.actors = match.Actors; }
			if (match.Language) { out.language = match.Language; }
			if (match.Country) { out.country = match.Country; }
			if (match.Awards) { out.awards = match.Awards; }
			if (match.Metascore) { out.metascore = match.Metascore; }
			if (match.imdbRating) { out.imdbRating = match.imdbRating; }
			if (match.imdbVotes) { out.imdbVotes = match.imdbVotes; }
			if (match.imdbID) { out.imdbID = match.imdbID; }
			if (match.Type) { out.type = match.Type; }

			console.log('finished one: ', out);
			this.store.dispatch(new LibraryActions.ImportEntry({ entry: out }));
		}

		console.log('finished all');
	}
}
