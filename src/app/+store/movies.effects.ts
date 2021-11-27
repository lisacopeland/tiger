import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { map, mergeMap } from 'rxjs/operators';
import { Store } from "@ngrx/store";
import { MoviesService } from "../movies.service";
import { loadMoviesAction, setMoviesAction } from "./movies.actions";

@Injectable()
export class MoviesEffects {
    concurrentRequests = 5;

    loadMovies$ = createEffect(() =>
        this.actions$.pipe(
            ofType(loadMoviesAction),
            mergeMap((action) => {
                return this.service.query(action.search).pipe(
                    map((response) => {
                        return setMoviesAction({ payload: response });
                    })
                );
            }, this.concurrentRequests)
        )
    );

    constructor(
        private store: Store,
        public service: MoviesService,
        public actions$: Actions
    ) { }

}