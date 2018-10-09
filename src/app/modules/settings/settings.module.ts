import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { SettingsListComponent } from './settings-list/settings-list.component';
import { SettingsRoutingModule } from './settings-routing.module';
import { SettingsComponent } from './settings/settings.component';

@NgModule({
	imports: [
		CommonModule,
		SharedModule,
		SettingsRoutingModule
	],
	exports: [
		SettingsComponent,
		SettingsListComponent
	],
	declarations: [
		SettingsComponent,
		SettingsListComponent
	]
})
export class SettingsModule { }
