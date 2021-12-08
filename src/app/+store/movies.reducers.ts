import { createFeatureSelector, createReducer, createSelector, on } from "@ngrx/store";
import { mapToMovies, Movie, StartKeyInterface } from "../movies.api";
import { setMoviesForwardAction, loadMoviesInitialAction, setMoviesInitialAction, setCurrentRowRequest, setInitialRowRequest } from "./movies.actions";

export interface StartKeys {
    firstRow: number;
    startKey: StartKeyInterface;
}

export interface MoviesState {
    movies: Movie[];
    startKeys: StartKeys[];
    currentQuery: any;
    firstVisibleRow: number;
    lastRow: number; // The very last row in the data
    currentLastRow: number;
}

const initialState: MoviesState = {
    firstVisibleRow: 0,
    currentLastRow: 0,
    lastRow: -1,
    currentQuery: null,
    startKeys: [],
    movies: [],
};

export const MOVIES_FEATURE_KEY = 'movies';

export const moviesReducer = createReducer(
    initialState,
    on(loadMoviesInitialAction, (state, action) => {
        const newState = {
            ...state,
            movies: [],
            startKeys: [],
            firstVisibleRow: 0,
            lastRow: -1,
            currentLastRow: 0,
            currentQuery: null,
        }
        return newState;
    }),
    on(setMoviesInitialAction, (state, action) => {
        const newState = {
            ...state,
            movies: action.payload.Items,
            currentQuery: action.search,
            firstVisibleRow: 0,
            currentLastRow: action.payload.Count - 1
        };
        const startKeys: StartKeys[] = [{
            firstRow: 0,
            startKey: {
                title: action.payload.Items[0].title,
                year: action.payload.Items[0].year.toString()
            }
        }
        ];

        // If this is not the last chunk then create the element for the next startkey
        if (!action.payload.last) {
            startKeys.push({
                firstRow: action.payload.Count,
                startKey: action.payload.LastEvaluatedKey

            });
        } else {
            newState.lastRow = action.payload.Count - 1;
        }
        newState.startKeys = startKeys;
        return newState;
    }),
    on(setMoviesForwardAction, (state, action) => {
        const newState = {
            ...state,
            movies: [...action.payload.Items],
        };
        // Get the startKey array and get the last startKey
        if (action.payload.last) {
            newState.lastRow = newState.currentLastRow + (action.payload.Count - 1);
            newState.currentLastRow = newState.lastRow;
        } else {
            // See if this startkey already exists, if not, add it
            const newStartKeys = JSON.parse(JSON.stringify(newState.startKeys)) as StartKeys[];
            const idx = newStartKeys.findIndex(x => x.startKey.title === action.payload.LastEvaluatedKey.title && x.startKey.year === action.payload.LastEvaluatedKey.year);
            if (idx === -1) {
                const nextKey: StartKeys = {
                    firstRow: newState.firstVisibleRow + action.payload.Count,
                    startKey: action.payload.LastEvaluatedKey
                }
                newStartKeys.push(nextKey);
                newState.startKeys = newStartKeys;
                newState.currentLastRow += action.payload.Count
            }
        }


        return newState;
    }),
    on(setInitialRowRequest, (state, action) => {
        const newState = {
            ...state,
            firstVisibleRow: action.payload.firstRequestedRow
        }
        return newState;
    }),
    on(setCurrentRowRequest, (state, action) => {
        const newState = {
            ...state,
            firstVisibleRow: action.payload.firstRequestedRow
        }
        return newState;
    })
);

export const getMoviesState = createFeatureSelector<MoviesState>('movies');

export const selectAll = createSelector(
    getMoviesState,
    (state: MoviesState) => state
);

// Just give me all movies in the store
export const selectAllMovies = createSelector(selectAll, (state) => {
    return mapToMovies(state.movies);
});

export const selectLatestQuery = createSelector(selectAll, (state) => state.currentQuery);
export const selectFirstVisibleRow = createSelector(selectAll, (state) => state.firstVisibleRow);
export const selectLastRow = createSelector(selectAll, (state) => state.lastRow);
export const selectNumberOfPages = createSelector(selectAll, (state) => state.startKeys.length);

