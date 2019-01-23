import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Entry } from '../../library/store/entry.model';
import * as Datastore from 'nedb';
import { ElectronService } from 'ngx-electron';

@Injectable()
export class StorageService {

	datastore;
	datastorePath: string;

	constructor(private http: HttpClient,
		private electronService: ElectronService) {
		
		console.log('StorageService constructor :: ');

		this.datastore = new Datastore({
			filename: `${this.electronService.remote.app.getAppPath()}\\library-database.json`,
		});

		this.datastore.loadDatabase(function(err){
			if(err) console.error(err);
		});

		//this.backup();
	}

	backup() {
		this.datastore.find({}, (err, entries) => {
			if (err) {
				console.log(err)
				return
			}
		
			this.electronService.remote.require('fs')
				.writeFile(`${this.electronService.remote.app.getAppPath()}\\library-database-backup.json`,
					JSON.stringify(entries), 'utf8', (err) => {
				if (err) {
					console.log(err)
					return
				}
		
				console.log('backup file written to disk');
				});
		});
	}

	load(): Observable<Entry[]> {
		console.log(`StorageService :: load :: this.datastore.filename: ${this.datastore.filename}`);
		return new Observable(subscriber => {
			this.datastore.find({}, function (err, entries) {
				if (err) subscriber.error(err);
				console.log('load()');
				console.log(entries);
				subscriber.next(entries);
			});
		});
	}

	getEntries(): Observable<Entry[]> {
		return new Observable(subscriber => {
			this.datastore.find({}, function (err, entries) {
				if (err) subscriber.error(err);
				console.log('getEntries()');
				console.log(entries);
				subscriber.next(entries);
			});
		})
	}

	getEntry(id: string): Observable<Entry> {
			return new Observable(subscriber => {
				this.datastore.find({id: id}, function (err, entries) {
					if (err) subscriber.error(err);
					console.log('getEntry(id)');
					console.log(entries);
					subscriber.next(entries);
				});
			})
	}

	updateEntry(entry: Entry): Observable<Entry> {
		return new Observable(subscriber => {
			this.datastore.update({id: entry.id}, {$set: entry}, {}, function (err, numberOfUpdated) {
				if (err) subscriber.error(err);
				console.log('updateEntry number updated' + numberOfUpdated);
				console.log('updateEntry(entry)');
				console.log(entry);
				subscriber.next(entry);
			});
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
				},
				function (err, entries) {
					if (err) subscriber.error(err);
					console.log('searchEntry(title)');
					console.log(entries);
					subscriber.next(entries);
				}
			);
		});
	}

	addEntry(entry: Entry): Observable<Entry> {
		return new Observable(subscriber => {
			this.datastore.insert(entry, function (err, entry) {
				if (err) subscriber.error(err);
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
			this.datastore.remove({id: id}, {}, function (err, numRemoved) {
				if (err) subscriber.error(err);
				console.log('removeEntry(id)');
				console.log(numRemoved);
				subscriber.next(numRemoved);
			});
		});
	}
}
