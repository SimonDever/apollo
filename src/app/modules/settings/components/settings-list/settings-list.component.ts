import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-settings-list',
	templateUrl: './settings-list.component.html',
	styleUrls: ['./settings-list.component.css']
})
export class SettingsListComponent implements OnInit {

	importData: Array<any>;

	constructor() { }

	ngOnInit() { }

	onChange(event) {
		console.log('onChange');
		console.log(event.target.files[0].name)
		var reader = new FileReader();
		reader.onload = this.onReaderLoad;
		reader.readAsText(event.target.files[0]);
	}

	onReaderLoad(event) {
		var obj = JSON.parse(event.target.result);
		console.log('onReaderLoad');
		if (typeof obj === 'object') {
			obj = [obj];
		}

		const out: any /* Entry */ = {
			id: new Date().toString(),
			title: '',
			poster_path: '',
			files: []
		};

		for (const data of obj) {
			if (data.title) { out.title = data.title; }
			if (data.poster) { out.poster_path = data.poster; }
			if (data.files) {
				data.files.array.forEach(element => {
					if (element.name !== '') {
						out.files.push(element.name);
					}
				}, this);
			}
		}

		console.log('mapValue: ');
		console.log(out);
	}
}
