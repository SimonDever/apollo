import { Component, OnInit, NgZone } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router, RouterStateSnapshot } from '@angular/router';
import { Store } from '@ngrx/store';
import * as fromLibrary from '../../../library/store/index';
import * as LibraryActions from '../../../library/store/library.actions';
import { NavigationService } from '../../services/navigation.service';

@Component({
	selector: 'app-menu',
	templateUrl: './menu.component.html',
	styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

	appTitle: string;
	navbarCollapsed: boolean;
	routerState: RouterStateSnapshot;
	title: string;
	searchForm: FormGroup;

	constructor(private activatedRoute: ActivatedRoute,
		private formBuilder: FormBuilder,
		private navigationService: NavigationService,
		private router: Router,
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

	search() {
		this.navbarCollapsed = true;
		this.navigationService.setSearchResultsParent(this.routerState.url);
		this.store.dispatch(new LibraryActions.SearchEntries({
			searchTerms: this.searchForm.value.title
		}));
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


	addEntry() {
		this.navbarCollapsed = true;
		let currentLocation = this.routerState.url;
		this.navigationService.setAddEntryParent(currentLocation);
		if (currentLocation === '/settings') {
			currentLocation = '/library';
		}
		this.navigationService.setViewEntryParent(currentLocation);

		this.zone.run(() => this.router.navigate(['/library/add']));
	}
}
