export interface Entry {
	id?: number;
	title?: string;
	poster_path?: string;
	type?: string;
	file?: string;
	files?: File[];
	overview?: string;
	cast?: string;
	year?: string;
	rated?: string;
	released?: string;
	runtime?: string;
	genre?: string;
	director?: string;
	writer?: string;
	actors?: string;
	language?: string;
	country?: string;
	awards?: string;
	metascore?: string;
	imdbRating?: string;
	imdbVotes?: string;
	imdbID?: string;
	[key: string]: any;
}
