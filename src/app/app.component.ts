import { Component, Output } from '@angular/core';
import * as MovieActions from './modules/movies/movie.actions';
import { AppState } from './app.state';
import { StorageService } from './storage.service';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})
export class AppComponent {

	ngOnInit() {
		console.debug('app component ngOnInit entry');
	}
}
