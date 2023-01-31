import { ArtCollectionModel } from './../model/art-collection.model';
import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { ArtCollectionService } from './art-collection.service';
import { ArtCollectionData } from '../model/art-collection.model';

describe('ArtCollectionService', () => {
  let artCollectionService: ArtCollectionService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ArtCollectionService],
    });
    artCollectionService = TestBed.inject(ArtCollectionService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should make a GET request API', () => {
    const mockData: ArtCollectionModel = {
      data: [
        {
          id: 0,
          title: 'M',
          date_start: 1999,
          date_end: 3000,
          artist_display: 'MMM',
          place_of_origin: 'THAILAND',
          artist_title: 'MMM',
          artist_titles: ['MMM', 'EIEIEI'],
          style_id: null,
          style_title: null,
          style_titles: ['TEST', 'FAILED'],
          material_titles: ['MOUSE', 'KEYBOARD', 'MONITOR'],
          image_id: '',
        },
      ],
      pagination: {
        page: 0,
        total: 0,
        limit: 0,
        offset: 0,
        total_pages: 0,
        current_page: 0,
        next_url: '',
      },
      info: {
        license_text: '',
        license_links: ['', ''],
        version: '',
      },
      config: {
        iiif_url: '',
        website_url: '',
      },
    };

    artCollectionService
      .onGetArtWorkList()
      .subscribe((data) => expect(data).toEqual(mockData));

    const req = httpMock.expectOne('https://api.artic.edu/api/v1/artworks/');
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });

  afterAll(() => {
    httpMock.verify();
  });
});
