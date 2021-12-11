import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { filter, map } from 'rxjs/operators';
import { combineLatest } from 'rxjs';
import { loadMoviesInitialAction, setCurrentRowRequest, setInitialRowRequest } from './+store/movies.actions';
import { selectAllMovies, selectCurrentLastRow, selectFirstVisibleRow, selectLastDbRow, selectNumberOfPages } from './+store/movies.reducers';
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
  startRow = 0;         // The currently visible first row
  lastRow = PAGE_SIZE;  // The currently visible last row
  pageSize = PAGE_SIZE; // Number of rows per page
  numberOfPages = 0;    // The current number of pages (Grows until the last available data is found)
  lastDbRow = -1;     // The absolutely last row of data from the database
  currentLastRow = 0;
  currentTotalRows = 0;
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
        select(selectLastDbRow)
      )
      .subscribe((lastRow: number) => {
        this.lastDbRow = lastRow;
        this.cangoforward = (this.lastDbRow === -1) || (this.lastRow < this.lastDbRow);
      });

    this.store
      .pipe(
        select(selectCurrentLastRow)
      )
      .subscribe((lastRow) => {
        // Use currentLastRow & lastDbRow to calculate currentTotalRows for the
        // paginator, since we don't know the total rows until we stop getting
        // start keys, I'm faking it
        // Selector returns the currently visible last row
        console.log('selectCurrentLastRow returned ', lastRow);
        if (this.lastDbRow !== -1) {
          this.currentTotalRows = this.lastDbRow;
        } else {
          if (lastRow >= this.currentTotalRows) {
            this.currentTotalRows = lastRow + 10;
          }
        }
        console.log('current Total rows is ', this.currentTotalRows);
      });

    this.store
      .pipe(
        select(selectNumberOfPages)
      )
      .subscribe((numberOfPages) => {
        this.numberOfPages = numberOfPages;
      });

    }

    onPageChange($event): void {
      console.log('got a page change ', $event);
      this.onGotoPage($event.page);
    }

/*   onNext($event): void {
    this.startRow += PAGE_SIZE;
    if (this.lastDbRow === -1) {
      this.lastRow += PAGE_SIZE;
    } else {
      this.lastRow = ((this.lastRow + PAGE_SIZE) > this.lastDbRow) ? this.lastDbRow : this.lastRow + PAGE_SIZE;
    }
    this.store.dispatch(setCurrentRowRequest({ payload: { firstRequestedRow: this.startRow } }));
  } */

/*   onPrevious($event): void {
    if (this.startRow >= PAGE_SIZE) {
      this.startRow -= PAGE_SIZE;
      this.lastRow -= PAGE_SIZE;
      this.store.dispatch(setCurrentRowRequest({ payload: { firstRequestedRow: this.startRow } }));
    }
  } */

  onGotoPage(page: number): void {
/*     if ($event === 'first' || $event === 1) {
      this.startRow = 0;
    } else if ($event !== 'last') {
      this.startRow = (parseInt($event, 10) - 1) * PAGE_SIZE;
    }
    this.lastRow = this.startRow + PAGE_SIZE;
    
 */
    this.startRow = (page === 0) ? 0 : page * PAGE_SIZE;
    this.lastRow = this.startRow + PAGE_SIZE;
    console.log('hi from gotoPage start and last :', this.startRow + ' ' + this.lastRow);
    this.store.dispatch(setCurrentRowRequest({ payload: { firstRequestedRow: this.startRow } }));
  }

  onSearchYear(): void {
    this.startRow = 0;
    this.lastRow = PAGE_SIZE;
    this.store.dispatch(setInitialRowRequest({ payload: { firstRequestedRow: this.startRow } }));
    this.store.dispatch(loadMoviesInitialAction({ search: { year: this.searchYear } }));
  }

}
