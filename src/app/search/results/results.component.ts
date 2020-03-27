import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Result } from '../search.service';

export interface CellInfo {
  type: 'question' | 'author' | 'tag';
  id: string | number;
}

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss']
})
export class ResultsComponent implements OnInit {
  @Input() results: Result[];
  @Output() cellClick = new EventEmitter<CellInfo>();
  displayedColumns: string[] = ['author', 'title', 'answers', 'tags'];
  constructor() { }

  ngOnInit(): void {
  }

  onAuthorClick(id: number) {
    this.cellClick.emit({
      type: 'author',
      id,
    });
  }

  onTagClick(id: string) {
    this.cellClick.emit({
      type: 'tag',
      id,
    });
  }

  onQuestionClick(id: number) {
    this.cellClick.emit({
      type: 'question',
      id,
    });
  }
}
