import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddMovieComponent } from './add-movie/add-movie.component';
import { MovieComponent } from './movie/movie.component';
import { MovieEditComponent } from './movie-edit/movie-edit.component';
import { MovieListComponent } from './movie-list/movie-list.component';
import { MovieSearchResultsComponent } from './movie-search-results/movie-search-results.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
		CommonModule,
		SharedModule
	],
	exports: [
		AddMovieComponent,
		MovieComponent,
		MovieEditComponent,
		MovieListComponent,
		MovieSearchResultsComponent
	],
  declarations: [
		AddMovieComponent,
		MovieComponent,
		MovieEditComponent,
		MovieListComponent,
		MovieSearchResultsComponent
	]
})
export class MoviesModule { }
