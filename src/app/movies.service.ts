import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

export interface MovieInfo {
  actors: string[];
  release_date: Date;
  plot: string;
  genres: string[];
  image_url: string;
  directors: string[];
  rating: number;
  rank: number;
  running_time_secs: number;
}

export interface Movie {
  title: string;
  year: number;
  info: MovieInfo;
}

export interface MovieResponse {
  items: Movie[];
}

@Injectable({
  providedIn: 'root'
})
export class MoviesService {

  constructor(private http: HttpClient) { }

  getMovies(year: string = '') {
      return this.http.get<Movie[]>('http://localhost:8081/movies')
  }
}
