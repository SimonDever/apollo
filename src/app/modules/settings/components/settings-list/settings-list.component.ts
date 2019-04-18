import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-settings-list',
	templateUrl: './settings-list.component.html',
	styleUrls: ['./settings-list.component.css']
})
export class SettingsListComponent implements OnInit {

	constructor() { }

	ngOnInit() {

	}

	export() {
		
	}

	import(event) {
		const path = event.target.files[0].path || event.target.files[0].path;
		if(path == null) {
			console.warn(`Could not get full path to database`);
		} else {
			console.log(`Importing file: ${path}`);
		}
	}

}
