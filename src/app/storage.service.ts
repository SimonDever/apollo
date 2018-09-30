import { Injectable } from '@angular/core';
import { Movie } from './modules/movies/movie';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
//import *  as sqlite3  from 'sqlite3';

import { catchError, tap, map } from 'rxjs/operators';

@Injectable()
export class StorageService {

	constructor(private http: HttpClient) { }

	getMovies(): Observable<Movie[]> {
		return this.http.get<Movie[]>('/api/movies');
	}

	getMovie(id: number): Observable<Movie> {
		return this.http.get<Movie>('/api/movies/' + id);
	}

	saveMovie(movie: Movie): Observable<number> {
		return this.http.put<number>('/api/movies/' + movie.id, movie);
	}

	searchMovie(title: string): Observable<Movie[]> {
		return this.http.get<Movie[]>('/api/movies/?title=' + title);
	}

	addMovie(movie: Movie): Observable<Movie> {
		return this.http.put<Movie>('/api/movies/' + movie.id, movie);
	}
}
