import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MovieResponse } from './movies.api';

@Injectable({
  providedIn: 'root'
})
export class MoviesService {

  constructor(private http: HttpClient) { }

  getMovies(nextCacheParams: any = null) {
    console.log('calling api with params ', nextCacheParams);
      let params = new HttpParams({ fromObject: nextCacheParams });
      return this.http.get<MovieResponse>('http://localhost:8081/movies', {params: params});
  }

  query(search: any = null, nextCacheParams: any = null): Observable<MovieResponse> {
    // for now, just return all emails for an account
    console.log('hi from query - nextCacheParams: ', nextCacheParams);
    let params = new HttpParams({ fromObject: search });
    if (nextCacheParams) {
      params = params.append('startKeyTitle', `${nextCacheParams.startKey.title}`);
      params = params.append('startKeyYear', `${nextCacheParams.startKey.year}`);
    }
    return this.http.get<MovieResponse>('http://localhost:8081/movies', { params: params });
  }

}
