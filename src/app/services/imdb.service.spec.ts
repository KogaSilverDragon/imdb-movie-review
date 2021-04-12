import { TestBed } from '@angular/core/testing';

import { IMDBService } from './imdb.service';

describe('IMDBService', () => {
  let service: IMDBService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IMDBService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
