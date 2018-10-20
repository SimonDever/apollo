import { Location } from '@angular/common';
import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Injectable()
export class NavigationService {

	viewEntryParent: string;
	searchResultsParent: string;
	addEntryParent: string;

	constructor(private router: Router,
		private location: Location,
		private activatedRoute: ActivatedRoute) {
	}

	setViewEntryParent(viewEntryParent: string) {
		this.viewEntryParent = viewEntryParent;
	}

	setSearchResultsParent(searchResultsParent: string) {
		this.searchResultsParent = searchResultsParent;
	}

	setAddEntryParent(addEntryParent: string) {
		this.addEntryParent = addEntryParent;
	}

	closeViewEntry() {
		if(this.viewEntryParent != null) {
			this.router.navigate([this.viewEntryParent]);
			// clear viewEntryParent?
		} else {
			console.error('closeViewEntry() - viewEntryParent is null. Rerouting to /library');
			this.router.navigate(['/library']);
		}
	}

	closeSearchResults() {
		if(this.searchResultsParent != null) {
			this.router.navigate([this.searchResultsParent]);
			// clear searchResultsParent?
		} else {
			console.error('closeSearchResults() - searchResultsParent is null. Rerouting to /library');
			this.router.navigate(['/library']);
		}
	}

	closeAddEntry() {
		if(this.addEntryParent != null) {
			this.router.navigate([this.addEntryParent]);
			// clear addEntryParent?
		} else {
			console.error('closeAddEntry() - addEntryParent is null. Rerouting to /library');
			this.router.navigate(['/library']);
		}
	}

	goBack() {
		this.location.back();
	}
}
