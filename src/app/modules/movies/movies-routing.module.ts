import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MovieListComponent } from './movie-list/movie-list.component';
import { MovieComponent } from './movie/movie.component';
import { MovieSearchResultsComponent } from './movie-search-results/movie-search-results.component';
import { MovieEditComponent } from './movie-edit/movie-edit.component';
import { AddMovieComponent } from './add-movie/add-movie.component';

const routes: Routes = [
	{ path: 'movies', component: MovieListComponent },
	{ path: 'movies/h/:id', component: MovieComponent },
	{ path: 'movies/s/:title', component: MovieSearchResultsComponent },
	{ path: 'movies/edit', component: MovieEditComponent },
	{ path: 'movies/add', component: AddMovieComponent },
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class MoviesRoutingModule { }

