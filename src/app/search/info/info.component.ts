import { Component, OnInit, Inject, ChangeDetectorRef } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { Result, SearchService, SearchOptions } from '../search.service';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss']
})
export class InfoComponent implements OnInit {
  loading = true;
  results: Result[] = [];
  constructor(
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: SearchOptions,
    private searchService: SearchService,
    private changeDetectorRef: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.searchService.getResults({
      ...this.data,
      sort: 'votes'
    }).subscribe(results => {
      this.results = results;
      this.loading = false;
      this.changeDetectorRef.detectChanges();
    });
  }
}
