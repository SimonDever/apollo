import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, EventEmitter } from '@angular/core';
import { Store } from '@ngrx/store';

import theMovieDb from 'themoviedb-javascript-library';
import * as fromLibrary from '../../library/store';
import * as LibraryActions from '../../library/store/library.actions';
import { Observable } from 'rxjs';

@Injectable()
export class SearchService {

	movieDb: theMovieDb;

	constructor(
		private httpClient: HttpClient,
		private store: Store<fromLibrary.LibraryState>,
		@Inject('MOVIEDB_API_KEY') movieDbApiKey) {
			this.movieDb = theMovieDb;
			this.movieDb.common.api_key = movieDbApiKey;
			this.movieDb.commonbase_uri = 'https://api.themoviedb.org/3/';
			this.movieDb.commonimages_uri = 'https://image.tmdb.org/t/p/';
			this.movieDb.commontimeout = 10000;
	}


	async convertPoster(url: string) {
		const response = await fetch(url);
		const data = await response.blob();
		return new File([data], 'test.png', {	type: 'image/png'	});
	}

	search(keywords: string, page: number = 1): any {
		console.debug(`SearchService.search(${keywords},${page}) entry`);
		this.movieDb.search.getMulti({'query': keywords, page: page},
			(function(data) {
				let response = {
					page: 1,
					results: [],​
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
			}.bind(this)),
			(function(data) {
				console.error('Error retrieving search results');
				console.error(data);
				this.store.dispatch(new LibraryActions.ShowMetadataResults({ results: {
					page: 1,
					results: [],​
					total_pages: 1,
					total_results: 0
				}}));
			}.bind(this))
		);
	}

	// TODO: move these actions back to effects and just return observable from here
	details(id: string, media_type: string): any {
		console.debug(`SearchService.details(${id}) entry`);
		let resource = this.movieDb.movies;
		if (media_type === 'tv') {
			resource = this.movieDb.tv;
		}
		resource.getById({'id': id},
			(function(data) {
				this.store.dispatch(new LibraryActions.ShowMetadataDetailsResults({ details: JSON.parse(data) }));
			}.bind(this)),
			(function(data) {
				console.error('Error retrieving search details');
				console.error(data);
				this.store.dispatch(new LibraryActions.ShowMetadataDetailsResults({ details: JSON.parse(data) }));
			}.bind(this))
		);
	}
}
