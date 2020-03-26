import { Component, OnInit, Input } from '@angular/core';
import { Result } from '../search.service';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss']
})
export class ResultsComponent implements OnInit {
  @Input() results: Result[];
  displayedColumns: string[] = ['author', 'title', 'answers', 'tags'];
  constructor() { }

  ngOnInit(): void {
  }
}
