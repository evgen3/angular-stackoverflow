import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

import { interval, of } from 'rxjs';
import { debounce, map, tap, switchMap, distinctUntilChanged } from 'rxjs/operators';

import { SearchService, Result } from './search.service';
import { CellInfo } from './results/results.component';

const queryParamName = 'query';
const debouncePeriod = 1000;
const notFoundMessage = 'Not found';
const snackBarDuration = 2000;

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
  cellInfo: CellInfo;

  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private router: Router,
    private searchService: SearchService,
    private snackBar: MatSnackBar
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
        this.showNotFound();
      }
    });
  }

  showNotFound() {
    this.snackBar.open(notFoundMessage, null, {
      duration: snackBarDuration
    });
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

  onCellClick(cellInfo: CellInfo) {
    this.cellInfo = cellInfo;
  }
}
