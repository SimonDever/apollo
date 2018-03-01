import { Component } from '@angular/core';

import { StorageService } from './storage.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  someProperty = '';

  constructor(private StorageService:StorageService) {

  }

  ngOnInit() {}

}
