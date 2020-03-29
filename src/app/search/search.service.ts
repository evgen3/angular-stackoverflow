import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { ApiService } from '../shared/api.service';
import { Author } from '../shared/author';

export interface Result {
  author: Author;
  question: {
    title: string;
    id: number;
  };
  answers: number;
  tags: string[];
}

export interface SearchOptions {
  query?: string;
  tag?: string;
  author?: Author;
}

const filter = '!*7PYFiX04qF206j0aQZ)4CtQrFbC';
const path = '/search/advanced';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  constructor(
    private http: HttpClient,
    private apiService: ApiService
  ) { }

  getResults({ query, tag, author }: SearchOptions) {
    const { baseUrl, site } = this.apiService;
    const url = `${baseUrl}${path}`;
    const params = {
      title: query ?? '',
      tagged: tag ?? '',
      user: author?.id?.toString() ?? '',
      site,
      filter,
    };

    return this.http
      .get(url, { params })
      .pipe(
        map(({ items }: any): Result[] => items.map((item: any) => ({
          author: {
            name: item.owner.display_name,
            id: item.owner.user_id,
          },
          question: {
            id: item.question_id,
            title: item.title
          },
          answers: item.answer_count,
          tags: item.tags,
        } as Result)))
      );
  }
}
