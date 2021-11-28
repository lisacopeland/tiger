import { createAction, props } from '@ngrx/store';
import { Movie, MovieResponse, StartKeyInterface } from '../movies.api';

// Entity
export const ENTITY_TYPE_MOVIE = 'movie';

export const loadMoviesAction = createAction(
    'Movies: Load All',
    props<{ search: Partial<Movie> }>()
);
export const loadMoviesForwardAction = createAction(
    'Movies: Load All',
    props<{ search: Partial<Movie>, startKey: StartKeyInterface }>()
);
export const setMoviesAction = createAction(
    'Movies: Set All',
    props<{ payload: MovieResponse, search:any }>()
);
export const setMoviesForwardAction = createAction(
    'Movies: Add Movies Forward',
    props<{ payload: MovieResponse }>()
);

export const setInitialRowRequest = createAction(
    'Movies: Set Rows',
    props<{ payload: { firstRequestedRow: number, lastRequestedRow: number } }>()
);

// This is the component telling the store which rows it wants
export const setCurrentRowRequest = createAction(
    'Movies: Set Rows',
    props<{ payload: { firstRequestedRow: number, lastRequestedRow: number }}>()
)

export const rowsInMemory = createAction(
    'Movies: Everything in memory',
    props<{ payload: {} }>()
)