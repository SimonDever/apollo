import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Entry } from '../../library/store/entry.model';

@Injectable()
export class StorageService {

	constructor(private http: HttpClient) { }

	getEntries(): Observable<Entry[]> {
		return this.http.get<Entry[]>('/api/entries');
	}

	getEntry(id: number): Observable<Entry> {
		return this.http.get<Entry>('/api/entries/' + id);
	}

	updateEntry(entry: Entry): Observable<Entry> {
		return this.http.put<Entry>('/api/entries/' + entry.id, entry);
	}

	searchEntry(title: string): Observable<Entry[]> {
		return this.http.get<Entry[]>('/api/entries/?title=' + title);
	}

	addEntry(entry: Entry): Observable<Entry> {
		return this.http.put<Entry>('/api/entries/' + entry.id, entry);
	}
}
