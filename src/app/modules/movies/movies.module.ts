import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { SharedModule } from '../shared/shared.module';
import { AddMovieComponent } from './add-movie/add-movie.component';
import { MovieEditComponent } from './movie-edit/movie-edit.component';
import { MovieLibraryComponent } from './movie-library/movie-library.component';
import { MovieListComponent } from './movie-list/movie-list.component';
import { MovieSearchResultsComponent } from './movie-search-results/movie-search-results.component';
import { MovieComponent } from './movie/movie.component';
import { MoviesRoutingModule } from './movies-routing.module';
import { reducers } from './redux';
import { MovieEffects } from './redux/movie.effects';


@NgModule({
	imports: [
		CommonModule,
		SharedModule,
		MoviesRoutingModule,
		StoreModule.forFeature('library', reducers),
		EffectsModule.forFeature([MovieEffects])
	],
	exports: [
		AddMovieComponent,
		MovieComponent,
		MovieLibraryComponent,
		MovieEditComponent,
		MovieListComponent,
		MovieSearchResultsComponent
	],
	declarations: [
		AddMovieComponent,
		MovieComponent,
		MovieLibraryComponent,
		MovieEditComponent,
		MovieListComponent,
		MovieSearchResultsComponent
	]
})
export class MoviesModule { }
