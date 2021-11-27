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

  constructor(private moviesService: MoviesService) {}

  ngOnInit() {
    console.log('hi from onInit');
    this.moviesService.getMovies().subscribe(data => {
      console.log('got data', data);
      this.movies = data;
    })
  }

}
