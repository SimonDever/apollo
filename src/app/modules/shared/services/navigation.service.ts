import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable()
export class NavigationService {
	//private titleSource = new BehaviorSubject<string>("Page Title");
	//currentTitle = this.titleSource.asObservable();
	previousUrl = '';
	currentUrl = '';

	constructor(private router: Router) {
		/*
		this.currentUrl = this.router.url;
		this.router.events.subscribe(event => {
			if(event instanceof NavigationEnd) {
				this.previousUrl = this.currentUrl;
				this.currentUrl = event.url;
			}
		});
		*/
	}

	/*
	changeTitle(title: string) {
		this.titleSource.next(title);
	}
	*/

	getPreviousUrl() {
		return this.previousUrl;
	}
}
