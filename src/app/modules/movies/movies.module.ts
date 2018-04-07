import { MoviesComponent } from './movies/movies.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MoviesRoutingModule } from './movies-routing.module';
import { MovieListComponent } from './movie-list/movie-list.component';

import { MovieComponent } from './movie/movie.component';
import { MovieEditComponent } from './movie-edit/movie-edit.component';
import { MovieSearchResultsComponent } from './movie-search-results/movie-search-results.component';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		MoviesRoutingModule
	],
	declarations: [
		MoviesComponent,
		MovieEditComponent,
		MovieSearchResultsComponent,
		MovieComponent,
		MovieListComponent
	]
})
export class MoviesModule { }
