import { MenuComponent } from './modules/shared/menu/menu.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';

import { MovieEffects } from './modules/movies/movie.effects';
import { movieReducer } from './modules/movies/movie.reducer';

import { AppComponent } from './app.component';

import { SearchService } from './search.service';
import { StorageService } from './storage.service';

import { environment } from '../environments/environment';

import { AppRoutingModule } from './app-routing.module';

import { OcticonDirective } from './modules/shared/octicon.directive';

import { InMemoryApi } from './in-memory-api';

import { MoviesModule } from './modules/movies/movies.module';
import { SettingsModule } from './modules/settings/settings.module';
import { SharedModule } from './modules/shared/shared.module';

@NgModule({
	declarations: [
		AppComponent
	],
	imports: [
		CommonModule,
		BrowserModule,
		MoviesModule,
		SettingsModule,
		SharedModule,
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
	exports: [
	],
	providers: [
		SearchService,
		StorageService,
		{ provide: 'MOVIEDB_API_KEY', useValue: environment.MOVIEDB_API_KEY }
	],
	bootstrap: [AppComponent]
})
export class AppModule { }
