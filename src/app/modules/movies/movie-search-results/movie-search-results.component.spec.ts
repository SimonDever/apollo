import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MovieSearchResultsComponent } from './movie-search-results.component';

describe('MovieSearchResultsComponent', () => {
  let component: MovieSearchResultsComponent;
  let fixture: ComponentFixture<MovieSearchResultsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MovieSearchResultsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MovieSearchResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
