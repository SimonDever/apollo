import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import "rxjs/add/operator/publishReplay";
import { Observable } from 'rxjs/Observable';
import { NavigationService } from '../../../shared/services/navigation.service';
import * as fromLibrary from '../../store';
import { Entry } from '../../store/entry.model';

@Component({
	selector: 'app-view-entry',
	templateUrl: './view-entry.component.html',
	styleUrls: ['./view-entry.component.css']
})
export class ViewEntryComponent implements OnInit {

	entry$: Observable<Entry>;

	constructor(private store: Store<fromLibrary.LibraryState>,
		private router: Router,
		private navigationService: NavigationService) { }

	ngOnInit() {
		console.log('ViewEntryComponent Init');
		this.entry$ = this.store.pipe(select(fromLibrary.getSelectedEntry));
	}

	edit() {
		this.router.navigate(['/library/edit']);
	}

	close() {
		this.navigationService.closeViewEntry();
	}

	searchMetadataProvider() {
		console.log('searchMetadataProvider() entry');
	}
}
