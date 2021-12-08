import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { filter, map } from 'rxjs/operators';
import { combineLatest } from 'rxjs';
import { loadMoviesInitialAction, setCurrentRowRequest, setInitialRowRequest } from './+store/movies.actions';
import { selectAllMovies, selectFirstVisibleRow, selectLastRow, selectNumberOfPages } from './+store/movies.reducers';
import { Movie } from './movies.api';

const PAGE_SIZE = 10;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'tigerapp';
  movies: Movie[];
  startRow = 0;
  lastRow = PAGE_SIZE;
  numberOfPages = 0;
  lastDataRow = -1;
  cangoback = false;
  cangoforward = true;
  searchYear = 0;

  constructor(public store: Store) {
    this.store.dispatch(setInitialRowRequest({ payload: { firstRequestedRow: 0 } }));
    this.store.dispatch(loadMoviesInitialAction({ search: {} }));
    this.store
      .pipe(
        select(selectAllMovies)
      )
      .subscribe((movies) => {
        this.movies = movies;
      });

    this.store
      .pipe(
        select(selectFirstVisibleRow)
      )
      .subscribe((firstRow) => {
        this.cangoback = (firstRow > 0);
      });

    this.store
      .pipe(
        select(selectLastRow)
      )
      .subscribe((lastRow) => {
        this.lastDataRow = lastRow;
        this.cangoforward = (this.lastDataRow === -1) || (this.lastRow < this.lastDataRow);
      });

    this.store
      .pipe(
        select(selectNumberOfPages)
      )
      .subscribe((numberOfPages) => {
        this.numberOfPages = numberOfPages;
      });

    }

  onNext($event) {
    this.startRow += PAGE_SIZE;
    if (this.lastDataRow === -1) {
      this.lastRow += PAGE_SIZE;
    } else {
      this.lastRow = ((this.lastRow + PAGE_SIZE) > this.lastDataRow) ? this.lastDataRow : this.lastRow + PAGE_SIZE;
    } 
    this.store.dispatch(setCurrentRowRequest({ payload: { firstRequestedRow: this.startRow } }));
  }

  onPrevious($event) {
    if (this.startRow >= PAGE_SIZE) {
      this.startRow -= PAGE_SIZE;
      this.lastRow -= PAGE_SIZE;
      this.store.dispatch(setCurrentRowRequest({ payload: { firstRequestedRow: this.startRow } }));
    } 
  }

  onGotoPage($event) {
    if ($event === 'first' || $event === 1) {
      this.startRow = 0;
    } else if ($event !== 'last') {
      this.startRow = (parseInt($event) - 1) * PAGE_SIZE
    }
    this.lastRow = this.startRow + PAGE_SIZE;
    this.store.dispatch(setCurrentRowRequest({ payload: { firstRequestedRow: this.startRow } }));
  }

  onSearchYear() {
    this.startRow = 0;
    this.lastRow = PAGE_SIZE;
    this.store.dispatch(setInitialRowRequest({ payload: { firstRequestedRow: this.startRow } }));
    this.store.dispatch(loadMoviesInitialAction({ search: { year: this.searchYear } }));
  }

}
