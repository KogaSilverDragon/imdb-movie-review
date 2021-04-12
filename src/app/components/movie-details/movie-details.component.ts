import { Component, OnInit } from '@angular/core';
import {Movie, MovieRating} from "../../models/movie";
import {IMDBService} from "../../services/imdb.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-movie-details',
  templateUrl: './movie-details.component.html',
  styleUrls: ['./movie-details.component.scss']
})
export class MovieDetailsComponent implements OnInit {
  movie: Movie|null = null;
  rating: MovieRating|null = null;

  constructor(private route: ActivatedRoute,
              private imdbService: IMDBService) { }

  ngOnInit(): void {
    this.fetchData();
  }

  async fetchData(): Promise<void> {
    const { movie, rating } = await this.imdbService.getMovie(this.route.snapshot.paramMap.get('id')!).toPromise();
    this.movie = movie;
    this.rating = rating;
  }

  updateRating(type: 'scriptRating'|'photoRating'|'sfxRating'|'castRating', rate: number): void {
    this.rating![type] = rate;
    this.imdbService.setRating(this.movie!.id!, { ...this.rating! });
  }

}
