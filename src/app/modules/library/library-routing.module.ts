import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddMovieComponent } from './add-movie/add-movie.component';
import { EditMovieComponent } from './edit-movie/edit-movie.component';
import { MovieLibraryComponent } from './movie-library/movie-library.component';
import { MovieListComponent } from './movie-list/movie-list.component';
import { MovieSearchResultsComponent } from './movie-search-results/movie-search-results.component';
import { ViewMovieComponent } from './view-movie/view-movie.component';


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
		component: ViewMovieComponent
	}, {
		path: 'edit',
		data: { title: 'Edit Movie' },
		component: EditMovieComponent
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
export class LibraryRoutingModule { }

