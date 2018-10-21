import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Entry } from '../../library/store/entry.model';
import * as Datastore from 'nedb';

@Injectable()
export class StorageService {

	datastore;

	constructor(private http: HttpClient) {
	}

	load(): Observable<Entry[]> {
		this.datastore = new Datastore({
			filename: 'library-database.json',
			autoload: true,
		});
		return new Observable(subscriber => {
			this.datastore.find({}, function (err, entries) {
				if (err) subscriber.error(err);
				console.log('load()');
				console.log(entries);
				subscriber.next(entries);
			});
		})
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
			this.datastore.update({id: entry.id}, {entry}, function (err, entry) {
				if (err) subscriber.error(err);
				console.log('updateEntry(entry)');
				console.log(entry);
				subscriber.next(entry);
			});
		});
	}

	searchEntry(title: string): Observable<Entry[]> {
		return new Observable(subscriber => {
			this.datastore.find({title: new RegExp(title, 'i')},
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
