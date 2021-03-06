import { createAction, props } from '@ngrx/store';
import { Movie, MovieResponse, StartKeyInterface } from '../movies.api';

// Entity
export const ENTITY_TYPE_MOVIE = 'movie';

export const loadMoviesInitialAction = createAction(
    'Movies: Load Initial',
    props<{ search: Partial<Movie> }>()
);
export const loadMoviesForwardAction = createAction(
    'Movies: Load Movies Forward',
    props<{ search: Partial<Movie>, startKey: StartKeyInterface }>()
);
export const setMoviesInitialAction = createAction(
    'Movies: Set Movies initial',
    props<{ payload: MovieResponse, search:any }>()
);
export const setMoviesForwardAction = createAction(
    'Movies: Set Movies Forward',
    props<{ payload: MovieResponse }>()
);

// This is the component telling the store which rows it wants
export const setInitialRowRequest = createAction(
    'Movies: Set initial Row Request',
    props<{ payload: { firstRequestedRow: number } }>()
)

// This is the component telling the store which rows it wants
export const setCurrentRowRequest = createAction(
    'Movies: Set Current Row Request',
    props<{ payload: { firstRequestedRow: number }}>()
)
