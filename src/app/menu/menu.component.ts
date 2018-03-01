import { Component, OnInit } from '@angular/core';
import { SearchService } from '../search.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  constructor(private searchService: SearchService) {}

  ngOnInit() {}

  search(event) {
    event.preventDefault();
    console.debug('MenuComponent :: search method entry');
    this.searchService.search();
  }
  
}
