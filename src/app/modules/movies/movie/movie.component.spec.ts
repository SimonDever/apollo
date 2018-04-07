import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MovieComponent } from './movie.component';

describe('MovieBoxComponent', () => {
	let component: MovieComponent;
	let fixture: ComponentFixture<MovieComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [MovieComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(MovieComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should be created', () => {
		expect(component).toBeTruthy();
	});
});
