import { Component, OnInit } from '@angular/core';

import * as fromLibrary from '../../store';
import * as LibraryActions from '../../store/library.actions';
import { Store } from '@ngrx/store';

@Component({
	selector: 'app-library',
	templateUrl: './library.component.html',
	styleUrls: ['./library.component.css']
})
export class LibraryComponent implements OnInit {

	constructor(private store: Store<fromLibrary.LibraryState>) { }

	ngOnInit() {
	}

}
