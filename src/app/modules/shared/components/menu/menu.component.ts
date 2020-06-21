import { Component, OnInit, NgZone, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router, RouterStateSnapshot } from '@angular/router';
import { Store } from '@ngrx/store';
import * as fromLibrary from '../../../library/store/index';
import * as LibraryActions from '../../../library/store/library.actions';
import { NavigationService } from '../../services/navigation.service';
import { LibraryService } from '../../services/library.service';

@Component({
	selector: 'app-menu',
	templateUrl: './menu.component.html',
	styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

	alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
	appTitle: string;
	navbarCollapsed: boolean;
	routerState: RouterStateSnapshot;
	title: string;
	searchForm: FormGroup;

	constructor(private activatedRoute: ActivatedRoute,
		private formBuilder: FormBuilder,
		private navigationService: NavigationService,
		private router: Router,
		private libraryService: LibraryService,
		private zone: NgZone,
		private store: Store<fromLibrary.LibraryState>) {
			this.appTitle = 'Apollo';
			this.routerState = this.router.routerState.snapshot;
			this.navbarCollapsed = true;
			this.title = '';
		}

	ngOnInit() {
		this.searchForm = this.formBuilder.group({ title: '' });
	}

	goto(char: string) {
		this.navigationService.gotoBookmark(char);
	}

	search() {
		this.navbarCollapsed = true;
		this.navigationService.setSearchResultsParent(this.routerState.url);
		this.store.dispatch(new LibraryActions.SearchEntries({
			searchTerms: this.searchForm.value.title
		}));
	}

	/* 
	addEntry() {
		this.store.dispatch(new LibraryActions.DeselectEntry());
		this.navbarCollapsed = true;
		let currentLocation = this.routerState.url;
		this.navigationService.setAddEntryParent(currentLocation);
		if (currentLocation === '/settings') {
			currentLocation = '/library';
		}
		this.navigationService.setViewEntryParent(currentLocation);
		this.zone.run(() => this.router.navigate(['/library/edit']));
	}
	*/

	addEntries(event) {
		const fileList: FileList = event.target.files;
		Array.from(fileList)
			.filter((file: File) => !file.name.startsWith('.'))
			.map(file => this.libraryService.createEntry(file));
	}

	showEntryList() {
		this.navbarCollapsed = true;
		this.navigationService.setSearchResultsParent(undefined);
		this.navigationService.setViewEntryParent(undefined);
		this.zone.run(() => this.router.navigate(['/library']));
	}

	showSettings() {
		this.navbarCollapsed = true;
		this.navigationService.setSearchResultsParent(undefined);
		this.navigationService.setViewEntryParent(undefined);
		this.zone.run(() => this.router.navigate(['/settings']));
	}
}
