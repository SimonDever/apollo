import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import MovieDb from 'moviedb-promise-es6';


@Injectable()
export class SearchService {

	movieDb: MovieDb;

	constructor(
		private httpClient: HttpClient,
		@Inject('MOVIEDB_API_KEY') movieDbApiKey) {
		this.movieDb = new MovieDb(movieDbApiKey);
	}

	search() {
		console.debug('SearchService->search(): method entry');
	}
}
