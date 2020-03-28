import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { ApiService } from '../shared/api.service';

export interface Answer {
  body: string;
  rating: number;
}

const filter = '!w-*Ytm8Gt4I*adJsae';
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
        } as Answer)))
      );
  }
}
