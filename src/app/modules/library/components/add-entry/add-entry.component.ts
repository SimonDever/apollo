import { Component, ElementRef, OnInit, Renderer2, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { NavigationService } from '../../../shared/services/navigation.service';
import * as fromLibrary from '../../store';
import { Entry } from '../../store/entry.model';
import * as LibraryActions from '../../store/library.actions';


@Component({
	selector: 'app-add-entry',
	templateUrl: './add-entry.component.html',
	styleUrls: ['./add-entry.component.css']
})
export class AddEntryComponent implements OnInit {

	entryForm: FormGroup;
	file: string;
	poster_path: string;

	constructor(private navigationService: NavigationService,
		private formBuilder: FormBuilder,
		private store: Store<fromLibrary.LibraryState>,
		private router: Router,
		private route: ActivatedRoute,
		private el: ElementRef,
		private renderer: Renderer2) { }

	ngOnInit() {
		this.entryForm = this.formBuilder.group({
			id: [Date.now()],
			title: ['', Validators.required],
			file: File,
			posterInput: File,
			overview: '',
			cast: ''
		});
	}

	posterChange(event) {
		const reader = new FileReader();
		const file = event.target.files[0];
		reader.addEventListener("load", (function () {
			this.poster_path = reader.result;
		}).bind(this), false);
		if (file) {
			reader.readAsDataURL(file);
		}
	}

	fileChange(event) {
		this.file = event.target.files[0].path || event.target.files[0].name;
		if(this.entryForm.value.title === '') {
			const title = this.file.substring(0, this.file.lastIndexOf('.'));
			this.entryForm.get('title').setValue(title);
		}
	}

	save() {
		const form = this.entryForm.value;
		const entry: Entry = {};
		if(form.id) entry.id = form.id;
		if(form.title) entry.title = form.title;
		if(this.poster_path) entry.poster_path = this.poster_path;
		if(this.file) entry.file = this.file;
		if(form.overview) entry.overview = form.overview;
		if(form.cast) entry.cast = form.cast;
		this.store.dispatch(new LibraryActions.AddEntry({	entry: entry }));
	}

	close() {
		this.navigationService.closeAddEntry();
	}
}
