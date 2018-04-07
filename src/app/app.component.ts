import { Component } from '@angular/core';
import * as MovieActions from './redux/actions/movie.actions';
import { AppState } from './redux/state/app.state';
import { StorageService } from './storage.service';
import { Store } from '@ngrx/store';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})
export class AppComponent {

	ngOnInit() {
		console.debug('app-component ngOnInit entry');
	}
}