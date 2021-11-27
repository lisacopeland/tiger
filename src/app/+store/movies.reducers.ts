import { createFeatureSelector, createReducer, createSelector, on } from "@ngrx/store";
import { mapToMovies, Movie, StartKey } from "../movies.api";
import { loadMoviesAction, setCurrentRows, setMoviesAction } from "./movies.actions";

export interface MoviesState {
    movies: Movie[];
    lastEvaluatedKey: StartKey;
    firstRow: number;
    lastRow: number;
}

const initialState: MoviesState = {
    firstRow: 0,
    lastRow: 0,
    lastEvaluatedKey: null,
    movies: [],
};

export const MOVIES_FEATURE_KEY = 'movies';

export const moviesReducer = createReducer(
    initialState,
    on(loadMoviesAction, (state, action) => {
        const newState = { ...state, movies: [] }
        return newState;
    }),
    on(setMoviesAction, (state, action) => {
        const newState = { ...state, movies: action.payload.Items }
        if (action.payload.LastEvaluatedKey) {
            newState.lastEvaluatedKey = action.payload.LastEvaluatedKey;
        };
        return newState;
    }),
    on(setCurrentRows, (state, action) => {
        const newState = { ...state, firstRow: action.payload.firstRow, lastRow: action.payload.lastRow}
        return newState;
    })
);
export const getMoviesState = createFeatureSelector<MoviesState>('movies');

export const selectAll = createSelector(
    getMoviesState,
    (state: MoviesState) => state
);

export const selectAllMovies = createSelector(selectAll, (state) =>
    mapToMovies(state.movies)
);
export const selectCurrentMovies = createSelector(selectAll, (state) =>
    state.movies.slice(state.firstRow, state.lastRow)
    );