import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { MovieBoxComponent } from './movie-box/movie-box.component';
import { MenuComponent } from './menu/menu.component';

import { SearchService } from './search.service';
import { StorageService } from './storage.service';
import { environment } from '../environments/environment';

@NgModule({
  declarations: [
    AppComponent,
    MovieBoxComponent,
    MenuComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [
    SearchService,
    StorageService,
    { provide: 'MOVIEDB_API_KEY', useValue: environment.MOVIEDB_API_KEY }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
