import { Routes } from '@angular/router';
import { ProjectListComponent } from './features/projects/project-list/project-list.component';
import { ProjectEditComponent } from './features/projects/project-edit/project-edit.component';
import { SessionListComponent } from './features/sessions/session-list/session-list.component';
import { SessionEditComponent } from './features/sessions/session-edit/session-edit.component';

export const routes: Routes = [
  { path: 'projects', component: ProjectListComponent },
  { path: 'projects/new', component: ProjectEditComponent },
  { path: 'projects/:id', component: ProjectEditComponent },
  { path: 'sessions', component: SessionListComponent },
  { path: 'sessions/new', component: SessionEditComponent },
  { path: 'sessions/:id', component: SessionEditComponent },
  { path: '', redirectTo: '/projects', pathMatch: 'full' }
];
