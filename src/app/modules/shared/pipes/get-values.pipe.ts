import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'getValues' })
export class GetValuesPipe implements PipeTransform {

	excludes: Array<string> = [
		'id', '_id', 'poster_path'
	]

	keyOrder: Array<string> = [
		'title', 'overview', 'genres', 'release date', 'runtime'
	]

	transform(map: Map<any, any>): any[] {
		const ret = [];

		// ret = map.map(this.cleanAndConvert)

		if(map.entries) {
			Array.from(map.entries()).forEach(
				entry => this.cleanAndConvert(entry, ret)
			);
		} else {
			for (let entry of Array.from(Object.entries(map))) {
				this.cleanAndConvert(entry, ret)
			}
		}

		this.sort(ret);

		return ret;
	}
	
	cleanAndConvert(entry, ret) {
		if(this.excludes.indexOf(entry[0]) === -1) {
			entry[0] = entry[0].replace(/_/g, ' ');
			ret.push({key: entry[0], value: entry[1]});
		}
	}
	
	sort(ret) {
		ret.sort(function(a, b) {
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

		ret.reverse();
	}
}
