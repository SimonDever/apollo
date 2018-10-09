import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-back-button',
	templateUrl: './back-button.component.html',
	styleUrls: ['./back-button.component.css']
})
export class BackButtonComponent implements OnInit {

	constructor(private location: Location) { }

	ngOnInit() { }

	navigateBack() {
		this.location.back();
	}

}
