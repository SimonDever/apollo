import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { SharedModule } from '../shared/shared.module';
import { AddMovieComponent } from './add-movie/add-movie.component';
import { EditMovieComponent } from './edit-movie/edit-movie.component';
import { MovieLibraryComponent } from './movie-library/movie-library.component';
import { MovieListComponent } from './movie-list/movie-list.component';
import { MovieSearchResultsComponent } from './movie-search-results/movie-search-results.component';
import { ViewMovieComponent } from './view-movie/view-movie.component';
import { LibraryRoutingModule } from './library-routing.module';
import { reducers } from './store';
import { LibraryEffects } from './store/library.effects';


@NgModule({
	imports: [
		CommonModule,
		SharedModule,
		LibraryRoutingModule,
		StoreModule.forFeature('library', reducers),
		EffectsModule.forFeature([LibraryEffects])
	],
	exports: [
		MovieLibraryComponent,
		/*
		AddMovieComponent,
		ViewMovieComponent,
		EditMovieComponent,
		MovieListComponent,
		MovieSearchResultsComponent
		*/
	],
	declarations: [
		AddMovieComponent,
		ViewMovieComponent,
		MovieLibraryComponent,
		EditMovieComponent,
		MovieListComponent,
		MovieSearchResultsComponent
	]
})
export class LibraryModule { }
