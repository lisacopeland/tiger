import { createAction, props } from '@ngrx/store';
import { Movie, MovieResponse, StartKey } from '../movies.api';

// Entity
export const ENTITY_TYPE_MOVIE = 'movie';

export const loadMoviesAction = createAction(
    'Movies: Load All',
    props<{ search: Partial<Movie> }>()
);
export const setMoviesAction = createAction(
    'Movies: Set All',
    props<{ payload: MovieResponse }>()
);
export const setCurrentRows = createAction(
    'Movies: Set Rows',
    props<{ payload: { firstRow: number, lastRow: number }}>()
)