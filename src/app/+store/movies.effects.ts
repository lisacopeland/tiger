import { Injectable } from "@angular/core";
import { Actions, concatLatestFrom, createEffect, ofType } from "@ngrx/effects";
import { concatMap, map, mergeMap, withLatestFrom } from 'rxjs/operators';
import { select, Store } from "@ngrx/store";
import { MoviesService } from "../movies.service";
import { loadMoviesInitialAction, setCurrentRowRequest, setMoviesInitialAction, setMoviesForwardAction } from "./movies.actions";
import { of, EMPTY } from "rxjs";
import { selectAll } from "./movies.reducers";

@Injectable()
export class MoviesEffects {
    concurrentRequests = 5;

    // For starting a brand new query
    loadMovies$ = createEffect(() =>
        this.actions$.pipe(
            ofType(loadMoviesInitialAction),
            mergeMap((action) => {
                return this.service.query(action.search).pipe(
                    map((response) => {
                        return setMoviesInitialAction({ payload: response, search: action.search });
                    })
                );
            }, this.concurrentRequests)
        )
    );

    loadMoviesRequest$ = createEffect(() =>
        this.actions$.pipe(
            ofType(setCurrentRowRequest),
            concatLatestFrom(() => this.store.select(selectAll)),
            mergeMap(([action, state]) => {
                // If the rowRequest is after the currently stored rows, issue a query with
                // the key from the last request
                // See if I have a key for the requested chunk
                const startRequestRow = action.payload.firstRequestedRow;
                let requestKey = state.startKeys.find(x => x.firstRow === startRequestRow);
                if (requestKey) {
                    return this.service.query(state.currentQuery, requestKey).pipe(
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