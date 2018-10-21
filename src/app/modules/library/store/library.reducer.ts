import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Entry } from "./entry.model";
import * as LibraryActions from './library.actions';

export interface State extends EntityState<Entry> { }

export const adapter: EntityAdapter<Entry> = createEntityAdapter<Entry>()

export const initialState: State = adapter.getInitialState({});

export function reducer(state = initialState, action: LibraryActions.All): State {
	switch (action.type) {

		case LibraryActions.LOADED: {
			return adapter.addAll(action.payload.entries, state);
		}

		case LibraryActions.UPDATE_ENTRY: {
			return adapter.updateOne(action.payload.entry, state);
		}

		case LibraryActions.ADD_ENTRY: {
			return adapter.addOne(action.payload.entry, state);
		}

		case LibraryActions.REMOVE_ENTRY: {
			return adapter.removeOne(action.payload.id, state);
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
