import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Entry } from '../../library/store/entry.model';
import * as Datastore from 'nedb';
import { ElectronService } from 'ngx-electron';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

	datastore;
	config;

	constructor(private electronService: ElectronService) {
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
			} else {
				this.electronService.remote.require('fs')
					.writeFile(`${this.electronService.remote.app.getPath('userData')}\\library-database-backup.json`, JSON.stringify(entries), 'utf8', writeError => {
						if (writeError) {
							console.error(writeError);
							return;
						}
						//console.log('StorageService :: backup() - Backup file written to disk');
					});
			}
		});
	}

	getConfig() {
		//console.log(`StorageService :: getConfig() - database:`, this.config);
		return new Observable(subscriber => {
			this.config.find({ id: 'config' }, (err, configItems) => {
				if (err) {
					subscriber.error(err);
				} else {
					//console.log('StorageService :: getConfig() - items:', configItems[0]);
					subscriber.next(configItems[0]);
				}
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
				{ $set: { ...configItems } },
				{ upsert: true },
				(err, numberOfUpdated) => {
					if (err) {
						subscriber.error(err);
					} else {
						//console.log('number of items updated: ', numberOfUpdated);
						subscriber.next(numberOfUpdated);
					}
				}
			);
		});
	}

	deleteAllEntries(): Observable<number> {
		//console.log(`StorageService :: deleteAllEntries :: `);
		return new Observable(subscriber => {
			this.datastore.remove({}, { multi: true }, function (err, countRemoved) {
				if (err) {
					subscriber.error(err);
				} else {
					//console.log('deleteAllEntries() complete');
					subscriber.next(countRemoved);
				}
			});
		})
	}

	getAllEntries(): Observable<Entry[]> {
		//console.log(`StorageService :: load :: this.datastore.filename: ${this.datastore.filename}`);
		return new Observable(subscriber => {
			this.datastore.find({}, (err, entries) => {
				if (err) {
					subscriber.error(err);
				} else {
					//console.log('load()', entries);
					subscriber.next(entries);
				}
			});
		});
	}

	getEntries(): Observable<Entry[]> {
		return new Observable(subscriber => {
			this.datastore.find({}, (err, entries) => {
				if (err) {
					subscriber.error(err);
				}
				//console.log('getEntries()', entries);
				subscriber.next(entries);
			});
		});
	}

	getEntry(id: string): Observable<Entry> {
		return new Observable(subscriber => {
			this.datastore.find({ id: id }, (err, entry) => {
				if (err) {
					subscriber.error(err);
				} else {
					//console.log('getEntry(id)', entry);
					subscriber.next(entry);
				}
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
			}, { upsert: true }, ((err, numberOfUpdated) => {
				if (err) {
					subscriber.error(err);
				} else {
					//console.log('number of items updated: ', numberOfUpdated);
					subscriber.next(entry);
				}
			}).bind(this));
		});
	}

	searchEntry(input: string): Observable<Entry[]> {
		const parts = input.split(':');
		if (parts.length === 2) {
			const field = parts[0];
			const keyword = parts[1];
			return new Observable(subscriber => {
				this.datastore.find({ $where: () =>
					Object.entries(this).filter(([key, value]) =>
						key.toLowerCase() === field.toLowerCase() &&
						value.toLowerCase().includes(keyword.toLowerCase())
					)}, (err, entries) => {
					if (err) {
						subscriber.error(err);
					} else {
						console.log(`searchEntry(${input}) results:`);
						console.log(entries);
						subscriber.next(entries);
					}
				});
			});
		} else {
			const keyword = parts[0];
			console.log('keyword', keyword);
			return new Observable(subscriber => {
				this.datastore.find({ $where: () =>
					Object.values(this).includes(keyword)
				}, (err, entries) => {
					if (err) {
						subscriber.error(err);
					} else {
						console.log(`searchEntry(${input}) results:`);
						console.log(entries);
						subscriber.next(entries);
					}
				});
			});
		}
		/*		
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
				} else {
					//console.log('searchEntry(title)');
					//console.log(entries);
					subscriber.next(entries);
				}
			});
		});
		*/
	}

	getFileFromPath(file: string) {
		const forwardSlash = file.lastIndexOf('/');
		const backwardSlash = file.lastIndexOf('\\');
		let separator = forwardSlash, newTitle;
		if (forwardSlash === -1) {
			separator = backwardSlash;
		}
		newTitle = file.substring(separator + 1);
		return newTitle;
	}

	changeAllPathsTo(): Observable<Entry> {

		const newPath = `\\\\Synology\\Movies\\`;
		//console.log(`Changing all movie file paths to ${newPath}`);

		return new Observable(subscriber => {
			//console.log('finding entries');
			this.datastore.find({}, (err, entries) => {
				if (err) {
					subscriber.error(err);
				} else {
					//console.log(`found ${entries.length} entries`);

					const newEntries = [];
					for(const entry of entries) {
						let newFileValue = entry.file;
						entry.files = undefined;
						entry.path = undefined;
						newFileValue = this.getFileFromPath(newFileValue);
						newFileValue = newPath + newFileValue;
						//console.log(`changed ${entry.file} to ${newFileValue}`);
						entry.file = newFileValue;
						newEntries.push(entry);
					}

					//console.log('all new entries', entries);

					this.datastore.remove({}, { multi: true}, (err, numRemoved) => {
						if (err) {
							console.error('error', err);
						}
						//console.log('number removed:', numRemoved);
						//console.log('updating entries', newEntries);
						this.datastore.insert(newEntries, (err, entriesOut) => {
							if (err) {
								subscriber.error(err);
							}
							//console.log('new entries after insert: ', entriesOut);
							subscriber.next(entriesOut);
						});
					});
				}
			});
		})
	}

	exists(file: string): Observable<Entry> {
		return new Observable(subscriber => {
			this.datastore.find({ file: new RegExp(file, 'i') }, (err, exists) => {
				if (err) {
					//console.log(`exists(${file}) error:`, err);
					subscriber.error(err);
				}
				//console.log(`exists(${file})`, exists);
				subscriber.next(exists);
			});
		});
	}

	addEntry(newEntry: Entry): Observable<Entry> {
		return new Observable(subscriber => {
			this.datastore.insert(newEntry, (err, entry) => {
				if (err) {
					subscriber.error(err);
				}
				//console.log('addEntry(entry)');
				//console.log(entry);
				subscriber.next(entry);
			});
		});
	}

	removeEntry(id: string): Observable<number> {
		//console.log('attempting to removeEntry(id)');
		//console.log(id);
		return new Observable(subscriber => {
			this.datastore.remove({ id: id }, {}, (err, numRemoved) => {
				if (err) {
					subscriber.error(err);
				}
				//console.log('removeEntry(id)');
				//console.log(numRemoved);
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
			//console.log('no cigar');
		}
		return result;
	}
}
