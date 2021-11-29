import { Injectable } from "@angular/core";
import { Actions, concatLatestFrom, createEffect, ofType } from "@ngrx/effects";
import { concatMap, map, mergeMap, withLatestFrom } from 'rxjs/operators';
import { select, Store } from "@ngrx/store";
import { MoviesService } from "../movies.service";
import { loadMoviesAction, setCurrentRowRequest, setMoviesAction, setMoviesForwardAction } from "./movies.actions";
import { of, EMPTY } from "rxjs";
import { selectAll } from "./movies.reducers";

@Injectable()
export class MoviesEffects {
    concurrentRequests = 5;

    // For starting a brand new query
    loadMovies$ = createEffect(() =>
        this.actions$.pipe(
            ofType(loadMoviesAction),
            mergeMap((action) => {
                return this.service.query(action.search).pipe(
                    map((response) => {
                        return setMoviesAction({ payload: response, search: action.search });
                    })
                );
            }, this.concurrentRequests)
        )
    );

    loadMoviesNext$ = createEffect(() =>
        this.actions$.pipe(
            ofType(setCurrentRowRequest),
            concatLatestFrom(() => this.store.select(selectAll)),
            mergeMap(([action, state]) => {
                // IF the rowRequest is after the currently stored rows, issue a query with
                // the key from the last request
                if (action.payload.lastRequestedRow > state.lastStoredRow) {
                    console.log('rows are not in store! ')
                    const nextStartKey = [...state.startKeys].pop();
                    return this.service.query(state.currentQuery, nextStartKey).pipe(
                        map((response) => {
                            return setMoviesForwardAction({ payload: response });
                        })
                    ); 
                } else if (action.payload.firstRequestedRow < state.firstStoredRow) {
                    // Find the startkey for the section before the one you're in
                    const firstRow = action.payload.firstRequestedRow;
                    const lastRow = action.payload.lastRequestedRow;
                    const nextStartKey = state.startKeys.find(key => {
                        return ((key.firstRow >= firstRow) && (key.lastRow <= lastRow))
                    });
                    return this.service.query(state.currentQuery, nextStartKey).pipe(
                        map((response) => {
                            return setMoviesForwardAction({ payload: response });
                        })
                    );
                } else {
                    return EMPTY;
                }
            }, this.concurrentRequests)
        )
    );


    constructor(
        private store: Store,
        public service: MoviesService,
        public actions$: Actions
    ) { }

}