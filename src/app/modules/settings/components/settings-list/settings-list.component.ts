
import { Component, OnInit } from '@angular/core';
import { Entry } from '../../../library/store/entry.model';
import { StorageService } from '../../../shared/services/storage.service';
import { ElectronService } from 'ngx-electron';
import { Store } from '@ngrx/store';
import * as fromLibrary from '../../../library/store';
import * as LibraryActions from '../../../library/store/library.actions';

const uuid = require('uuid/v4');

// TODO: auto cull of posters previously downloaded but not in use

@Component({
	selector: 'app-settings-list',
	templateUrl: './settings-list.component.html',
	styleUrls: ['./settings-list.component.css']
})
export class SettingsListComponent implements OnInit {

	importData: Array<any>;

	constructor(private storageService: StorageService,
		private store: Store<fromLibrary.LibraryState>,
		private electronService: ElectronService) { }

	ngOnInit() { }

	onChange(event) {
		console.log('onChange :: entry');
		console.log(event.target.files[0].name);
		const reader = new FileReader();
		reader.onload = (function (f) {
			return function (e) {
				// Here you can use `e.target.result` or `this.result`
				// and `f.name`.
				f.onReaderLoad(e);
			};
		})(this);
		reader.readAsText(event.target.files[0]);
	}

	onReaderLoad(event) {
		const obj = JSON.parse(event.target.result);
		console.log('onReaderLoad :: entry');

		/* if (typeof obj === 'object') {
			obj = [obj];
		} */

		// const allEntries: Entry[] = [];

		console.log('obj: ', obj);
		for (const data of obj) {
			console.log('data:', data);


			const out: Entry = {
				id: uuid(),
			};
			if (data.files) {
				out.files = [];
				data.files.forEach((element, index) => {
					if (index === 0) { out.file = element.path; }
					if (element.path !== '') {
						out.files.push(element.path);
					}
				}/* , this */);
			}
			if (data.currentMatch == null) {
				console.log('could not find current match number');
				data.currentMatch = 0;
			}

			const match = data.matches[data.currentMatch];
			if (match.Title) { out.title = match.Title; }
			if (match.Plot) { out.overview = match.Plot; }
			if (match.Poster) {
				const poster: string = match.Poster;
				if (poster.startsWith('data:image')) {
					console.log('starts with base64 stuff');
					const matchData = poster.replace(/^data:image\/[a-z]+;base64,/, '');
					const poster_path = `${this.electronService.remote.app.getAppPath()}/posters/${out.id}.png`;
					console.log('attempting to write poster to ');
					console.log(poster_path);
					this.electronService.remote.require('fs').writeFile(poster_path, matchData, 'base64', (err) => {
						err ? console.log(err) : console.log('poster written to disk');
					});
					out.poster_path = poster_path;
				} else {
					console.log('not base64 poster, just going to save whatever it is');
					out.poster_path = match.Poster;
				}
			}
			if (match.Year) { out.year = match.Year; }
			if (match.Rated) { out.rated = match.Rated; }
			if (match.Released) { out.released = match.Released; }
			if (match.Runtime) { out.runtime = match.Runtime; }
			if (match.Genre) { out.genre = match.Genre; }
			if (match.Director) { out.director = match.Director; }
			if (match.Writer) { out.writer = match.Writer; }
			if (match.Actors) { out.actors = match.Actors; }
			if (match.Language) { out.language = match.Language; }
			if (match.Country) { out.country = match.Country; }
			if (match.Awards) { out.awards = match.Awards; }
			if (match.Metascore) { out.metascore = match.Metascore; }
			if (match.imdbRating) { out.imdbRating = match.imdbRating; }
			if (match.imdbVotes) { out.imdbVotes = match.imdbVotes; }
			if (match.imdbID) { out.imdbID = match.imdbID; }
			if (match.Type) { out.type = match.Type; }

			console.log('finished one: ', out);

			this.store.dispatch(new LibraryActions.ImportEntry({ entry: out }));
		}

		console.log('finished all');
	}
}
