import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

export interface Result {
  author: string;
  title: string;
  answers: number;
  tags: string[];
}

const baseUrl = 'https://api.stackexchange.com/2.2';
const site = 'stackoverflow';
const filters = {
  search: '!5RBRwQ1ekWd8W*WwrkkqtYxyW'
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
          author: item.owner.display_name,
          title: item.title,
          answers: item.answer_count,
          tags: item.tags,
        })))
      );
  }
}
