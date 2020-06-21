import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from './modules/shared/shared.module';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { ConfigService } from './modules/shared/services/config.service';

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
		{
			provide: APP_INITIALIZER, deps: [ConfigService], multi: true,
			useFactory: (configService: ConfigService) => () => configService.load()
		}
	],
	bootstrap: [AppComponent]
})
export class AppModule { }
