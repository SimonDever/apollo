import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'filterHidden' })
export class FilterHiddenPipe implements PipeTransform {

	hiddenKeys = [
		' id', 'id', 'poster_path'
	];

	keyOrder: Array<string> = [
		'title', 'overview', 'genres', 'release date', 'runtime'
	]

	transform(map: Array<any>): Array<any> {

		console.debug('FilterHiddenPipe :: unhidden/unsorted:');
		console.debug(map);

		map = map.filter(function(item) {
			return !this.hiddenKeys.includes(item.key);
		}.bind(this));

		console.debug('FilterHiddenPipe :: hidden/unsorted:');
		console.debug(map);

		map.sort(function(a, b) {
			const orderableKeyA = this.keyOrder.some(el => el === a.key);
			const orderableKeyB = this.keyOrder.some(el => el === b.key);
			if(orderableKeyA) {
				if(orderableKeyB) {
					return this.keyOrder.indexOf(a.key) - this.keyOrder.indexOf(b.key);
				} else {
					return -1;
				}
			} else if(orderableKeyB) {
				return 1;
			} else {
				return 0;
			}
		}.bind(this));

		map.reverse();

		console.debug('FilterHiddenPipe :: hidden/sorted:');
		console.debug(map);

		return map;
	}
}
