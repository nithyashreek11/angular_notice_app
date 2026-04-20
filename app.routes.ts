import { Routes } from '@angular/router';
import { NoticeListComponent } from './components/notice-list/app';
import { NoticeFormComponent } from './components/notice-form/app';

export const routes: Routes = [
  { path: '', component: NoticeListComponent },
  { path: 'add', component: NoticeFormComponent },
  { path: 'edit/:id', component: NoticeFormComponent },
  { path: '**', redirectTo: '' }
];