import { Component, OnInit, Inject } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';

export interface InfoData {
  authorId?: number;
  tag?: string;
}

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss']
})
export class InfoComponent implements OnInit {
  constructor(@Inject(MAT_BOTTOM_SHEET_DATA) public data: InfoData) { }

  ngOnInit(): void {
  }
}
