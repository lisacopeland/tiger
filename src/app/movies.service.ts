import { HttpClient, HttpParams } from '@angular/common/http';
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

export interface StartKey {
  title: string;
  year: string;
}

export interface MovieResponse {
  Items: Movie[];
  Count: number;
  LastEvaluatedKey: StartKey;
}

export interface MovieCacheEntry {
  startKey: StartKey;
  startRow: number;
  length: number;
  movies: Movie[];
  endData: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class MoviesService {

  pageSize = 10;
  movieCache: MovieCacheEntry[] = [];
  lastEvaluatedKey: StartKey = null;
  lastRow = 0;

  constructor(private http: HttpClient) { }

  getRows(startRow: number) {
    let counter = 0;

    while (counter < this.movieCache.length) {
      if ((startRow >= this.movieCache[counter].startRow) && (startRow < this.movieCache[counter].startRow + this.movieCache[counter].length)) {
        // data is in this cache, return the data from this one
        // extract the data from startRow for 
        const startIndex = startRow - this.movieCache[counter].startRow;
        // What if there are not 10 left?
        return this.movieCache[counter].movies.slice(startIndex, startIndex + 10);
      }
      counter++;
    }
    // If you get here, you need to use the lastEvaluatedKey of the last cache to get
    // more
    this.getMovies(this.lastEvaluatedKey).subscribe(data => {
      const newCache: MovieCacheEntry = {
        startRow: this.lastRow,
        startKey: data.LastEvaluatedKey,
        length: data.Count,
        movies: data.Items,
        endData: (data.LastEvaluatedKey === undefined)
      };
      this.lastRow = this.lastRow + data.Count;
      this.lastEvaluatedKey = data.LastEvaluatedKey;
      const startIndex = startRow - newCache.startRow;
      this.movieCache.push(newCache);
      return newCache.movies.slice(startIndex, startIndex + 10);
    });

  }

  getMovies(nextCacheParams: any = null) {
      let params = new HttpParams({ fromObject: nextCacheParams });
      return this.http.get<MovieResponse>('http://localhost:8081/movies', {params: params});
  }
}
