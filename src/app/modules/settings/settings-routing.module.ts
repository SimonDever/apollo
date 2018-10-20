import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SettingsListComponent } from './components/settings-list/settings-list.component';
import { SettingsComponent } from './components/settings/settings.component';


const routes: Routes = [{
	path: '',
	data: { title: 'Settings' },
	component: SettingsComponent,
	children: [{
		path: '',
		data: { title: 'Settings List' },
		component: SettingsListComponent
	}]
}];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class SettingsRoutingModule { }

