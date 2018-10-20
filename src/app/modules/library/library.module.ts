import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { SharedModule } from '../shared/shared.module';
import { AddEntryComponent } from './components/add-entry/add-entry.component';
import { EditEntryComponent } from './components/edit-entry/edit-entry.component';
import { EntryListComponent } from './components/entry-list/entry-list.component';
import { LibraryRoutingModule } from './library-routing.module';
import { SearchResultsComponent } from './components/search-results/search-results.component';
import { reducers } from './store';
import { LibraryEffects } from './store/library.effects';
import { ViewEntryComponent } from './components/view-entry/view-entry.component';
import { LibraryComponent } from './components/library/library.component';


@NgModule({
	imports: [
		CommonModule,
		SharedModule,
		LibraryRoutingModule,
		StoreModule.forFeature('library', reducers),
		EffectsModule.forFeature([LibraryEffects])
	],
	exports: [
		LibraryComponent,
		ViewEntryComponent,
		EditEntryComponent,
		EntryListComponent,
		SearchResultsComponent
	],
	declarations: [
		AddEntryComponent,
		ViewEntryComponent,
		EditEntryComponent,
		EntryListComponent,
		SearchResultsComponent,
		LibraryComponent
	]
})
export class LibraryModule { }
