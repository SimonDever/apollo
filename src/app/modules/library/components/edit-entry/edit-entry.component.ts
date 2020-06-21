import { animate, style, transition, trigger } from '@angular/animations';
import { ChangeDetectorRef, Component, DoCheck, KeyValueDiffers, NgZone, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Router, RouterStateSnapshot } from '@angular/router';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { select, Store } from '@ngrx/store';
import { ElectronService } from 'ngx-electron';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { LibraryService } from '../../../shared/services/library.service';
import { NavigationService } from '../../../shared/services/navigation.service';
import * as fromLibrary from '../../store';
import { Entry } from '../../store/entry.model';
import * as LibraryActions from '../../store/library.actions';
import { StorageService } from './../../../shared/services/storage.service';

const uuid = require('uuid/v4');

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
	inputList: any[];
	routerState: RouterStateSnapshot;
	selectedEntryId: string;
	_id: string;

	constructor(private formBuilder: FormBuilder,
		private zone: NgZone,
		private store: Store<fromLibrary.State>,
		private router: Router,
		private libraryService: LibraryService,
		private electronService: ElectronService,
		private storageService: StorageService,
		private cdRef: ChangeDetectorRef,
		private modalService: NgbModal,
		private sanitizer: DomSanitizer,
		private navigationService: NavigationService,
		private differs: KeyValueDiffers
		)	{}

	ngOnInit() {
		console.log('EditEntryComponent Init');
		this.differ = this.differs.find([]).create();
		this.fieldsRemoved = [];
		this.inputList = [];
		this.searchForm = this.formBuilder.group({searchTerms: ''});
    this.entryForm = this.formBuilder.group({});
		this.entry$ = this.store.select(fromLibrary.getSelectedEntry);
		this.subs = this.entry$.pipe(map(entry => {
			console.log('Edit - entry', entry);
			if (!entry) {
				this.poster_path = '';
				this.file = null;
				entry = {
					id: uuid(),
					title: ''
				};
			}

			this.entry = { ...entry };
			this.poster_path = entry.poster_path || '';
			this.file = entry.file || null;
			Object.entries(this.entry).forEach(([key, value]) => {
				if (this.isKeyEnumerable(key)) {
					this.inputList.push({
						value: value || '',
						formControlName: key,
						label: key
					});
				}
			});
			this.refreshForm();
			this.cdRef.detectChanges();
			window.scrollTo(0, 0);
		})).subscribe();

		this.store.select(fromLibrary.getSelectedEntryId)
			.pipe(map(id => this.selectedEntryId = id))
			.subscribe();

		this.metadataSearchResponse$ = this.store.pipe(select(fromLibrary.getMetadataSearchResults));
		this.subs.add(this.metadataSearchResponse$.subscribe(response => this.metadataSearchResult = response));
	}
	
  addNewField(fieldName) {
		this.modalRef.close('newFieldAdded');
    this.inputList.push({
      formControlName: fieldName.toLowerCase().replace(' ', '_'),
			label: fieldName,
			value: ''
    });
    this.refreshForm();
	}
	
  removeInputField(inputField) {
		Object.entries(this.entry).forEach(([k, v]) => {
			if (k === inputField.formControlName) {
				delete this.entry[k];
				this.entryForm.removeControl(k);
				this.fieldsRemoved.push(k); // TODO: do we need this?
				this.cdRef.detectChanges(); // TODO: do we need this?
			}
		});
    this.inputList = this.inputList.filter(field => field !== inputField);
    this.refreshForm();
  }
	
  refreshForm() {
    this.inputList.forEach(input => {
			const newFormControl = this.formBuilder.control({value: input.value, disabled: false});
			this.entryForm.addControl(input.formControlName, newFormControl);
    });
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

	search() {
		this.modalRef.close('search');
		const searchTerms = this.searchForm.value.searchTerms;
		this.router.navigate(['/library/edit']); // TODO: check if we need this
		this.store.dispatch(new LibraryActions.SearchForMetadata({
			keywords: searchTerms,
			tempEntry: {
				...this.entryForm.value,
				...{
					poster_path: this.poster_path,
					file: this.file
				}
			}
		}));
	}

	closeModal() {
		this.modalRef.dismiss('close');
	}

	showSearchDialog(searchDialog: TemplateRef<any>) {
		let searchTerms = '';
		const titleControl = this.entryForm.get('title');
		if (titleControl) {
			searchTerms = titleControl.value;
		}
		this.searchForm.patchValue({searchTerms: searchTerms});
		this.modalRef = this.modalService.open(searchDialog);
		this.modalRef.result.then((result) => {
			this.closeResult = `Closed with: ${result}`;
		}, (reason) => {
			this.closeResult = `Dismissed with: ${this.getDismissReason(reason)}`;
		});
	}

	showNewFieldDialog(newFieldDialog: TemplateRef<any>) {
		this.modalRef = this.modalService.open(newFieldDialog);
		this.modalRef.result.then((result) => {
			this.closeResult = `Closed with: ${result}`;
		}, (reason) => {
			this.closeResult = `Dismissed with: ${this.getDismissReason(reason)}`;
		});
	}

	showDeleteConfirmation(deleteDialog: TemplateRef<any>) {
		this.modalRef = this.modalService.open(deleteDialog);
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

	writeImage(data, filename, changes) {
		const remote = this.electronService.remote;
		const path = `${remote.app.getPath('userData')}\\posters\\${filename}`;
		remote.require('fs').writeFile(path, data, 'base64', (function(err) {
			changes.poster_path = path;
			console.debug('electronService remote writeFile - image updated');
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

			const forwardSlash = this.file.lastIndexOf('/');
			const backwardSlash = this.file.lastIndexOf('\\');
			let separator = forwardSlash, newTitle;

			if (forwardSlash === -1) {
				separator = backwardSlash;
			}
			if (this.file.lastIndexOf('(') === -1) {
				newTitle = this.file.substring(separator + 1, this.file.lastIndexOf('.'));
			} else {
				newTitle = this.file.substring(separator + 1, this.file.lastIndexOf('('));
			}

			this.entryForm.get('title').setValue(newTitle);
		}
	}

	save() {
		const changes = this.entryForm.value;
		changes.poster_path = this.poster_path;
		changes.file = this.file;
		this.fieldsRemoved.forEach(field => {
			if (!changes.hasOwnProperty(field)) {
				console.debug('removing:', field);
				changes[field] = null;
			}
		});

		this.libraryService.saveEntry(changes);
		this.navigationService.closeMetadata();
		this.navigationService.closeEditEntry(this.selectedEntryId);
	}

	close() {
		this.navigationService.closeEditEntry(this.selectedEntryId);
	}

	trash() {
		console.debug(`trash(id): ${this.entry.id}`);
		this.store.dispatch(new LibraryActions.RemoveEntry({id: this.entry.id}));
	}
}
