import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Movie } from '../../movies/movie';
import * as LibraryActions from '../../movies/redux/movie.actions';
import { StorageService } from '../services/storage.service';

@Component({
	selector: 'app-menu',
	templateUrl: './menu.component.html',
	styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

	@Input('title')
	title: string;

	searchForm: FormGroup;

	constructor(private formBuilder: FormBuilder,
		private router: Router,
		private route: ActivatedRoute,
		private storageService: StorageService) { }

	ngOnInit() {
		this.searchForm = this.formBuilder.group({ title: '' });
	}

	search(movies: Movie[], searchTerms: string) {
		this.storageService.searchMovie(this.searchForm.value.title)
			.map(movies => new LibraryActions.ShowResults({
				results: movies,
				searchTerms: searchTerms
			}));
	}

	showMovieList() {
		this.router.navigate(['/movies']);
	}

	showSettings() {
		this.router.navigate(['/settings']);
	}

	addMovie() {
		this.router.navigate(['/movies/add']);
	}
}
