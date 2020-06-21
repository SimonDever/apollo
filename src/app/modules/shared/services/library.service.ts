import { Location } from '@angular/common';
import { Injectable, NgZone } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as fromLibrary from '../../library/store';
import * as LibraryActions from '../../library/store/library.actions';
import { Store } from '@ngrx/store';
import { StorageService } from './storage.service';
import { ElectronService } from 'ngx-electron';
import { NavigationService } from './navigation.service';
import { take, map } from 'rxjs/operators';

const uuid = require('uuid/v4');

@Injectable({
  providedIn: 'root'
})
export class LibraryService {

	selectedEntryId: any;
	userDataFolder: string;
	fs: any;

	// Regular expression for image type:
	// This regular image extracts the "jpeg" from "image/jpeg"
	imageTypeRegularExpression = /\/(.*?)$/;      

	constructor(private router: Router,
		private location: Location,
		private zone: NgZone,
		private navigationService: NavigationService,
		private electronService: ElectronService,
		private storageService: StorageService,
		private store: Store<fromLibrary.State>,
		private activatedRoute: ActivatedRoute) {
			this.userDataFolder = this.electronService.remote.app.getPath('userData');
			this.fs = this.electronService.remote.require('fs');
		}

	setSelectedEntryId(id: any) {
		this.selectedEntryId = id;
	}

	getSelectedEntryId() {
		return this.selectedEntryId;
	}

	convertDataUri(entry: any) {
		const imageBuffer = this.decodeBase64Image(entry.poster_path);
		const imageTypeDetected = imageBuffer.type.match(this.imageTypeRegularExpression);
		const ext = imageTypeDetected[1];
		const path = `${this.userDataFolder}\\posters\\${uuid()}.${ext}`;
		entry.poster_path = path;
		this.writeImage(imageBuffer.data, path);
	}

	savePoster(entry: any) {
		console.log('savePoster', entry.poster_path);
		if (entry.poster_path.startsWith('data:image')) {
			this.convertDataUri(entry);
		} else if (entry.poster_path.startsWith(this.userDataFolder)) {
			// picture already exists
		} else if (entry.poster_path.startsWith('/')) {
			this.convertUrlPath(entry);
		}
	}

	createImageFile(data, path) {
		const reader = new FileReader();
		reader.addEventListener('load', (function () {
			const imageBuffer = this.decodeBase64Image(reader.result);
			this.writeImage(imageBuffer.data, path);
		}.bind(this)), false);
		reader.readAsDataURL(data);
	}

	convertUrlPath(entry: any) {
		if (entry.poster_path) {
			const url = `http://image.tmdb.org/t/p/original${entry.poster_path}`;
			const filename = entry.poster_path.substring(1);
			const path = `${this.userDataFolder}\\posters\\${filename}`;
			entry.poster_path = path;
			fetch(url).then((response =>
				response.blob().then(data =>
					this.createImageFile(data, path)
				)
			).bind(this));
		} else {
			console.log('no poster_path field on entry found during request to convert');
		}
	}

	saveEntry(entry: any) {
		this.savePoster(entry);
		this.store.dispatch(new LibraryActions.UpdateEntry({ entry: entry }));
	}

	createEntry(file) {
		let tempTitle = file.name
			.replace(/\.[^/.]+$/, '')
			.replace(/\(\d{4}\)/, '')
			.split("-")[0]
			.trim();
		
		this.storageService.exists(file.path).pipe(take(1), map(files => {
			const exists = Array.isArray(files) && files.length > 0;
			// TODO: move this confirm option into settings page to allow duplicates
			if (!exists /* || confirm(`Still want to add ${filename} when you already have ${files.join(', ')}.`) */) {
				this.store.dispatch(new LibraryActions.ImportEntry({ entry: {
					id: uuid(),
					title: tempTitle,
					file: file.path
				}}));
			} else {
				console.log('Duplicate detected', file.path);
			}
		})).subscribe();
	}


	decodeBase64Image(dataString: string) {
		var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
		var response: any = {};
		if (matches.length !== 3){
			return new Error('Invalid input string');
		}

		response.type = matches[1];
		response.data = new Buffer(matches[2], 'base64');
		return response;
	}

	writeImage(data, path) {
		this.fs.writeFile(path, data, err => {
			console.debug('electronService remove writeFile - image updated');
			err ? console.log(err) : console.log('poster written to disk');
		});
	}
}
