import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddMovieComponent } from './add-movie/add-movie.component';
import { MovieEditComponent } from './movie-edit/movie-edit.component';
import { MovieLibraryComponent } from './movie-library/movie-library.component';
import { MovieListComponent } from './movie-list/movie-list.component';
import { MovieSearchResultsComponent } from './movie-search-results/movie-search-results.component';
import { MovieComponent } from './movie/movie.component';


const routes: Routes = [{
	path: '',
	data: { title: 'Movie Library' },
	component: MovieLibraryComponent,
	children: [{
		path: '',
		data: { title: 'Movie List' },
		component: MovieListComponent
	}, {
		path: 'view',
		data: { title: 'Movies' },
		component: MovieComponent
	}, {
		path: 'edit',
		data: { title: 'Edit Movie' },
		component: MovieEditComponent
	}, {
		path: 'search',
		data: { title: 'Search Results' },
		component: MovieSearchResultsComponent
	}, {
		path: 'add',
		data: { title: 'Add Movie' },
		component: AddMovieComponent
	}]
}];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class MoviesRoutingModule { }

