import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { SearchComponent } from './search/search.component';
import { QuestionComponent } from './question/question.component';

const routes: Routes = [
  { path: '', component: SearchComponent },
  { path: 'auth', component: AuthComponent },
  { path: 'questions/:id', component: QuestionComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
