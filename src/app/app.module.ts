import { MenuComponent } from './modules/movies/menu/menu.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';

import { MovieEffects } from './redux/effects/movie.effects';
import { movieReducer } from './redux/reducers/movie.reducer';
import { AppComponent } from './app.component';
import { SearchService } from './search.service';
import { StorageService } from './storage.service';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { InMemoryApi } from './in-memory-api';
import { CommonModule } from '@angular/common';
import { MovieSearchResultsComponent } from './modules/movies/movie-search-results/movie-search-results.component';
import { MovieListComponent } from './modules/movies/movie-list/movie-list.component';
import { MovieEditComponent } from './modules/movies/movie-edit/movie-edit.component';
import { MovieComponent } from './modules/movies/movie/movie.component';
import { BackButtonComponent } from './modules/movies/back-button/back-button.component';

@NgModule({
	declarations: [
		AppComponent,
		MenuComponent,
		MovieListComponent,
		MovieEditComponent,
		MovieSearchResultsComponent,
		MovieComponent,
		BackButtonComponent
	],
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		BrowserModule,
		AppRoutingModule,
		HttpClientModule,
		HttpClientInMemoryWebApiModule.forRoot(
			InMemoryApi, { dataEncapsulation: false }
		),
		StoreModule.forRoot({
			movieState: movieReducer
		}),
		EffectsModule.forRoot([
			MovieEffects
		]),
		StoreDevtoolsModule.instrument({
			maxAge: 25
		})
	],
	providers: [
		SearchService,
		StorageService,
		{ provide: 'MOVIEDB_API_KEY', useValue: environment.MOVIEDB_API_KEY }
	],
	bootstrap: [AppComponent]
})
export class AppModule { }
