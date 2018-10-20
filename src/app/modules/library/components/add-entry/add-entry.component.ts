import { Component, OnInit } from '@angular/core';
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

	public entryForm: FormGroup;

	constructor(private navigationService: NavigationService,
		private formBuilder: FormBuilder,
		private store: Store<fromLibrary.LibraryState>,
		private router: Router,
		private route: ActivatedRoute) { }

	ngOnInit() {
		this.entryForm = this.formBuilder.group({
			id: [Date.now()],
			title: ['', Validators.required],
			poster: ['']
		});
	}

	save() {
		const form = this.entryForm.value;
		const entry: Entry = { id: form.id, title: form.title, poster: form.poster };
		this.store.dispatch(new LibraryActions.AddEntry({	entry: entry }));
	}

	close() {
		this.navigationService.closeAddEntry();
		//this.navigationService.goBack();
	}
}
