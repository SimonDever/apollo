import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from './modules/shared/shared.module';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

@NgModule({
	declarations: [
		AppComponent
	],
	imports: [
		CommonModule,
		BrowserModule,
		BrowserAnimationsModule,
		HttpClientModule,
		SharedModule.forRoot(),
		AppRoutingModule,
		StoreModule.forRoot({}),
		EffectsModule.forRoot([]),
		StoreDevtoolsModule.instrument({
			maxAge: 50
		})
	],
	providers: [
		{ provide: 'MOVIEDB_API_KEY', useValue: environment.MOVIEDB_API_KEY }
	],
	bootstrap: [AppComponent]
})
export class AppModule { }
