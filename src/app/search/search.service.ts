import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

export interface Result {
  author: {
    name: string;
    id: number;
  };
  question: {
    title: string;
    id: number;
  };
  answers: number;
  tags: string[];
}

const baseUrl = 'https://api.stackexchange.com/2.2';
const site = 'stackoverflow';
const filters = {
  search: '!*7PYFiX04qF206j0aQZ)4CtQrFbC'
};
const paths = {
  search: '/search'
};

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  constructor(private http: HttpClient) { }

  getResults(query = '') {
    const url = `${baseUrl}${paths.search}`;
    const params = {
      intitle: query,
      filter: filters.search,
      site,
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
