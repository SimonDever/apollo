import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Movie } from '../../library/store/movie';
//import *  as sqlite3  from 'sqlite3';

@Injectable()
export class StorageService {

	constructor(private http: HttpClient) { }

	getMovies(): Observable<Movie[]> {
		return this.http.get<Movie[]>('/api/movies');
	}

	getMovie(id: number): Observable<Movie> {
		return this.http.get<Movie>('/api/movies/' + id);
	}

	updateMovie(movie: Movie): Observable<Movie> {
		return this.http.put<Movie>('/api/movies/' + movie.id, movie);
	}

	searchMovie(title: string): Observable<Movie[]> {
		return this.http.get<Movie[]>('/api/movies/?title=' + title);
	}

	addMovie(movie: Movie): Observable<Movie> {
		return this.http.put<Movie>('/api/movies/' + movie.id, movie);
	}
}
