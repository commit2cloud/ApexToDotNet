import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { ProjectListComponent } from './features/projects/project-list/project-list.component';
import { ProjectDetailComponent } from './features/projects/project-detail/project-detail.component';
import { ProjectEditComponent } from './features/projects/project-edit/project-edit.component';
import { AreasComponent } from './features/areas/areas.component';
import { InitiativesComponent } from './features/initiatives/initiatives.component';
import { ActivitiesComponent } from './features/activities/activities.component';
import { PeopleComponent } from './features/people/people.component';
import { SessionListComponent } from './features/sessions/session-list/session-list.component';
import { SessionEditComponent } from './features/sessions/session-edit/session-edit.component';
import { CalendarViewComponent } from './features/sessions/calendar-view/calendar-view.component';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'projects', component: ProjectListComponent },
  { path: 'projects/new', component: ProjectEditComponent },
  { path: 'projects/:id/edit', component: ProjectEditComponent },
  { path: 'projects/:id', component: ProjectDetailComponent },
  { path: 'areas', component: AreasComponent },
  { path: 'initiatives', component: InitiativesComponent },
  { path: 'activities', component: ActivitiesComponent },
  { path: 'people', component: PeopleComponent },
  { path: 'sessions', component: SessionListComponent },
  { path: 'sessions/new', component: SessionEditComponent },
  { path: 'sessions/:id', component: SessionEditComponent },
  { path: 'calendar', component: CalendarViewComponent }
];
