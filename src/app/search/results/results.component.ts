import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Result } from '../search.service';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss']
})
export class ResultsComponent implements OnInit {
  @Input() results: Result[];
  @Output() authorClick = new EventEmitter<number>();
  @Output() questionClick = new EventEmitter<Result>();
  @Output() tagClick = new EventEmitter<string>();
  displayedColumns: string[] = ['author', 'title', 'answers', 'tags'];
  constructor() { }

  ngOnInit(): void {
  }
}
