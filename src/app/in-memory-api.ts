import { InMemoryDbService } from 'angular-in-memory-web-api';
import { Movie } from './modules/movies/movie';

export class InMemoryApi implements InMemoryDbService {
	createDb() {
		const movies = [{
			id: 1, title: 'Friday', poster: 'poster-1-friday.jpg'
		}, {
			id: 2, title: 'Next Friday', poster: 'poster-2-next-friday.jpg'
		}, {
			id: 3, title: 'Friday After Next', poster: 'poster-3-friday-after-next.jpg'
		}, {
			id: 4, title: 'Shawshank Redemption', poster: 'poster-4.jpg'
		}, {
			id: 5, title: 'Primer', poster: 'poster-5.jpg'
		}, {
			id: 6, title: 'The Man from Earth', poster: 'poster-6.jpg'
		}, {
			id: 7, title: 'Boyz n the Hood', poster: 'poster-7.jpg'
		}, {
			id: 8, title: 'Spaceballs', poster: 'poster-8.jpg'
		}, {
			id: 9, title: 'Labrynth', poster: 'poster-9.jpg'
		}, {
			id: 10, title: 'Dark Crystal', poster: 'poster-10.jpg'
		}, {
			id: 11, title: 'Star Trek', poster: 'poster-11.jpg'
		}, {
			id: 12, title: 'Star Wars', poster: 'poster-12.jpg'
		}];

		return { movies };
	}
}
