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

  artCollectionList: ArtCollectionData[] = [];
  artCollectionList$ = new Subject<ArtCollectionParam>();
  artCollectionConfig!: ArtCollectionConfig;
  artCollectionPagination!: Pagination;

  onSetBaseImgUrl = environment.baseImgUrl;
  onSetPlaceholderImg = environment.placeholderImgUrl;

  styleTitlesDropdown: string[] = [];
  selectedStylesTitle: string[] = [];

  pageStart = 1;
  perPage = 10;
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
            this.artCollectionConfig = response.config;
            this.artCollectionPagination = response.pagination;
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
}

/** Copyright Allianz 2023 */
