import { TestBed } from '@angular/core/testing';

import { ArtCollectionService } from './art-collection.service';

describe('ArtCollectionService', () => {
  let service: ArtCollectionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ArtCollectionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
