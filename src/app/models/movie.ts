export interface IMovie {
  id?: number | null;
  poster: string;
  title: string;
  overview?: string;
}

  export class Movie implements IMovie {
  id: number | null;
  poster: string;
  title: string;
  overview: string;

  constructor (movie: IMovie) {
    if (!movie) {
      this.id = null;
      this.poster = '';
      this.title = '';
      this.overview = '';
    } else {
      this.id = movie.id || null;
      this.poster = movie.poster || '';
      this.title = movie.title || '';
      this.overview = movie.overview || '';
    }
  }
}

export interface IMovieRating {
  id: number|null;
  scriptRating?: number;
  photoRating?: number;
  sfxRating?: number;
  castRating?: number;
}

export class MovieRating implements IMovieRating {
  id: number|null;
  scriptRating: number;
  photoRating: number;
  sfxRating: number;
  castRating: number;

  constructor (movie?: IMovieRating) {
    if (!movie) {
      this.id = null;
      this.scriptRating = 0;
      this.photoRating = 0;
      this.sfxRating = 0;
      this.castRating = 0;
    } else {
      this.id = movie.id || null;
      this.scriptRating = movie.scriptRating || 0;
      this.photoRating = movie.photoRating || 0;
      this.sfxRating = movie.sfxRating || 0;
      this.castRating = movie.castRating || 0;
    }
  }
}
