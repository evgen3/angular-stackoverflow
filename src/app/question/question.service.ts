import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { ApiService } from '../shared/api.service';
import { Author } from '../shared/author';

export interface Answer {
  body: string;
  rating: number;
  author: Author;
  creationDate: Date;
}

const filter = '!YOL.*dAz12*Y0tx_wDls4E9vjL';
const sort = 'votes';
const getPath = (id: number) => `/questions/${id}/answers`;

@Injectable({
  providedIn: 'root'
})
export class QuestionService {
  constructor(
    private http: HttpClient,
    private apiService: ApiService
  ) { }

  getAnswers(id: number) {
    const { baseUrl, site } = this.apiService;
    const url = `${baseUrl}${getPath(id)}`;
    const params = { site, filter, sort };

    return this.http
      .get(url, { params })
      .pipe(
        map(({ items }: any): Answer[] => items.map((item: any) => ({
          body: item.body,
          rating: item.up_vote_count,
          author: {
            name: item.owner.display_name
          },
          creationDate: new Date(item.creation_date * 1000)
        } as Answer)))
      );
  }
}
