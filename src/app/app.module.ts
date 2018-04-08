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
import { MoviesRoutingModule } from './modules/movies/movies-routing.module';
import { CommonModule } from '@angular/common';

@NgModule({
	declarations: [
		AppComponent,
		MenuComponent
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
