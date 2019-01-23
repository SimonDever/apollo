import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddEntryComponent } from './components/add-entry/add-entry.component';
import { EditEntryComponent } from './components/edit-entry/edit-entry.component';
import { EntryListComponent } from './components/entry-list/entry-list.component';
import { SearchResultsComponent } from './components/search-results/search-results.component';
import { ViewEntryComponent } from './components/view-entry/view-entry.component';
import { LibraryComponent } from './components/library/library.component';
import { MetadataComponent } from './components/metadata/metadata.component';

const routes: Routes = [{
	path: '',
	data: { title: 'Library' },
	component: LibraryComponent,
	children: [{
		path: '',
		data: { title: 'Entry List' },
		component: EntryListComponent
	}, {
		path: 'view',
		data: { title: 'View Entry' },
		component: ViewEntryComponent,
		children: [{
			path: 'metadata',
			data: { title: 'Metadata Search Results' },
			component: MetadataComponent
		}]
	}, {
		path: 'edit',
		data: { title: 'Edit Entry' },
		component: EditEntryComponent
	}, {
		path: 'search',
		data: { title: 'Search Results' },
		component: SearchResultsComponent
	}, {
		path: 'add',
		data: { title: 'Add Entry' },
		component: AddEntryComponent
	}]
}];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class LibraryRoutingModule { }

