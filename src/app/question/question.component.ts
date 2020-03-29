import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { QuestionService, Answer } from './question.service';

const idParamName = 'id';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss']
})
export class QuestionComponent implements OnInit {
  answers: Answer[] = [];
  loading = true;
  constructor(
    private route: ActivatedRoute,
    private questionService: QuestionService
  ) { }

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        map(params => +params.get(idParamName))
      )
      .subscribe(id => this.loadQuestion(id));
  }

  loadQuestion(id: number) {
    return this.questionService.getAnswers(id)
      .subscribe(answers => {
        this.answers = answers;
        this.loading = false;
      });
  }
}
