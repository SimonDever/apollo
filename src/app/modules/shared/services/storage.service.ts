import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Entry } from '../../library/store/entry.model';
import * as Datastore from 'nedb';
import { ElectronService } from 'ngx-electron';

@Injectable()
export class StorageService {

	importStorageCount: number;
	datastore;
	config;

	constructor(private electronService: ElectronService) {

		console.log('StorageService constructor :: constructor');


		this.importStorageCount = 0;

		this.datastore = new Datastore({
			filename: `${this.electronService.remote.app.getPath('userData')}\\library-database.json`,
			autoload: true
		});

		this.config = new Datastore({
			filename: `${this.electronService.remote.app.getPath('userData')}\\library-config.json`,
			autoload: true
		});
	}

	backup() {
		this.datastore.find({}, (readError, entries) => {
			if (readError) {
				console.log(readError);
				return;
			}

			this.electronService.remote.require('fs')
				.writeFile(`${this.electronService.remote.app.getPath('userData')}\\library-database-backup.json`, JSON.stringify(entries), 'utf8', writeError => {
					if (writeError) {
						console.log(writeError);
						return;
					}
					console.log('StorageService :: backup() - Backup file written to disk');
				});
		});
	}

	getConfig() {
		console.log(`StorageService :: getConfig() - database:`, this.config);
		return new Observable(subscriber => {
			this.config.find({id: 'config'}, (err, configItems) => {
				if (err) {
					subscriber.error(err);
				}

				console.log('StorageService :: getConfig() - items:', configItems[0]);
				subscriber.next(configItems[0]);
			});
		});
	}

	setConfig(configItems: any): Observable<any> {
		return new Observable(subscriber => {
			/*
			this.config.find({id: 'config'}, (err, configItems) => {
				if (err) {
					subscriber.error(err);
				}

				if(!configItems || Array.isArray(configItems) && configItems.length === 0) {
					this.config.insert...
					subscriber.next(configItems)
				}
			});
			*/
			this.config.update(
				{ id: 'config' },
				{ $set: { ...configItems }},
				{ upsert: true },
				(err, numberOfUpdated) => {
					if (err) {
						subscriber.error(err);
					}
					console.log('number of items updated: ', numberOfUpdated);
					subscriber.next(numberOfUpdated);
				}
			);
		});
	}

	getAllEntries(): Observable<Entry[]> {
		console.log(`StorageService :: load :: this.datastore.filename: ${this.datastore.filename}`);
		return new Observable(subscriber => {
			this.datastore.find({}, (err, entries) => {
				if (err) {
					subscriber.error(err);
				}
				console.log('load()', entries);
				subscriber.next(entries);
			});
		});
	}

	getEntries(): Observable<Entry[]> {
		return new Observable(subscriber => {
			this.datastore.find({}, (err, entries) => {
				if (err) {
					subscriber.error(err);
				}
				console.log('getEntries()', entries);
				subscriber.next(entries);
			});
		});
	}

	getEntry(id: string): Observable<Entry> {
		return new Observable(subscriber => {
			this.datastore.find({ id: id }, (err, entry) => {
				if (err) {
					subscriber.error(err);
				}
				console.log('getEntry(id)', entry);
				subscriber.next(entry);
			});
		});
	}

	updateEntry(id: string, entry: Entry): Observable<Entry> {

		const valuesToRemove = {};
		Object.entries(entry).forEach(([k, v]) => {
			if (v == null || v === 'null') {
				delete entry[k];
				valuesToRemove[k] = true;
			}
		});

		return new Observable(subscriber => {
			this.datastore.update({ id: id }, {
				$set: { ...entry },
				$unset: { ...valuesToRemove }
			}, {}, ((err, numberOfUpdated) => {
				if (err) {
					subscriber.error(err);
				}
				console.log('number of items updated: ', numberOfUpdated);
				subscriber.next(entry);
			}).bind(this));
		});
	}

	searchEntry(keywords: string): Observable<Entry[]> {
		const searchRegex = new RegExp(keywords, 'i');
		return new Observable(subscriber => {
			this.datastore.find({
				$or: [
					{ title: searchRegex },
					{ overview: searchRegex },
					{ file: searchRegex },
					{ cast: searchRegex }
				],
			}, (err, entries) => {
				if (err) {
					subscriber.error(err);
				}
				console.log('searchEntry(title)');
				console.log(entries);
				subscriber.next(entries);
			});
		});
	}

	addEntry(newEntry: Entry): Observable<Entry> {
		return new Observable(subscriber => {
			this.datastore.insert(newEntry, (err, entry) => {
				if (err) {
					subscriber.error(err);
				}
				console.log('addEntry(entry)');
				console.log(entry);
				subscriber.next(entry);
			});
		});
	}

	removeEntry(id: string): Observable<number> {
		console.log('attempting to removeEntry(id)');
		console.log(id);
		return new Observable(subscriber => {
			this.datastore.remove({ id: id }, {}, (err, numRemoved) => {
				if (err) {
					subscriber.error(err);
				}
				console.log('removeEntry(id)');
				console.log(numRemoved);
				subscriber.next(numRemoved);
			});
		});
	}

	base64MimeType(encoded) {
		let result = null;
		if (typeof encoded !== 'string') {
			return result;
		}
		const parts = encoded.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.*)/);
		if (parts && parts.length) {
			result = { mime: parts[1], data: parts[2] };
		} else {
			console.log('no cigar');
		}
		return result;
	}
}
