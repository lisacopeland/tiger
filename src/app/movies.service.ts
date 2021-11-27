import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Movie, MovieCacheEntry, MovieResponse, StartKey } from './movies.api';

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
    console.log('calling api with params ', nextCacheParams);
      let params = new HttpParams({ fromObject: nextCacheParams });
      return this.http.get<MovieResponse>('http://localhost:8081/movies', {params: params});
  }

  query(search: any = null, nextCacheParams: any = null): Observable<MovieResponse> {
    // for now, just return all emails for an account
    let params = new HttpParams({ fromObject: search });
    if (nextCacheParams) {
      params = params.append('title', `${nextCacheParams.title}`);
      params = params.append('year', `${nextCacheParams.year}`);
    }
    return this.http.get<MovieResponse>('http://localhost:8081/movies', { params: params });
  }

}
