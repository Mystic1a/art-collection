import { ArtCollectionModel } from './../model/art-collection.model';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { ApiService } from 'src/custom/api/api.service';

@Injectable({
  providedIn: 'root',
})
export class ArtCollectionService {
  private readonly artCollectionUrl = '/artworks/';

  constructor(private apiService: ApiService) {}

  onGetArtWorkList(params?: {
    [page: number]: number;
  }): Observable<ArtCollectionModel> {
    return this.apiService.get<ArtCollectionModel>(
      this.artCollectionUrl,
      params
    );
  }
}
