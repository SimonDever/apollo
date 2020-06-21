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
import { WindowRefService } from './services/window-ref.service';
import { NgxElectronModule } from 'ngx-electron';
import { DivValueAccessorDirective } from './directives/div-value-accessor.directive';
import { ToastComponent } from './components/toast/toast.component';
import { ToastService } from './services/toast.service';
import { LibraryService } from './services/library.service';

@NgModule({
	declarations: [
		MenuComponent,
		PageNotFoundComponent,
		DivValueAccessorDirective,
		OcticonDirective,
		ToastComponent
	],
	imports: [
		/* Third party */
		CommonModule,
		RouterModule,
		FormsModule,
		ReactiveFormsModule,
		NgbModule,
		NgxElectronModule,
		/* Custom */
		NgbCollapseModule
	],
	exports: [
		/* Third party */
		FormsModule,
		ReactiveFormsModule,
		NgbModule,
		NgxElectronModule,
		/* Custom */
		NgbCollapseModule,
		DivValueAccessorDirective,
		OcticonDirective,
		MenuComponent,
		PageNotFoundComponent,
		ToastComponent
	]
})
export class SharedModule {
	static forRoot(): ModuleWithProviders {
		return {
			ngModule: SharedModule,
			providers: [
				NavigationService,
				SearchService,
				StorageService,
				ToastService,
				LibraryService,
				WindowRefService
			]
		};
	}
}
