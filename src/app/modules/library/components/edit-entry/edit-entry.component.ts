import { reducers } from './../../../../app.reducer';
import { StorageService } from './../../../shared/services/storage.service';
import { Component, OnInit, NgZone, OnDestroy, DoCheck, KeyValueDiffers, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { ActivatedRoute, Router, RouterStateSnapshot, RouterState, NavigationEnd } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Observable ,	Subscription } from 'rxjs';

import { NavigationService } from '../../../shared/services/navigation.service';
import { Entry } from '../../store/entry.model';
import * as fromLibrary from '../../store';
import * as LibraryActions from '../../store/library.actions';

import { NgbModal, ModalDismissReasons, NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { map, tap, take } from 'rxjs/operators';
import { ElectronService } from 'ngx-electron';
import { DomSanitizer } from '@angular/platform-browser';
import { trigger, state, style, transition, animate } from '@angular/animations';
const uuid = require('uuid/v4');
/**
 * TODO: enable field reordering and the saving of that order
 */
@Component({
	selector: 'app-edit-entry',
	templateUrl: './edit-entry.component.html',
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
export class EditEntryComponent implements OnInit, OnDestroy, DoCheck {

	defaultFieldOrder = ['title', 'overview'];
	entry$: Observable<Entry>;
	metadataSearchResponse$: Observable<any>;
	metadataSearchResult: any;
	selectedEntrySub: Subscription;
	entryForm: FormGroup;
	searchForm: FormGroup;
	newFieldForm: FormGroup;
	poster_path: string;
	file: string;
	files: File[];
	subs: Subscription;
	saved: boolean;
	entry: Entry;
	originalEntry: Entry;
	differ: any;
	modalRef: NgbModalRef;
	fieldsRemoved: string[];
	closeResult: string;
	newFields: FormArray;
	routerState: RouterStateSnapshot;
	selectedEntryId: string;
	_id: string;

	constructor(private formBuilder: FormBuilder,
		private zone: NgZone,
		private store: Store<fromLibrary.State>,
		private router: Router,
		private electronService: ElectronService,
		private storageService: StorageService,
		private cdRef: ChangeDetectorRef,
		private modalService: NgbModal,
		private sanitizer: DomSanitizer,
		private navigationService: NavigationService,
		private differs: KeyValueDiffers) {
			this.differ = this.differs.find([]).create();
			this.fieldsRemoved = [];
			this.newFieldForm = this.formBuilder.group({
				title: ['', Validators.required],
				newFieldName: ['']
			});
			this.searchForm = this.formBuilder.group({searchTerms: ''});
		}

	posterUrl(path) {
		if (path) {
			if (path.toLowerCase().startsWith('c:\\')) {
				return this.sanitizer.bypassSecurityTrustResourceUrl('file://' + path);
			} else if (path.startsWith('data:image')) {
				return path;
			}
		} else {
			return '';
		}
	}

	sortFields(key1, key2) {
		if (key1 === key2) { return 0; }
		if (key1 === 'title') { return -1; }
		if (key2 === 'title') { return 1; }
		return +key2 - +key1;
	}


	ngOnInit() {
		console.log('EditEntryComponent Init');
		this.entry$ = this.store.select(fromLibrary.getSelectedEntry);
		this.subs = this.entry$.pipe(
			take(1),
			tap(entry => {
				console.log('init entry pipe tap - entry', entry);
			})
		).subscribe(entry => {
			console.log('init entry pipe sub - entry', entry);
			if (entry) {
				this.entry = { ...entry };
				this.poster_path = entry.poster_path || '';
				this.file = entry.file || null;
				const group: any = {};
				Object.entries(this.entry).forEach(([key, value]) => {
					if (this.isKeyEnumerable(key)) {
						group[key] = new FormControl(value || '');
					}
				});
				this.entryForm = new FormGroup(group);
				this.cdRef.detectChanges();
			} else {
				this.poster_path = '';
				this.file = null;
				this.entry = { id: uuid(), title: ''};
				const group: any = {
					id: new FormControl(this.entry.id)/*,
					title: new FormControl(this.entry.title) */
				};
				Object.entries(this.entry).forEach(([key, value]) => {
					if (this.isKeyEnumerable(key)) {
						group[key] = new FormControl(value || '');
					}
				});
				this.entryForm = new FormGroup(group);
				this.cdRef.detectChanges();
			}

			window.scrollTo(0, 0);
		});

		this.store.select(fromLibrary.getSelectedEntryId)
			.pipe(map(id => this.selectedEntryId = id))
			.subscribe();

		this.metadataSearchResponse$ = this.store.pipe(select(fromLibrary.getMetadataSearchResults));
		this.subs.add(this.metadataSearchResponse$.subscribe(response => this.metadataSearchResult = response));
	}

	isKeyHidden(key: string) {
		const hiddenKeys = ['poster_path', 'file', 'id', '_id', '_rev', 'rev'];

		for (const hiddenKey of hiddenKeys) {
			if (key === hiddenKey) {
				return true;
			}
		}

		return false;
	}

	isKeyEnumerable(key: string) {
		return key !== 'poster_path' && key !== 'file';
	}

	ngDoCheck() {
		if (this.differ.diff(this.entry)) {
			this.entryForm.patchValue(this.entry);
			if (this.poster_path == null && this.entry.poster_path != null) {
				this.poster_path = this.entry.poster_path;
			}
			if (this.file == null && this.entry.file != null) {
				this.file = this.entry.file;
			}
		}
	}

	removeField(field) {
		console.log('removeField - field:', field);
		console.log('removeField - entry[field]:', this.entry[field]);
		console.log('removeField - entryForm.value: ', this.entryForm.value);
		Object.entries(this.entry).forEach(([k, v]) => {
			if (k === field) {
				delete this.entry[k];
				this.entryForm.removeControl(field);
				this.fieldsRemoved.push(field);
				this.entryForm.updateValueAndValidity();
				this.cdRef.detectChanges();
			}
		});

		console.log('removeField - after change - entryForm.value: ', this.entryForm.value);
	}

	addNewField() {
		let newFieldName: string = this.newFieldForm.get('newFieldName').value.toLowerCase();
		if (newFieldName.replace(/ /g, '').length > 0) {
			newFieldName = newFieldName.replace(/ /g, '_');
			console.log(`addNewField - newFieldName: ${newFieldName}`);
			this.entryForm.addControl(newFieldName, new FormControl(false));
			this.entryForm.updateValueAndValidity();
			console.log(`addNewField - this.entryForm.get(newFieldName):`, this.entryForm.get(newFieldName));
			this.newFieldForm.get('newFieldName').reset();
			console.log(`addNewField - resetting new field input`);
			if (this.entry[newFieldName] == null) {
				this.entry[newFieldName] = '';
				console.log('addNewField - add field to entry model', this.entry[newFieldName]);
			}
			this.cdRef.detectChanges();
		} else {
			console.log('no value');
		}
	}

	search() {
		const searchTerms = this.searchForm.value.searchTerms;
		console.debug('searchMetadataProvider() entry');
		this.navigationService.setMetadataParent(this.router.routerState.snapshot.url);
		console.debug(`searchMetadataProvider() searching metadata providers with terms ${searchTerms}`);
		this.store.dispatch(new LibraryActions.SearchForMetadata({keywords: searchTerms}));
		this.modalRef.close('search');
	}

	closeModal() {
		this.modalRef.dismiss('close');
	}

	showSearchDialog(content) {
		let searchTerms = '';
		const titleControl = this.entryForm.get('title');
		if (titleControl) {
			searchTerms = titleControl.value;
		}
		this.searchForm.patchValue({searchTerms: searchTerms});
		this.modalRef = this.modalService.open(content);
		this.modalRef.result.then((result) => {
			this.closeResult = `Closed with: ${result}`;
		}, (reason) => {
			this.closeResult = `Dismissed with: ${this.getDismissReason(reason)}`;
		});
	}

	showDeleteConfirmation(content) {
		this.modalRef = this.modalService.open(content);
		this.modalRef.result.then((result) => {
			this.closeResult = `Closed with: ${result}`;
			if (result === 'Ok click') {
				this.trash();
			}
		}, (reason) => {
			this.closeResult = `Dismissed with: ${this.getDismissReason(reason)}`;
		});
	}

	getDismissReason(reason: any): string {
		if (reason === ModalDismissReasons.ESC) {
			return 'by pressing ESC';
		} else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
			return 'by clicking on a backdrop';
		} else if (reason === 'close') {
			return 'by pressing x on the modal';
		} else {
			return	`with: ${reason}`;
		}
	}

	ngOnDestroy() {
		this.cdRef.detach();
		this.entry = null;
		if (this.subs) {
			this.subs.unsubscribe();
		}
	}

	posterChange(event) {
		const reader = new FileReader();
		const poster = event.target.files[0];
		reader.addEventListener('load', (function () {
			this.poster_path = reader.result;
		}).bind(this), false);
		if (poster) {
			reader.readAsDataURL(poster);
		}
	}

	posterIsFile(poster_path: string) {
		return poster_path && !poster_path.startsWith('data:image');
	}

	sendUpdateAction(entry) {
		this.store.dispatch(new LibraryActions.UpdateEntry({ entry: entry }));
		this.navigationService.closeMetadata();
	}

	writeImage(data, filename, changes) {
		const remote = this.electronService.remote;
		const path = `${remote.app.getAppPath()}\\posters\\${filename}`;
		remote.require('fs').writeFile(path, data, 'base64', (function(err) {
			changes.poster_path = path;
			console.debug('electronService remove writeFile - image updated');
			this.sendUpdateAction(changes);
			this.navigationService.closeEditEntry(this.selectedEntryId);
			err ? console.log(err) : console.log('poster written to disk');
		}).bind(this));
	}

	fileChange(event) {
		// this.files = event.target.files;
		const path = event.target.files[0].path;
		if (path == null) {
			console.warn(`Could not get full path to video file,
				may not be running in electron. You will not be able
				to play this file from within the application.`);
		}

		/*
		this.files.forEach(file => {
			if (file.path !== '') {
				this.files.push(this.files[0].path);
			}
		}, this);
		*/

		this.file = path || event.target.files[0].name;
		const title = this.entryForm.value.title;
		if (title == null || title === '') {
			this.entryForm.value.title = event.target.files[0].name;
		}
	}

	save() {
		const changes = this.entryForm.value;
		changes.file = this.file;
		this.fieldsRemoved.forEach(field => {
			if (!changes.hasOwnProperty(field)) {
				console.debug('removing:', field);
				changes[field] = null;
			}
		});

		if (this.poster_path.startsWith('data:image')) {
			const dataParts = this.storageService.base64MimeType(this.poster_path);
			if (dataParts.mime && dataParts.data) {
				const mime = dataParts.mime;
				const data = dataParts.data;
				let ext = mime.split('/')[1] || 'png';
				if (ext === 'jpg') { ext = 'jpeg'; }
				const filename = `${uuid()}.${ext}`;
				const file =  new File([data], `test.${ext}`, {	type: `image/${ext}`	});
				const reader = new FileReader();
				reader.addEventListener('load', (function () {
					console.debug('writeImage3', data.substring(0, 100), filename);
					this.writeImage(data, filename, changes);
				}.bind(this)), false);
				if (file) {
					reader.readAsDataURL(file);
				}
			} else {
				console.error('error getting data parts from ', this.poster_path);
			}
		} else if (this.poster_path.startsWith(this.electronService.remote.app.getAppPath())) {
			changes.poster_path = this.poster_path;
			this.sendUpdateAction(changes);
			this.navigationService.closeEditEntry(this.selectedEntryId);
		} else if (this.poster_path.startsWith('/')) {
			const path = this.poster_path;
			const url = `http://image.tmdb.org/t/p/original${path}`;
			let ext = path ? path.substring(path.lastIndexOf('.') + 1, path.length) : 'png';
			if (ext === 'jpg') { ext = 'jpeg'; }
			const filename = `${uuid()}.${ext}`;
			fetch(url).then((function(response) {
				return response.blob().then((function(data) {
					const file =  new File([data], `test.${ext}`, {	type: `image/${ext}`	});
					const reader = new FileReader();
					reader.addEventListener('load', (function () {
						console.debug('writeImage4', data.substring(0, 100), filename);
						this.writeImage(data, filename, changes);
					}.bind(this)), false);
					if (file) {
						reader.readAsDataURL(file);
					}
				}).bind(this));
			}).bind(this));
		}
	}

	close() {
		this.navigationService.closeEditEntry(this.selectedEntryId);
	}

	trash() {
		console.debug(`trash(id): ${this.entry.id}`);
		this.store.dispatch(new LibraryActions.RemoveEntry({id: this.entry.id}));
	}
}
