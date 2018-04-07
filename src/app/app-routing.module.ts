import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MoviesComponent } from './modules/movies/movies/movies.component';

const routes: Routes = [
	{ path: '', redirectTo: 'movies', pathMatch: 'full' },
	{ path: 'movies', loadChildren: 'app/modules/movies/movies.module#MoviesModule' }
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule { }
