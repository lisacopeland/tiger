import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { filter } from 'rxjs/operators';
import { loadMoviesAction, setCurrentRowRequest, setInitialRowRequest } from './+store/movies.actions';
import { selectAllMovies, selectCurrentMovies } from './+store/movies.reducers';
import { Movie } from './movies.api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'tigerapp';
  movies: Movie[];
  startRow = 0;
  lastRow = 10;

  constructor(public store: Store) {
    this.store.dispatch(setInitialRowRequest({ payload: { firstRequestedRow: this.startRow, lastRequestedRow: this.lastRow } }));
    this.store.dispatch(loadMoviesAction({ search: {} }));
    this.store
      .pipe(
        select(selectCurrentMovies)
      )
      .subscribe((movies) => {
        console.log('got movies: ', movies);
        this.movies = movies;
      });
  }

  ngOnInit() {
    console.log('hi from onInit');

  }

  onNext() {

    this.startRow += 10;
    this.lastRow += 10;
    console.log('hi from next button, range: ', this.startRow, ' ', this.lastRow);
    this.store.dispatch(setCurrentRowRequest({ payload: { firstRequestedRow: this.startRow, lastRequestedRow: this.lastRow } }));
  }

  onPrevious() {
    console.log('hi from previous');
    if (this.startRow >= 10) {
      this.startRow -= 10;
      this.lastRow -= 10;
      console.log('hi from prev button, range: ', this.startRow, ' ', this.lastRow);
      this.store.dispatch(setCurrentRowRequest({ payload: { firstRequestedRow: this.startRow, lastRequestedRow: this.lastRow } }));
    }
  }

}
