import { of, Subscription } from 'rxjs';
import { ArtCollectionService } from './service/art-collection.service';
import {
  ArtCollectionData,
  ArtCollectionModel,
} from './model/art-collection.model';
import { TestBed, tick } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('AppComponent', () => {
  let component: AppComponent;
  let artCollectionService: ArtCollectionService;

  beforeAll(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AppComponent,
        {
          provide: ArtCollectionService,
          useValue: jasmine.createSpyObj('ArtCollectionService', [
            'onGetArtWorkList',
          ]),
        },
        {
          provide: Subscription,
          useValue: jasmine.createSpyObj('Subscription', ['add']),
        },
      ],
    });
    component = TestBed.inject(AppComponent);
    artCollectionService = TestBed.inject(ArtCollectionService);
  });

  describe('-> SetDropdownStylesFunction', () => {
    it('sets styles title dropdown based on art collection list [style_titles]', () => {
      component.artCollectionList = [
        { style_titles: ['style 1', 'style 2'] },
        { style_titles: ['style 3', 'style 4'] },
        { style_titles: ['style 1', 'style 5'] },
      ];
      component.onSetStylesTitle();
      expect(component.styleTitlesDropdown).toEqual([
        'style 1 (2)',
        'style 2 (1)',
        'style 3 (1)',
        'style 4 (1)',
        'style 5 (1)',
      ]);
    });
  });

  describe('-> FilterFunction', () => {
    it('Filters art collection list based on selected style titles', () => {
      component.artCollectionList = [
        { style_titles: ['style 1', 'style 2'] },
        { style_titles: ['style 3', 'style 4'] },
        { style_titles: ['style 5', 'style 6'] },
      ];
      component.selectedStylesTitle = ['style 2', 'style 4'];
      component.onFilterStylesTitle();
      expect(component.artCollectionListDisplay).toEqual([
        { style_titles: ['style 1', 'style 2'] },
        { style_titles: ['style 3', 'style 4'] },
      ] as ArtCollectionData[]);
    });

    it('Returns original art collection list if no items match', () => {
      component.artCollectionList = [
        { style_titles: ['style 1', 'style 2'] },
        { style_titles: ['style 3', 'style 4'] },
        { style_titles: ['style 5', 'style 6'] },
      ];
      component.selectedStylesTitle = ['style 7', 'style 8'];
      component.onFilterStylesTitle();
      expect(component.artCollectionListDisplay).toEqual(
        component.artCollectionList
      );
    });
  });

  describe('-> SortFunction', () => {
    it('sorts the art collection list display based on the selected sort title', () => {
      component.selectedSortTitle = 'price';
      component.artCollectionList = [
        { title: 'artwork 1' },
        { title: 'artwork 2' },
        { title: 'artwork 3' },
      ];
      component.artCollectionListDisplay = component.artCollectionList;
      component.onSortArtwork();
      expect(component.artCollectionListDisplay).toEqual([
        { title: 'artwork 1' },
        { title: 'artwork 2' },
        { title: 'artwork 3' },
      ] as ArtCollectionData[]);
    });
  });
});
