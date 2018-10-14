import { InMemoryDbService } from 'angular-in-memory-web-api';

export class InMemoryApi implements InMemoryDbService {
	createDb() {
		const movies = [{
			id: 1, title: 'Friday', poster: './assets/images/poster-1-friday.jpg'
		}, {
			id: 2, title: 'Next Friday', poster: './assets/images/poster-2-next-friday.jpg'
		}, {
			id: 3, title: 'Friday After Next', poster: './assets/images/poster-3-friday-after-next.jpg'
		}, {
			id: 4, title: 'Shawshank Redemption', poster: './assets/images/poster-4.jpg'
		}, {
			id: 5, title: 'Primer', poster: './assets/images/poster-5.jpg'
		}, {
			id: 6, title: 'The Man from Earth', poster: './assets/images/poster-6.jpg'
		}, {
			id: 7, title: 'Boyz n the Hood', poster: './assets/images/poster-7.jpg'
		}, {
			id: 8, title: 'Spaceballs', poster: './assets/images/poster-8.jpg'
		}, {
			id: 9, title: 'Labrynth', poster: './assets/images/poster-9.jpg'
		}, {
			id: 10, title: 'Dark Crystal', poster: './assets/images/poster-10.jpg'
		}, {
			id: 11, title: 'Star Trek', poster: './assets/images/poster-11.jpg'
		}, {
			id: 12, title: 'Star Wars', poster: './assets/images/poster-12.jpg'
		}];

		return { movies };
	}
}
