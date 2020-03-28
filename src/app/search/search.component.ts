import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatBottomSheet } from '@angular/material/bottom-sheet';

import { interval, of } from 'rxjs';
import { debounce, map, tap, switchMap, distinctUntilChanged } from 'rxjs/operators';

import { SearchService, Result } from './search.service';
import { InfoComponent, InfoData } from './info/info.component';

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
    const query$ = this.route.queryParamMap.pipe(
      map(params => params.get(queryParamName) ?? '')
    );

    query$.subscribe(query => {
      this.searchForm.controls.query.setValue(query);
    });

    query$.pipe(
      tap(() => {
        this.results = [];
        this.searching = true;
      }),
      debounce(query => interval(query ? debouncePeriod : 0)),
      distinctUntilChanged(),
      switchMap(query => (query ? this.searchService.getResults(query) : of([])))
    )
    .subscribe(results => {
      const query = this.searchForm.controls.query.value;

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

  showInfo(data: InfoData) {
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

  onAuthorClick(id: number) {
    this.showInfo({
      authorId: id
    });
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
