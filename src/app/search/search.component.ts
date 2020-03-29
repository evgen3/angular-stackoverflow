import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatBottomSheet } from '@angular/material/bottom-sheet';

import { of } from 'rxjs';
import { map, switchMap, distinctUntilChanged, debounceTime } from 'rxjs/operators';

import { Author } from '../shared/author';
import { SearchService, Result, SearchOptions } from './search.service';
import { InfoComponent } from './info/info.component';

const queryParamName = 'query';
const debouncePeriod = 1000;
const snackBarDuration = 2000;

const notFoundMessage = 'Not found';
const noAnswersMessage = 'No answers';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  results: Result[] = [];
  searching = false;
  searchForm = this.formBuilder.group({
    query: ''
  });

  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private router: Router,
    private searchService: SearchService,
    private snackBar: MatSnackBar,
    private bottomSheet: MatBottomSheet
  ) { }

  ngOnInit(): void {
    this.route.queryParamMap.pipe(
      map(params => params.get(queryParamName) ?? '')
    ).subscribe(query => {
      this.searchForm.controls.query.setValue(query);
      this.search(query);
    });
  }

  search(query: string) {
    this.results = [];
    this.searching = true;

    of(query).pipe(
      switchMap(() => {
        if (query === this.searchService.cachedQuery) {
          return of(this.searchService.cachedResults);
        }

        if (query) {
          return of(query).pipe(
            debounceTime(debouncePeriod),
            distinctUntilChanged(),
            switchMap(() => this.searchService.getResults({ query }))
          );
        }

        return of([]);
      })
    ).subscribe(results => {
      this.searchService.setCached(query, results);
      this.results = results;
      this.searching = false;

      if (query && !results.length) {
        this.showSnackBar(notFoundMessage);
      }
    });
  }

  showSnackBar(message: string) {
    this.snackBar.open(message, null, {
      duration: snackBarDuration
    });
  }

  showInfo(data: SearchOptions) {
    this.bottomSheet.open(InfoComponent, { data });
  }

  onSubmit() {
    const query = this.searchForm.controls.query.value;
    const queryParams = {
      [queryParamName]: query,
    };

    this.router.navigate([], {
      queryParams: query ? queryParams : {},
    });
  }

  onAuthorClick(author: Author) {
    this.showInfo({ author });
  }

  onQuestionClick({ answers, question }: Result) {
    if (answers) {
      this.router.navigate(['/questions', question.id]);
    } else {
      this.showSnackBar(noAnswersMessage);
    }
  }

  onTagClick(tag: string) {
    this.showInfo({ tag });
  }
}
