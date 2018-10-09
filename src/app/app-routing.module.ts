import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { PageNotFoundComponent } from './modules/shared/page-not-found/page-not-found.component';

const routes: Routes = [{
	path: 'movies',
	loadChildren: 'app/modules/movies/movies.module#MoviesModule'
}, {
	path: 'settings',
	loadChildren: 'app/modules/settings/settings.module#SettingsModule',
}, {
	path: '',
	redirectTo: '/movies',
	pathMatch: 'full'
}, {
	path: '**',
	component: PageNotFoundComponent
}];

@NgModule({
	imports: [RouterModule.forRoot(routes, {
		preloadingStrategy: PreloadAllModules
	})],
	exports: [RouterModule]
})
export class AppRoutingModule { }
