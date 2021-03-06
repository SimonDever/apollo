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
	data: { title: 'Library', shouldReuse: false },
	component: LibraryComponent,
	children: [{
		path: '',
		data: { title: 'Entry List', shouldReuse: false },
		component: EntryListComponent
	}, {
		path: 'view',
		data: { title: 'View Entry', shouldReuse: false },
		component: ViewEntryComponent,
		children: [{
			path: 'metadata',
			data: { title: 'Metadata Search Results', shouldReuse: false },
			component: MetadataComponent
		}]
	}, {
		path: 'edit',
		data: { title: 'Edit Entry', shouldReuse: false },
		component: EditEntryComponent,
		children: [{
			path: 'metadata',
			data: { title: 'Metadata Search Results', shouldReuse: false },
			component: MetadataComponent
		}]
	}, {
		path: 'search',
		data: { title: 'Search Results', shouldReuse: false },
		component: SearchResultsComponent
	}, {
		path: 'add',
		data: { title: 'Add Entry', shouldReuse: false },
		component: AddEntryComponent,
		children: [{
			path: 'metadata',
			data: { title: 'Metadata Search Results', shouldReuse: false },
			component: MetadataComponent
		}]
	}]
}];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class LibraryRoutingModule { }

