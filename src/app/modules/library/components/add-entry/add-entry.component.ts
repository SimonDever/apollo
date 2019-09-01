import { Component, ElementRef, OnInit, Renderer2, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterStateSnapshot } from '@angular/router';
import { Store } from '@ngrx/store';
import { NavigationService } from '../../../shared/services/navigation.service';
import * as fromLibrary from '../../store';
import { Entry } from '../../store/entry.model';
import * as LibraryActions from '../../store/library.actions';
const uuid = require('uuid/v4');


@Component({
	selector: 'app-add-entry',
	templateUrl: './add-entry.component.html',
	styleUrls: ['./add-entry.component.css']
})
export class AddEntryComponent implements OnInit {

	entryForm: FormGroup;
	files: File[];
	file: string;
	poster_path: string;
	routerState: RouterStateSnapshot;
	searchTerms: string;
	selectedEntryId: string;

	constructor(private navigationService: NavigationService,
		private formBuilder: FormBuilder,
		private store: Store<fromLibrary.LibraryState>,
		private router: Router,
		private route: ActivatedRoute,
		private el: ElementRef,
		private renderer: Renderer2) {
		this.routerState = router.routerState.snapshot;
	}

	ngOnInit() {
		this.entryForm = this.formBuilder.group({
			id: [uuid()],
			title: ['', Validators.required],
			file: File,
			posterInput: File,
			overview: '',
			cast: ''
		});
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
		this.files = event.target.files;
		if (this.files.length > 0) {
			this.file = this.files[0].path;
			if (this.entryForm.value.title === '') {
				const label = this.files[0].path || this.files[0].name;
				const forwardSlash = label.lastIndexOf('/');
				const backwardSlash = label.lastIndexOf('\\');
				let separator = forwardSlash;
				if (forwardSlash === -1) {
					separator = backwardSlash;
				}
				const title = label.substring(separator + 1, label.lastIndexOf('.'));
				this.entryForm.get('title').setValue(title);
			}
		}
	}

	save() {
		const form = this.entryForm.value;
		const entry: any = {};
		if (form.id) {
			entry.id = form.id;
		}
		if (form.title) {
			entry.title = form.title;
		}
		if (this.poster_path) {
			entry.poster_path = this.poster_path;
		}
		if (this.file) {
			entry.file = this.file;
		}
		/*
		if (this.files) {
			this.files.forEach(file => {
				if (file.path !== '') {
					entry.files.push(file.path);
				}
			}, this);
		}
		*/
		if (form.overview) {
			entry.overview = form.overview;
		}
		if (form.cast) {
			entry.cast = form.cast;
		}
		this.store.dispatch(new LibraryActions.AddEntry({ entry: entry }));
	}

	close() {
		this.navigationService.closeAddEntry();
	}
}
