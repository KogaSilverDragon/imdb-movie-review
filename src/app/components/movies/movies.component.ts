import {Component, OnDestroy, OnInit} from '@angular/core';
import {IMDBService} from "../../services/imdb.service";
import {Movie} from "../../models/movie";
import {Subject, Subscription} from "rxjs";
import {debounceTime, distinctUntilChanged, mergeMap} from "rxjs/operators";

@Component({
  selector: 'app-movies',
  templateUrl: './movies.component.html',
  styleUrls: ['./movies.component.scss']
})
export class MoviesComponent implements OnInit, OnDestroy {
  private searchSubject: Subject<string> = new Subject<string>();
  private searchSubscription!: Subscription;

  searchString: string = '';
  movies: Movie[] = [];
  page: number = 1;
  pages: number = 1;

  constructor(private imdbService: IMDBService) { }

  ngOnInit(): void {
    this.searchSubscription = this.searchSubject.pipe(
      debounceTime(1000),
    ).subscribe(async search => {
      if (search !== this.searchString) {
        this.page = 1;
        sessionStorage.setItem('page', '1');
      }
      const { movies, pages } = await this.imdbService.searchMovies(search, this.page).toPromise();
      this.movies = movies;
      this.pages = pages;
    });
    this.searchString = sessionStorage.getItem('lastSearch') || '';
    this.page = parseInt(sessionStorage.getItem('page') || '1', 10);
    if (!!this.searchString) { this.search(); }
  }

  ngOnDestroy(): void {
    this.searchSubscription.unsubscribe();
  }

  search(): void {
    if (this.searchString.length < 3) { return; }
    this.searchSubject.next(this.searchString);
    sessionStorage.setItem('lastSearch', this.searchString);
    sessionStorage.setItem('page', this.page.toString(10));
  }

  goToPage(page: number): void {
    this.page = page;
    this.search();
  }

  prevPage(): void {
    this.goToPage(this.page === 1 ? 1 : this.page - 1)
  }

  nextPage(): void {
    this.goToPage(this.page === this.pages ? this.pages : this.page + 1)
  }

}
