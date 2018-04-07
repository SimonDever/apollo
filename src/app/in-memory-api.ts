import { InMemoryDbService } from 'angular-in-memory-web-api';
import { Movie } from './models/movie';

export class InMemoryApi implements InMemoryDbService {
	createDb() {
		const movies = [{
			id: 1, title: 'Friday'
		}, {
			id: 2, title: 'Next Friday'
		}, {
			id: 3, title: 'Friday After Next'
		}];

		return { movies };
	}
}
