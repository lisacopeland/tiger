import { createFeatureSelector, createReducer, createSelector, on } from "@ngrx/store";
import { mapToMovies, Movie, StartKeyInterface } from "../movies.api";
import { setMoviesForwardAction, loadMoviesAction, setMoviesAction, setCurrentRowRequest, setInitialRowRequest } from "./movies.actions";

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
    firstStoredRow: number;
    lastStoredRow:number;
}

const initialState: MoviesState = {
    firstVisibleRow: 0,
    lastVisibleRow: 0,
    firstStoredRow: 0,
    lastStoredRow: 0,
    currentQuery: null,
    startKeys: [],
    movies: [],
};

export const MOVIES_FEATURE_KEY = 'movies';

export const moviesReducer = createReducer(
    initialState,
    on(loadMoviesAction, (state, action) => {
        console.log('hi from load movies action');
        const newState = { ...state, movies: [], startKeys: [], firstStoredRow: 0, lastStoredRow: 0 }
        return newState;
    }),
    on (setMoviesAction, (state, action) => {
        console.log('hi from setMoviesaction');
        const newState = { ...state, 
            movies: action.payload.Items,
            currentQuery: action.search,
            firstStoredRow: 0,
            lastStoredRow: action.payload.Count,
            startKeys: [{
                firstRow: 0,
                lastRow: action.payload.Count,
                startKey: action.payload.LastEvaluatedKey
         }]
        };
        return newState;
    }),
    on(setInitialRowRequest, (state, action) => {
      const newState = {...state};
      newState.firstVisibleRow = action.payload.firstRequestedRow;
      newState.lastVisibleRow = action.payload.lastRequestedRow;
      return newState;
    }),
    on(setMoviesForwardAction, (state, action) => {
        const newState = {
            ...state,
            movies: [ ...state.movies, ...action.payload.Items],
            startKeys: [...state.startKeys, {
                firstRow: state.lastStoredRow,
                lastRow: state.lastStoredRow + action.payload.Count,
                startKey: action.payload.LastEvaluatedKey
            }],
            lastStoredRow: state.lastStoredRow + action.payload.Count,
        };
        return newState;
    }),
    on(setCurrentRowRequest, (state, action) => {
        const newState = { ...state, firstVisibleRow: action.payload.firstRequestedRow, lastVisibleRow: action.payload.lastRequestedRow}
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

export const selectFirstStoredRow = createSelector(selectAll, (state) => state.firstStoredRow);
export const selectLastStoredRow = createSelector(selectAll, (state) => state.lastStoredRow);

export const selectLatestQuery = createSelector(selectAll, (state) => state.currentQuery);

export const selectFirstVisibleRow = createSelector(selectAll, (state) => state.firstVisibleRow);
export const selectLastVisibleRow = createSelector(selectAll, (state) => state.lastVisibleRow);

export const selectCurrentVisibleRange = createSelector(
    selectFirstVisibleRow, selectLastVisibleRow, (first, last) => { return { first: first, last: last } });

// Give me the movies in the rows I requested
export const selectCurrentMovies = createSelector(
    selectAllMovies, selectCurrentVisibleRange, (movies: Movie[], range) => {
    if (movies) {
        return movies.slice(range.first, range.last);
    } else {
        return null;
    }
});

// Tell me what rows are in the store
export const selectCurrentStoredRange = createSelector(
    selectFirstStoredRow, selectLastStoredRow, (first, last) => { return {first: first, last: last} });

export const selectLastStartKey = createSelector(selectAll, (state) => { 
    return state.startKeys[length - 1] 
});
