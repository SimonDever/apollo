import { Injectable, Inject } from '@angular/core';
//const MovieDb = require('moviedb-promise');
import MovieDb from 'moviedb-promise-es6';

@Injectable()
export class SearchService {

  movieDb;

  constructor(@Inject('MOVIEDB_API_KEY') movieDbApiKey) {
    this.movieDb = new MovieDb(movieDbApiKey);
   }

  search() {
    console.debug('SearchService->search(): method entry');
    
    this.movieDb
  }

}
