import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes, RouteReuseStrategy } from '@angular/router';
import { PageNotFoundComponent } from './modules/shared/components/page-not-found/page-not-found.component';
import { CustomRouteReuseStategy } from './app-router-reuse-strategy';

const routes: Routes = [{
	path: 'library',
	loadChildren: 'app/modules/library/library.module#LibraryModule',
	data: { shouldReuse: false }
}, {
	path: 'settings',
	loadChildren: 'app/modules/settings/settings.module#SettingsModule',
	data: { shouldReuse: false }
}, {
	path: '',
	redirectTo: '/library',
	pathMatch: 'full'
}, {
	path: '**',
	component: PageNotFoundComponent
}];

@NgModule({
	imports: [RouterModule.forRoot(routes, {
		useHash: true,
		preloadingStrategy: PreloadAllModules,
		enableTracing: false
	})],
	/* providers: [{ provide: RouteReuseStrategy, useClass: CustomRouteReuseStategy }], */
	exports: [RouterModule]
})
export class AppRoutingModule { }
