import { Component, OnInit } from '@angular/core'
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Router, RouterStateSnapshot } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { NavigationService } from '../../../shared/services/navigation.service';
import { Entry } from '../../store/entry.model';
import * as fromLibrary from '../../store/index';
import * as LibraryActions from '../../store/library.actions';

@Component({
	selector: 'app-search-results',
	templateUrl: './search-results.component.html',
	styleUrls: ['./search-results.component.css'],
	animations: [
    // the fade-in/fade-out animation.
    trigger('simpleFadeAnimation', [

      // the "in" style determines the "resting" state of the element when it is visible.
      state('in', style({opacity: 1})),

      // fade in when created. this could also be written as transition('void => *')
      transition(':enter', [
        style({opacity: 0}),
        animate(600 )
      ]),

      // fade out when destroyed. this could also be written as transition('void => *')
      transition(':leave',
        animate(600, style({opacity: 0})))
    ])
  ]
})
export class SearchResultsComponent implements OnInit {

	routerState: RouterStateSnapshot;
	entries$: Observable<Entry[]>;

	constructor(private navigationService: NavigationService,
		private store: Store<fromLibrary.LibraryState>,
		private router: Router) {
			this.routerState = router.routerState.snapshot;
	}

	ngOnInit() {
		this.entries$ = this.store.pipe(select(fromLibrary.getSearchResults));
	}

	close() {
		this.navigationService.closeSearchResults();
	}

	entryClicked(entry: Entry) {
		this.navigationService.setViewEntryParent(this.routerState.url);
		this.store.dispatch(new LibraryActions.SelectEntry({ entry: entry }));
	}

	addEntry() {
		let currentLocation = this.routerState.url;
		this.navigationService.setAddEntryParent(currentLocation);
		this.navigationService.setViewEntryParent(currentLocation);
		this.router.navigate(['/library/add']);
	}
}
