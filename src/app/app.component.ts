import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})
export class AppComponent {

	title: string = 'Init';

	constructor(private router: Router,
		private activatedRoute: ActivatedRoute) {

		/*
		this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => this.activatedRoute), // Listen to activateRoute
      map(route => {
        while (route.firstChild) {
          route = route.firstChild;
        }
        return route;
      }),
      //filter(route => route.outlet === 'primary'),
			mergeMap(route => route.data))  // get the data 
		)
		*/

		/*
		this.activatedRoute.data.map(data => data.json())
			.subscribe((data) => {
				console.log('data:');
				console.log(data);
				this.title = data.title;
			});
		*/
	}

	ngOnInit() {
		console.debug('app component ngOnInit entry');
	}
}
