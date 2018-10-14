import { Injectable } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { filter, map } from 'rxjs/operators';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class NavigationService {

	constructor(private router: Router,
		private location: Location,
		private activatedRoute: ActivatedRoute) {
	}

	goBack() {
		this.location.back();
	}
}
