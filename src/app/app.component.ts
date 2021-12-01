import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { filter, map } from 'rxjs/operators';
import { combineLatest } from 'rxjs';
import { loadMoviesInitialAction, setCurrentRowRequest, setInitialRowRequest } from './+store/movies.actions';
import { selectAllMovies, selectCurrentVisibleRange, selectLastRow } from './+store/movies.reducers';
import { Movie } from './movies.api';

const PAGE_SIZE = 10;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'tigerapp';
  movies: Movie[];
  startRow = 0;
  lastRow = PAGE_SIZE;
  lastDataRow = -1;
  cangoback = false;
  cangoforward = true;
  searchYear = 0;

  constructor(public store: Store) {
    this.store.dispatch(setInitialRowRequest({ payload: { firstRequestedRow: this.startRow, lastRequestedRow: this.lastRow } }));
    this.store.dispatch(loadMoviesInitialAction({ search: {} }));
    this.store
      .pipe(
        select(selectAllMovies)
      )
      .subscribe((movies) => {
        console.log('got movies: ', movies);
        this.movies = movies;
      });

    this.store
      .pipe(
        select(selectCurrentVisibleRange)
      )
      .subscribe((range) => {
        console.log('hi from selectCurrentVisibleRange, range ', range);
        this.cangoback = (range.first > 0);
      });

    this.store
      .pipe(
        select(selectLastRow)
      )
      .subscribe((lastRow) => {
        this.lastDataRow = lastRow;
        this.cangoforward = (this.lastDataRow === -1) || (this.lastRow < this.lastDataRow);
        console.log('can go forward is ', this.cangoforward);
      });
    }

  ngOnInit() {
    console.log('hi from onInit');
  }

  onNext() {
    this.startRow += PAGE_SIZE;
    if (this.lastDataRow === -1) {
      this.lastRow += PAGE_SIZE;
    } else {
      this.lastRow = ((this.lastRow + PAGE_SIZE) > this.lastDataRow) ? this.lastDataRow : this.lastRow + PAGE_SIZE;
    } 
    console.log('hi from next button, range: ', this.startRow, ' ', this.lastRow);
    this.store.dispatch(setCurrentRowRequest({ payload: { firstRequestedRow: this.startRow, lastRequestedRow: this.lastRow } }));
  }

  onPrevious() {
    console.log('hi from previous');
    if (this.startRow >= PAGE_SIZE) {
      this.startRow -= PAGE_SIZE;
      this.lastRow -= PAGE_SIZE;
      console.log('hi from prev button, range: ', this.startRow, ' ', this.lastRow);
      this.store.dispatch(setCurrentRowRequest({ payload: { firstRequestedRow: this.startRow, lastRequestedRow: this.lastRow } }));
    } 
  }

  onSearchYear() {
    this.startRow = 0;
    this.lastRow = PAGE_SIZE;
    this.store.dispatch(setInitialRowRequest({ payload: { firstRequestedRow: this.startRow, lastRequestedRow: this.lastRow } }));
    this.store.dispatch(loadMoviesInitialAction({ search: { year: this.searchYear } }));
  }

}
