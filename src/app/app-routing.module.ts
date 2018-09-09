import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MovieListComponent } from './modules/movies/movie-list/movie-list.component';
import { MovieComponent } from './modules/movies/movie/movie.component';
import { MovieSearchResultsComponent } from './modules/movies/movie-search-results/movie-search-results.component';
import { MovieEditComponent } from './modules/movies/movie-edit/movie-edit.component';
import { AddMovieComponent } from './modules/movies/add-movie/add-movie.component';

const routes: Routes = [
	{ path: '', redirectTo: 'movies', pathMatch: 'full' },
	{ path: 'movies', component: MovieListComponent },
	{ path: 'movies/h/:id', component: MovieComponent },
	{ path: 'movies/s/:title', component: MovieSearchResultsComponent },
	{ path: 'movies/edit', component: MovieEditComponent },
	{ path: 'movies/add', component: AddMovieComponent },
	{ path: '**', redirectTo: 'movies', pathMatch: 'full' }
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule { }
