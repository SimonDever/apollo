import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MoviesRoutingModule } from './modules/movies/movies-routing.module';

const routes: Routes = [
	{ path: '', redirectTo: 'movies', pathMatch: 'full' },
	{ path: '**', redirectTo: 'movies', pathMatch: 'full' }
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule, MoviesRoutingModule]
})
export class AppRoutingModule { }
