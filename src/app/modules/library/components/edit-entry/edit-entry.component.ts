import { Component, OnInit, NgZone, OnDestroy, DoCheck, KeyValueDiffers, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router, RouterStateSnapshot, RouterState } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/take';
import { NavigationService } from '../../../shared/services/navigation.service';
import { Entry } from '../../store/entry.model';
import * as fromLibrary from '../../store';
import * as LibraryActions from '../../store/library.actions';
import { map } from 'rxjs/operator/map';
import { NgbModal, ModalDismissReasons, NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

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
	poster_path: string;
	files: File[];
	file: string;
	selectedEntryId: string;
	subs: Subscription;
	saved: boolean;
	entry: Entry;
	differ: any;
	modalRef: NgbModalRef;
	modalVisible: boolean;
	closeResult: string;
	routerState: RouterStateSnapshot;

	constructor(private formBuilder: FormBuilder,
		private zone: NgZone,
		private store: Store<fromLibrary.State>,
		private router: Router,
		private modalService: NgbModal,
		private navigationService: NavigationService,
		private differs: KeyValueDiffers) {
		this.differ = differs.find([]).create();
		this.selectedEntryId = '';
		this.routerState = router.routerState.snapshot;
		this.searchForm = this.formBuilder.group({ searchTerms: '' });
		this.entryForm = this.formBuilder.group({
			id: '',
			title: '',
			file: File,
			posterInput: File,
			overview: '',
			cast: ''
		});
	}

	search() {
		const searchTerms = this.searchForm.value.searchTerms;
		console.debug('searchMetadataProvider() entry');
		this.navigationService.setMetadataParent(this.routerState.url);
		console.debug(`searchMetadataProvider() searching metadata providers with terms ${searchTerms}`);
		this.store.dispatch(new LibraryActions.SearchForMetadata({ keywords: searchTerms }));
		this.modalRef.close('search');
	}

	closeSearchDialog() {
		this.modalRef.dismiss('close');
	}

	showSearchDialog(content) {
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
			return `with: ${reason}`;
		}
	}

	ngDoCheck() {
		if (this.differ.diff(this.entry)) {
			this.entryForm.patchValue(this.entry);
			this.poster_path = this.entry.poster_path;
			this.file = this.entry.file;
		}
	}

	ngOnDestroy() {
		if (this.subs) {
			this.subs.unsubscribe();
		}
	}

	ngOnInit() {
		console.log('EditEntryComponent Init');
		this.subs = this.store.pipe(select(fromLibrary.getSelectedEntry))
			.subscribe(selectedEntry => {
				this.entry = selectedEntry;
				this.poster_path = selectedEntry.poster_path;
				this.file = selectedEntry.file;
				this.selectedEntryId = selectedEntry.id;
			});
	}

	posterChange(event) {
		const reader = new FileReader();
		const poster = event.target.files[0];
		reader.addEventListener("load", (function () {
			this.poster_path = reader.result;
		}).bind(this), false);
		if (poster) {
			reader.readAsDataURL(poster);
		}
	}

	fileChange(event) {
		//this.files = event.target.files;
		const path = event.target.files[0].path;
		if (path == null) {
			console.warn(`Could not get full path to video file,
				may not be running in electron. You will not be able
				to play this file from within the application.`);
		}

		/* this.files.forEach(file => {
			if (file.path !== '') {
				this.files.push(this.files[0].path);
			}
		}, this); */

		this.file = path;

		const title = this.entryForm.value.title;
		if (title == null || title === '') {
			this.entryForm.value.title = event.target.files[0].name;
		}
	}

	save() {
		const changedFields = {
			id: this.entryForm.value.id,
			title: this.entryForm.value.title,
			cast: this.entryForm.value.cast,
			overview: this.entryForm.value.overview,
			poster_path: this.poster_path,
			file: this.file
		};
		this.store.dispatch(new LibraryActions.UpdateResults(changedFields));
		this.store.dispatch(new LibraryActions.UpdateEntry({
			entry: {
				id: this.entryForm.value.id,
				changes: changedFields
			}
		}));
		this.navigationService.closeEditEntry();
	}

	close() {
		this.navigationService.closeEditEntry();
	}

	trash() {
		console.debug(`trash(id): ${this.selectedEntryId}`);
		this.store.dispatch(new LibraryActions.RemoveEntry({ id: this.selectedEntryId }))
	}
}
