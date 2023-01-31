import { environment } from 'src/environments/environments';
import { ArtCollectionService } from './service/art-collection.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  debounceTime,
  distinctUntilChanged,
  Subject,
  Subscription,
  switchMap,
} from 'rxjs';
import {
  ArtCollectionConfig,
  ArtCollectionData,
  ArtCollectionModel,
  ArtCollectionParam,
  Pagination,
} from './model/art-collection.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit, OnDestroy {
  private subscription: Subscription = new Subscription();

  artCollectionList: any | ArtCollectionData[] = [];
  artCollectionListDisplay: ArtCollectionData[] = []; // * I created it to separate the data from the main list for the purpose of filtering.
  artCollectionList$ = new Subject<ArtCollectionParam>();
  artCollectionConfig!: ArtCollectionConfig;
  artCollectionPagination!: Pagination;

  onSetBaseImgUrl = environment.baseImgUrl;
  onSetPlaceholderImg = environment.placeholderImgUrl;

  styleTitlesDropdown: string[] = [];
  selectedStylesTitle: string[] = [];

  sortTitlesDropdown = [
    { label: `Artwork's Name`, value: 'title' },
    { label: `Artist's Name`, value: 'artist_title' },
    { label: 'Date', value: 'date_start' },
  ];
  selectedSortTitle!: any; // * I'm not sure what type is this.

  pageStart = 1;
  perPage = 12;
  isLoading = true;

  constructor(private artCollectionService: ArtCollectionService) {}

  ngOnInit(): void {
    this.subscribeArtWorkCollection();
    this.takeArtWorkCollection();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  subscribeArtWorkCollection(): void {
    this.subscription.add(
      this.artCollectionList$
        .pipe(
          distinctUntilChanged(),
          debounceTime(300),
          switchMap((params) =>
            this.artCollectionService.onGetArtWorkList(params)
          )
        )
        .subscribe({
          next: (response: ArtCollectionModel) => {
            this.artCollectionList = response.data;
            this.artCollectionListDisplay = response.data;
            this.artCollectionConfig = response.config;
            this.artCollectionPagination = response.pagination;
            this.onSetStylesTitle();
            if (this.selectedSortTitle) {
              this.onSortArtwork();
            }
            this.isLoading = false;
          },
          error: (err) => {
            console.error(err);
            this.isLoading = false;
          },
        })
    );
  }

  takeArtWorkCollection(): void {
    const params: ArtCollectionParam = {
      page: this.pageStart,
    };
    this.isLoading = true;
    this.artCollectionList$.next(params);
  }

  onSetStylesTitle(): void {
    const stylesArray = this.artCollectionList.reduce(
      (acc: ArtCollectionData[], curr: ArtCollectionData) => {
        return acc.concat(curr.style_titles as []);
      },
      []
    );
    const counts: { [key: string]: number } = {};
    stylesArray.forEach(
      (value: string) => (counts[value] = (counts[value] || 0) + 1)
    );
    for (const key in counts) {
      if (Object.prototype.hasOwnProperty.call(counts, key)) {
        const element = counts[key];
        this.styleTitlesDropdown.push(`${key} (${element})`);
      }
    }
  }

  onFilterStylesTitle(): void {
    this.artCollectionListDisplay = this.artCollectionList.filter(
      (style: ArtCollectionData) =>
        this.selectedStylesTitle.some((str: string) => {
          const numString = str;
          return style.style_titles.includes(
            str
              .replace(numString.match(/\(\d+\)/g)?.toString() || '', '')
              .trim()
          );
        })
    );
    if (!this.artCollectionListDisplay.length) {
      this.artCollectionListDisplay = this.artCollectionList;
    }
  }

  onSortArtwork() {
    this.artCollectionListDisplay = this.artCollectionList.sort(
      (a: { [x: string]: number }, b: { [x: string]: number }) => {
        if (a[this.selectedSortTitle] < b[this.selectedSortTitle]) {
          return -1;
        }
        if (a[this.selectedSortTitle] > b[this.selectedSortTitle]) {
          return 1;
        }
        return 0;
      }
    );
  }

  onSetStylesTitlePerPageChange(): void {
    this.selectedStylesTitle = [];
    this.styleTitlesDropdown = [];
  }

  prevPage(): void {
    this.pageStart--;
    this.onSetStylesTitlePerPageChange();
    this.takeArtWorkCollection();
  }

  nextPage(): void {
    this.pageStart++;
    this.onSetStylesTitlePerPageChange();
    this.takeArtWorkCollection();
  }

  goToPage(n: number): void {
    this.pageStart = n;
    this.onSetStylesTitlePerPageChange();
    this.takeArtWorkCollection();
  }

  onDisplayDateFlexible(
    startYear: number,
    endYear: number,
    location: string
  ): string {
    if (!startYear || !endYear) {
      return location;
    } else if (startYear === endYear) {
      return `${location} (${startYear})`;
    } else {
      return `${location} (${startYear} - ${endYear})`;
    }
  }
}

/** Copyright Allianz 2023 */
