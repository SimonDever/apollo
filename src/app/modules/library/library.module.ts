import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { SharedModule } from '../shared/shared.module';
import { AddEntryComponent } from './components/add-entry/add-entry.component';
import { EditEntryComponent } from './components/edit-entry/edit-entry.component';
import { EntryListComponent } from './components/entry-list/entry-list.component';
import { LibraryComponent } from './components/library/library.component';
import { MetadataComponent } from './components/metadata/metadata.component';
import { SearchResultsComponent } from './components/search-results/search-results.component';
import { ViewEntryComponent } from './components/view-entry/view-entry.component';
import { LibraryRoutingModule } from './library-routing.module';
import { reducers } from './store';
import { LibraryEffects } from './store/library.effects';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { VirtualScrollerModule } from 'ngx-virtual-scroller';

@NgModule({
	imports: [
		CommonModule,
		SharedModule,
		VirtualScrollerModule,
		LibraryRoutingModule,
		StoreModule.forFeature('library', reducers),
		EffectsModule.forFeature([LibraryEffects])
	],
	exports: [
		LibraryComponent,
		AddEntryComponent,
		ViewEntryComponent,
		EditEntryComponent,
		EntryListComponent,
		SearchResultsComponent,
		MetadataComponent
	],
	declarations: [
		LibraryComponent,
		AddEntryComponent,
		ViewEntryComponent,
		EditEntryComponent,
		EntryListComponent,
		SearchResultsComponent,
		MetadataComponent
	],
	providers: [
		NgbModal
	]
})
export class LibraryModule { }
