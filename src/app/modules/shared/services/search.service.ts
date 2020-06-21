import { Inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import theMovieDb from 'themoviedb-javascript-library';
import * as fromLibrary from '../../library/store';
import * as LibraryActions from '../../library/store/library.actions';
import { ConfigService } from './config.service';
import { ToastService } from './toast.service';
import { Observable, Subscriber, of } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

	movieDb: theMovieDb;

	constructor(
		private configService: ConfigService,
		private toastService: ToastService,
		private store: Store<fromLibrary.LibraryState>) {
			this.movieDb = theMovieDb;
			this.movieDb.commonbase_uri = 'https://api.themoviedb.org/3/';
			this.movieDb.commonimages_uri = 'https://image.tmdb.org/t/p/';
			this.movieDb.commontimeout = 10000;
	}

	search(keywords: string, page: number = 1): any {
		this.movieDb.common.api_key = this.configService.apiKey;
		console.debug(`SearchService.search(${keywords},${page}) entry`);
		this.movieDb.search.getMulti({ 'query': keywords, page: page },
			(function (data) {
				let response = {
					page: 1,
					results: [],
					total_pages: 1,
					total_results: 0
				};

				try {
					response = JSON.parse(data);
					response.results = response.results.filter(el => el.media_type === 'tv' || el.media_type === 'movie');
					response.total_pages = Math.ceil(response.results.length / 20);
					response.total_results = response.results.length;
				} catch (e) {
					console.error(e);
				} finally {
					this.store.dispatch(new LibraryActions.ShowMetadataResults({ results: response }));
				}
			}.bind(this)), (function (data) {
				data = JSON.parse(data);
				console.error('Error retrieving search results');
				console.error(data);
				this.toastService.showDanger(data.status_message);
				this.store.dispatch(new LibraryActions.ShowMetadataResults({
					results: {
						page: 1,
						results: [],
						total_pages: 1,
						total_results: 0
					}
				}));
			}.bind(this))
		);
	}

	getFirstResult(entry: any): Observable<any> {
		this.movieDb.common.api_key = this.configService.apiKey;
		console.log(`SearchService.getFirstResult(${entry.title})`);
		return new Observable(subscriber => {
			this.movieDb.search.getMulti({ 'query': entry.title, page: 1 },
				data => subscriber.next(JSON.parse(data).results),
				err => subscriber.error(err));
		}).pipe(mergeMap((options: any) => {
			console.log('getFirstResult, entry', entry);
			console.log('getFirstResult', options);
			if (options.length === 0) {
				return of(entry);
			}
			console.log(`getFirstResult -> get details about id=${options[0].id}`);
			return new Observable(subscriber => {
				this.movieDb.movies.getById({ 'id': options[0].id },
					data => {
						const output = JSON.parse(data);
						output.file = entry.file;
						subscriber.next(output);
					},
					err => subscriber.error(err));
			});
		}));
	}

	// TODO: move these actions back to effects and just return observable from here
	details(id: string, media_type: string): any {
		console.debug(`SearchService.details(${id}) entry`);
		let resource = this.movieDb.movies;
		if (media_type === 'tv') {
			resource = this.movieDb.tv;
		}
		resource.getById({ 'id': id },
			(function (data) {
				this.store.dispatch(new LibraryActions.ShowMetadataDetailsResults({ details: JSON.parse(data) }));
			}.bind(this)),
			(function (data) {
				console.error('Error retrieving search details');
				console.error(data);
				this.store.dispatch(new LibraryActions.ShowMetadataDetailsResults({ details: JSON.parse(data) }));
			}.bind(this))
		);
	}
}
