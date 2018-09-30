import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BackButtonComponent } from './back-button/back-button.component';
import { MenuComponent } from './menu/menu.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OcticonDirective } from './octicon.directive';

@NgModule({
  declarations: [
		BackButtonComponent,
		MenuComponent,
		OcticonDirective
	],
  imports: [
    CommonModule,
		FormsModule,
		ReactiveFormsModule
	],
	exports: [
		BackButtonComponent,
		MenuComponent,
		FormsModule,
		ReactiveFormsModule,
		OcticonDirective
	]
})
export class SharedModule { }
