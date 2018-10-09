import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { BackButtonComponent } from './back-button/back-button.component';
import { MenuComponent } from './menu/menu.component';
import { OcticonDirective } from './octicon.directive';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { NavigationService } from './services/navigation.service';
import { SearchService } from './services/search.service';
import { StorageService } from './services/storage.service';

@NgModule({
	declarations: [
		BackButtonComponent,
		MenuComponent,
		PageNotFoundComponent,
		OcticonDirective
	],
	imports: [
		CommonModule,
		RouterModule,
		FormsModule,
		ReactiveFormsModule
	],
	exports: [
		BackButtonComponent,
		MenuComponent,
		PageNotFoundComponent,
		FormsModule,
		ReactiveFormsModule,
		OcticonDirective
	]
})
export class SharedModule {
	static forRoot(): ModuleWithProviders {
		return {
			ngModule: SharedModule,
			providers: [
				NavigationService,
				StorageService,
				SearchService
			]
		}
	}
}
