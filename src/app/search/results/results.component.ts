import { Component, OnInit, Input } from '@angular/core';

export interface Question {
  author: string;
  title: string;
  answers: number;
  tags: string[];
}

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss']
})
export class ResultsComponent implements OnInit {
  @Input() questions: Question[];
  displayedColumns: string[] = ['author', 'title', 'answers', 'tags'];
  constructor() { }

  ngOnInit(): void {
  }
}
