import { Component, OnInit } from '@angular/core';
import { Movie, MoviesService } from './movies.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'tigerapp';
  movies: Movie[];
  startRow = 0;
  lastKey;

  constructor(private moviesService: MoviesService) {}

  ngOnInit() {
    console.log('hi from onInit');
    this.movies = this.moviesService.getRows(this.startRow);
  }

  onNext() {
    this.startRow += 10;
    this.movies = this.moviesService.getRows(this.startRow);
  }

  onPrevious() {
    if (this.startRow >= 10) {
      this.startRow -= 10;
      this.movies = this.moviesService.getRows(this.startRow);
    }
  }

}
