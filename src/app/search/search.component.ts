import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';

const queryParamName = 'query';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  searchForm = this.formBuilder.group({
    query: ''
  });

  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private router: Router
  ) { }

  ngOnInit(): void {
    const query = this.route.snapshot.queryParamMap.get(queryParamName) ?? '';
    this.searchForm.controls.query.setValue(query);
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
