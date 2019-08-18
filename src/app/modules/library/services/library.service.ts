import { Location } from '@angular/common';
import { Injectable, NgZone } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as fromLibrary from '../../library/store';
import { Store } from '@ngrx/store';

@Injectable()
export class LibraryService {

	selectedEntryId: any;

	constructor(private router: Router,
		private location: Location,
		private zone: NgZone,
		private libraryStore: Store<fromLibrary.State>,
		private activatedRoute: ActivatedRoute) {	}

	setSelectedEntryId(id: any) {
		this.selectedEntryId = id;
	}

	getSelectedEntryId() {
		return this.selectedEntryId;
	}
}
