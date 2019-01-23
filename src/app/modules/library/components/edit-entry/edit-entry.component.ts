import { Component, OnInit, NgZone } from '@angular/core';
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
	selectedEntrySub: Subscription;
	entryForm: FormGroup;
	poster_path: string;
	file: string;

	constructor(private formBuilder: FormBuilder,
		private zone: NgZone,
		private store: Store<fromLibrary.State>,
		private router: Router,
		private navigationService: NavigationService) {

		this.entryForm = this.formBuilder.group({
			id: '',
			title: '',
			file: File,
			posterInput: File,
			overview: '',
			cast: ''
		});
	}

	ngOnInit() {
		console.log('EditEntryComponent Init');

		this.store.pipe(select(fromLibrary.getSelectedEntry))
			.take(1).subscribe(selectedEntry => {
				this.poster_path = selectedEntry.poster_path;
				this.file = selectedEntry.file;
				this.entryForm.patchValue({
					id: selectedEntry.id,
					title: selectedEntry.title,
					overview: selectedEntry.overview,
					cast: selectedEntry.cast,
				});
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
		const path = event.target.files[0].path;
		if(path == null) {
			console.warn(`Could not get full path to video file,
				may not be running in electron. You will not be able
				to play this file from within the application.`);
		}

		this.file = path || event.target.files[0].name;
		const title = this.entryForm.value.title;
		if(title == null || title === '') {
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
	}

	close() {
		this.zone.run(() => this.router.navigate(['/library/view']));
	}
}
