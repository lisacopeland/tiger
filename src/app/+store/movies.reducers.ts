import { createFeatureSelector, createReducer, createSelector, on } from "@ngrx/store";
import { mapToMovies, Movie, StartKeyInterface } from "../movies.api";
import { setMoviesForwardAction, loadMoviesInitialAction, setMoviesInitialAction, setCurrentRowRequest, setInitialRowRequest } from "./movies.actions";

export interface StartKeys {
    firstRow: number;
    lastRow: number;
    startKey: StartKeyInterface;
}

export interface MoviesState {
    movies: Movie[];
    startKeys: StartKeys[];
    currentQuery: any;
    firstVisibleRow: number;
    lastVisibleRow: number;
    lastRow: number; // The very last row in the data
}

const initialState: MoviesState = {
    firstVisibleRow: 0,
    lastVisibleRow: 0,
    lastRow: -1,
    currentQuery: null,
    startKeys: [],
    movies: [],
};

export const MOVIES_FEATURE_KEY = 'movies';

export const moviesReducer = createReducer(
    initialState,
    on(loadMoviesInitialAction, (state, action) => {
        console.log('hi from load movies action');
        const newState = { ...state, 
            movies: [], 
            startKeys: [], 
            firstVisibleRow: 0, 
            lastVisibleRow: 0,
            lastRow: -1,
            currentQuery: null,
        }
        return newState;
    }),
    on(setMoviesInitialAction, (state, action) => {
        console.log('hi from setMoviesaction');
        const newState = {
            ...state,
            movies: action.payload.Items,
            currentQuery: action.search,
            firstVisibleRow: 0,
            lastVisibleRow: action.payload.Count,
        };
        const startKeys: StartKeys[] = [{
            firstRow: 0,
            lastRow: action.payload.Count,
            startKey: { title: action.payload.Items[0].title,
                        year: action.payload.Items[0].year.toString() }
            }
        ];
        if (action.payload.LastEvaluatedKey) {
            // The startkey you get back belongs to the next chunk
            startKeys.push({
                firstRow: action.payload.Count,
                lastRow: -1,
                startKey: action.payload.LastEvaluatedKey

            });
        } else {
            newState.lastRow = action.payload.Count;
        }
        newState.startKeys = startKeys;
        return newState;
    }),
    on(setInitialRowRequest, (state, action) => {
        const newState = { ...state };
        newState.firstVisibleRow = action.payload.firstRequestedRow;
        newState.lastVisibleRow = action.payload.lastRequestedRow;
        return newState;
    }),
    on(setMoviesForwardAction, (state, action) => {
        const newState = {
            ...state,
            movies: [...action.payload.Items],
        };
        // See if there is a startkey for this chunk
        const newStartKeys = JSON.parse(JSON.stringify(newState.startKeys));
        const startKey = newStartKeys.find(x => (x.firstRow === state.firstVisibleRow));
        const lastEvaluatedKey = action.payload.LastEvaluatedKey;
        if (lastEvaluatedKey === undefined) {
            newState.lastRow = startKey.firstVisibleRow + action.payload.Count;
            newState.lastVisibleRow = newState.lastRow;
        }
        // I don't see how I could not have a startKey unless I have problems
        if (startKey !== undefined) {
            if (startKey.lastRow === -1) {
                startKey.lastRow = startKey.firstRow + action.payload.Count;
                // Create the next key if this is the last chunk
                if (lastEvaluatedKey) {
                    const nextKey: StartKeys = {
                        firstRow: startKey.lastRow,
                        lastRow: -1,
                        startKey: action.payload.LastEvaluatedKey
                    }
                    newStartKeys.push(nextKey);
                } else {
                    newState.lastRow = state.lastRow + action.payload.Count;
                }
            newState.startKeys = newStartKeys;    
            }
        } 

        return newState;
    }),
    on(setCurrentRowRequest, (state, action) => {
        console.log('hi from setCurrentRowRequest, payload is ', action.payload);
        const newState = { ...state, 
            firstVisibleRow: action.payload.firstRequestedRow, 
            lastVisibleRow: action.payload.lastRequestedRow }
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
    console.log('hi from selectAllMovies');
    const retValue = mapToMovies(state.movies);
    console.log('returning ', retValue);
    return retValue;
});

export const selectLatestQuery = createSelector(selectAll, (state) => state.currentQuery);

export const selectFirstVisibleRow = createSelector(selectAll, (state) => state.firstVisibleRow);
export const selectLastVisibleRow = createSelector(selectAll, (state) => state.lastVisibleRow);
export const selectLastRow = createSelector(selectAll, (state) => state.lastRow);

export const selectCurrentVisibleRange = createSelector(
    selectFirstVisibleRow, selectLastVisibleRow, (first, last) => { return { first: first, last: last } });

