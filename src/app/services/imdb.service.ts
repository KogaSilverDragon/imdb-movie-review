import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {map} from "rxjs/operators";
import {environment} from "../../environments/environment";
import {Movie, MovieRating} from "../models/movie";
import {ImdbMovie, ImdbResponse} from "../models/imdb";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class IMDBService {
  private URL_BASE: string = 'https://api.themoviedb.org/3';
  private IMAGE_URL_BASE: string = 'https://image.tmdb.org/t/p/';

  constructor(private http: HttpClient) { }

  searchMovies (name: string, page: number = 1): Observable<{ movies: Movie[], pages: number }> {
    let params = new HttpParams()
      .set('api_key', environment.IMDB_API_KEY)
      .set('page', page.toString(10))
      .set('query', name);

    return this.http.get<ImdbResponse>(
      `${this.URL_BASE}/search/movie`,
      { params: params }
    ).pipe(map((result: ImdbResponse) => {
        return {
          movies: result.results.map(movie => new Movie({
            id: movie.id,
            title: movie.title,
            overview: movie.overview,
            poster: movie.poster_path ? `${this.IMAGE_URL_BASE}/w400${movie.poster_path}` : ''
          })),
          pages: result.total_pages
        }
      }
    ));
  }

  getMovie (id: string): Observable<{ movie: Movie, rating: MovieRating }> {
    let params = new HttpParams()
      .set('api_key', environment.IMDB_API_KEY);

    return this.http.get<ImdbMovie>(
      `${this.URL_BASE}/movie/${id}`,
      { params: params }
    ).pipe(map(movie => {

      return {
        movie: new Movie({
          id: movie.id,
          title: movie.title,
          overview: movie.overview,
          poster: movie.poster_path ? `${this.IMAGE_URL_BASE}/w400${movie.poster_path}` : ''
        }),
        rating: new MovieRating(this.getRating(movie.id) || { id: movie.id })
      };
    }));
  }

  private getRatings(): MovieRating[] {
    let ratings: string|null = sessionStorage.getItem('userRatings') || null;
    return ratings ? JSON.parse(ratings) : [];
  }

  private getRating(id: number): MovieRating|undefined {
    let ratings = this.getRatings();
    return ratings.length ? ratings.find(rating => rating.id === id) : undefined;
  }

  setRating(id: number, rating: MovieRating): void {
    let ratings: MovieRating[] = this.getRatings();
    let ratingIndex: number = ratings.findIndex(rating => rating.id === id);
    if (ratingIndex !== -1) {
      ratings[ratingIndex] = { ...rating }
    } else {
      ratings.push({ ...rating })
    }
    sessionStorage.setItem('userRatings', JSON.stringify(ratings));
  }

}
