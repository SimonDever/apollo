import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/take';
import { NavigationService } from '../../../shared/services/navigation.service';
import { Entry } from '../../store/entry.model';
import * as fromLibrary from '../../store';
import * as LibraryActions from '../../store/library.actions';

@Component({
	selector: 'app-edit-entry',
	templateUrl: './edit-entry.component.html',
	styleUrls: ['./edit-entry.component.css']
})
export class EditEntryComponent implements OnInit {

	selectedEntry$: Observable<any>;
	newEntry: Entry;
	entryForm: FormGroup;
	model$: Observable<FormGroup>;
	selectedEntrySub: Subscription;

	constructor(private formBuilder: FormBuilder,
		private store: Store<fromLibrary.State>,
		private router: Router,
		private navigationService: NavigationService) {

		this.newEntry = {
			id: '',
			title: '',
			poster: ''
		};
		this.entryForm = this.formBuilder.group({
			id: '',
			title: ['', Validators.required],
			poster: ['']
		});
	}

	ngOnInit() {
		console.log('EditEntryComponent Init');

		this.store.pipe(select(fromLibrary.getSelectedEntry))
			.take(1).subscribe(selectedEntry => {
				this.newEntry = selectedEntry;
				this.entryForm.patchValue({
					id: selectedEntry.id,
					title: selectedEntry.title,
					poster: selectedEntry.poster
				});
			});

		this.onChanges();
	}

	onChanges() {
		this.entryForm.valueChanges.subscribe(val => {
			this.newEntry.id = val.id;
			this.newEntry.title = val.title;
			this.newEntry.poster = val.poster;
			console.log(`onChanges :: newEntry`, this.newEntry);
		});
	}

	save() {
		this.store.dispatch(new LibraryActions.UpdateResults(this.newEntry));
		console.log(`saving: ${this.newEntry.title}`)
		this.store.dispatch(new LibraryActions.UpdateEntry({
			entry: {
				id: this.newEntry.id,
				changes: this.newEntry
			}
		}));
	}

	close() {
		this.router.navigate(['/library/view'])
	}
}
