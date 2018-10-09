import { Observable } from 'rxjs/Observable';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { distinctUntilChanged } from 'rxjs/operators';

/**
 * muteFirst is a helper that joins two levels of dependency together:
 * From the server to the store via 'first$', and from the store to the
 * component via 'second$'.
 * 
 * @param  {Observable<T>} first$ - server observable
 * @param  {Observable<R>} second$ - store observable
 */

export const muteFirst = <T, R>(first$: Observable<T>, second$: Observable<R>) =>
	combineLatest(first$, second$, (a, b) => b).pipe(distinctUntilChanged());
