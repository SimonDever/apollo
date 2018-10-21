import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { OcticonDirective } from './directives/octicon.directive';
import { MenuComponent } from './components/menu/menu.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { NavigationService } from './services/navigation.service';
import { SearchService } from './services/search.service';
import { StorageService } from './services/storage.service';
import { NgbCollapseModule } from './modules/ngb-collapse/ngb-collapse.module';

@NgModule({
	declarations: [
		MenuComponent,
		PageNotFoundComponent,
		OcticonDirective
	],
	imports: [
		/* Third party */
		CommonModule,
		RouterModule,
		FormsModule,
		ReactiveFormsModule,
		NgbModule,
		/* Custom */
		NgbCollapseModule.forRoot()
	],
	exports: [
		/* Third party */
		FormsModule,
		ReactiveFormsModule,
		NgbModule,
		/* Custom */
		NgbCollapseModule,
		OcticonDirective,
		MenuComponent,
		PageNotFoundComponent,
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
