import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { filter } from 'rxjs/operators';
import { loadMoviesAction, setCurrentRows } from './+store/movies.actions';
import { selectCurrentMovies } from './+store/movies.reducers';
// import { MoviesService } from './movies.service';
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
  lastKey;

  constructor(public store: Store) {
    this.store.dispatch(setCurrentRows({ payload: { firstRow: this.startRow, lastRow: this.lastRow } }));
    this.store.dispatch(loadMoviesAction({ search: {} }));
    this.store
      .pipe(
        select(selectCurrentMovies),
        filter((bool) => !!bool)
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
    this.store.dispatch(setCurrentRows({ payload: { firstRow: this.startRow, lastRow: this.lastRow } }));
  }

  onPrevious() {
    if (this.startRow >= 10) {
      this.startRow -= 10;
      this.lastRow -= 10;
      this.store.dispatch(setCurrentRows({ payload: { firstRow: this.startRow, lastRow: this.lastRow } }));
    }
  }

}
