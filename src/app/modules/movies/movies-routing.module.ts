import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MoviesComponent } from './movies/movies.component';
import { MovieComponent } from './movie/movie.component';
import { MovieEditComponent } from './movie-edit/movie-edit.component';
import { MovieListComponent } from './movie-list/movie-list.component';
import { MovieSearchResultsComponent } from './movie-search-results/movie-search-results.component';

const routes: Routes = [
	{
		path: '', component: MoviesComponent,
		children: [
			{ path: 'h/:id', component: MovieComponent },
			{ path: 'movie/:id', component: MovieEditComponent }
		]
	},
	{ path: 's/:title', component: MovieSearchResultsComponent }
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class MoviesRoutingModule { }
