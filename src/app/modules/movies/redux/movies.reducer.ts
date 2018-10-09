import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Movie } from "../movie";
import * as LibraryActions from './library.actions';

export interface State extends EntityState<Movie> { }

export const adapter: EntityAdapter<Movie> = createEntityAdapter<Movie>()

export const initialState: State = adapter.getInitialState({});

export function reducer(state = initialState, action: LibraryActions.LibraryActions): State {
	switch (action.type) {

		case LibraryActions.LOADED: {
			return adapter.addAll(action.payload.movies, state);
		}

		case LibraryActions.UPDATE_MOVIE: {
			return adapter.updateOne(action.payload.movie, state);
		}

		case LibraryActions.ADD_MOVIE: {
			return adapter.addOne(action.payload.movie, state);
		}

		default: {
			return state;
		}
	}
}

export const {
	selectIds,
	selectEntities,
	selectAll,
	selectTotal
} = adapter.getSelectors();
