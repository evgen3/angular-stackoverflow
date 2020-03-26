import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { interval, of } from 'rxjs';
import { debounce, map, tap, switchMap, distinctUntilChanged } from 'rxjs/operators';
import { SearchService, Result } from './search.service';

const queryParamName = 'query';
const debouncePeriod = 1000;

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
    private searchService: SearchService
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
      this.results = results;
      this.searching = false;
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
}
