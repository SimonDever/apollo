import { Component, OnInit, NgZone, OnDestroy, DoCheck, KeyValueDiffers, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { ActivatedRoute, Router, RouterStateSnapshot, RouterState } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Observable ,	Subscription } from 'rxjs';

import { NavigationService } from '../../../shared/services/navigation.service';
import { Entry } from '../../store/entry.model';
import * as fromLibrary from '../../store';
import * as LibraryActions from '../../store/library.actions';

import { NgbModal, ModalDismissReasons, NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { map, tap, take } from 'rxjs/operators';

@Component({
	selector: 'app-edit-entry',
	templateUrl: './edit-entry.component.html',
	styleUrls: ['../add-entry/add-entry.component.css']
})
export class EditEntryComponent implements OnInit, OnDestroy, DoCheck {

	entry$: Observable<Entry>;
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
	modalVisible: boolean;
	closeResult: string;
	newFields: FormArray;
	routerState: RouterStateSnapshot;

	constructor(private formBuilder: FormBuilder,
		private zone: NgZone,
		private store: Store<fromLibrary.State>,
		private router: Router,
		private cdRef: ChangeDetectorRef,
		private modalService: NgbModal,
		private navigationService: NavigationService,
		private differs: KeyValueDiffers) {
			this.differ = this.differs.find([]).create();
			this.newFieldForm = this.formBuilder.group({
				newFieldName: ['', Validators.required]
			});
			this.searchForm = this.formBuilder.group({searchTerms: ''});
		}

	ngOnInit() {
		console.log('EditEntryComponent Init');

		this.entry$ = this.store.select(fromLibrary.getSelectedEntry);
		this.subs = this.entry$.pipe(
			take(1),
			tap(entry => {
				console.log('init entry pipe take1 sub - this.entry', this.entry);
				console.log('init entry pipe take1 sub - entry', entry);
				this.entry = { ...entry };
				this.poster_path = this.entry.poster_path || '';
				this.file = this.entry.file || null;
				const group: any = {};
				Object.entries(this.entry).forEach(([key, value]) => {
					if (key !== 'poster_path' && key !== 'file') {
						group[key] = new FormControl(value || '');
					}
				});
				this.entryForm = new FormGroup(group);
			})
		).subscribe();
	}

	isKeyVisible(key: string) {
		return key !== 'poster_path' && key !== 'file' && key !== 'id' && key !== '_id';
	}

	ngDoCheck() {
		if (this.differ.diff(this.entry)) {
			this.entryForm.patchValue(this.entry);
			this.poster_path = this.entry.poster_path;
			this.file = this.entry.file;
		}
	}

	removeField(field) {
		console.log('removeField - field:', field);
		console.log('removeField - entry[field]:', this.entry[field]);
		console.log('removeField - entryForm.value: ', this.entryForm.value);
		delete this.entry[field];
		this.entryForm.removeControl(field);
		this.entryForm.updateValueAndValidity();
		this.cdRef.detectChanges();
		console.log('removeField - after change - entryForm.value: ', this.entryForm.value);
	}

	addNewField() {
		const newFieldName = this.newFieldForm.get('newFieldName').value;
		console.log(`addNewField - newFieldName: ${newFieldName}`);
		this.entryForm.addControl(newFieldName, new FormControl(false));
		this.entryForm.updateValueAndValidity();
		console.log(`addNewField - this.entryForm.get(newFieldName):`, this.entryForm.get(newFieldName));
		this.newFieldForm.get('newFieldName').reset();
		console.log(`addNewField - resetting new field input`);
		if (this.entry[newFieldName] == null) {
			this.entry[newFieldName] = '';
			console.log('addNewField - add field to entry model', this.entry[newFieldName])
		}
		this.cdRef.detectChanges();
	}

	search() {
		const searchTerms = this.searchForm.value.searchTerms;
		console.debug('searchMetadataProvider() entry');
		this.navigationService.setMetadataParent(this.router.routerState.snapshot.url);
		console.debug(`searchMetadataProvider() searching metadata providers with terms ${searchTerms}`);
		this.store.dispatch(new LibraryActions.SearchForMetadata({keywords: searchTerms}));
		this.modalRef.close('search');
	}

	closeSearchDialog() {
		this.modalRef.dismiss('close');
	}

	showSearchDialog(content) {
		this.searchForm.patchValue({searchTerms: this.entryForm.get('title').value});
		this.modalRef = this.modalService.open(content);
		this.modalRef.result.then((result) => {
			this.closeResult = `Closed with: ${result}`;
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
		this.store.dispatch(new LibraryActions.DeselectEntry());
		this.entry = null;
		if (this.subs) {
			this.subs.unsubscribe();
		}
		// this.cdRef.detach();
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
		const changedFields = this.entryForm.value;
		changedFields.poster_path = this.poster_path;
		changedFields.file = this.file;
		const id = Number(this.entryForm.value.id);
		this.store.dispatch(new LibraryActions.UpdateEntry({
			// todo: or selectedEntryId?
			entry: { id: id, changes: changedFields }
		}));
		this.navigationService.closeEditEntry();
	}

	close() {
		this.navigationService.closeEditEntry();
		this.store.dispatch(new LibraryActions.DeselectEntry());
	}

	trash() {
		console.debug(`trash(id): ${this.entry.id}`);
		this.store.dispatch(new LibraryActions.RemoveEntry({id: this.entry.id}));
	}
}
