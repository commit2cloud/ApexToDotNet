// src/app/services/strategic-planner.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, forkJoin } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import {
  Project,
  ProjectDetail,
  Initiative,
  Release,
  Area,
  Activity,
  TeamMember,
  ProjectStatus,
  ProjectPriority,
  ActivityType,
  TaskType,
  NavigationCounts,
  ProjectGroup,
  PeopleGroup
} from '../models/strategic-planner.models';

@Injectable({
  providedIn: 'root'
})
export class StrategicPlannerService {
  private base = `${environment.apiUrl}/sp`;

  constructor(private http: HttpClient) {}

  // ─── Projects (/api/sp/SpProjects) ────────────────────────────
  getProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(`${this.base}/SpProjects`);
  }

  getProject(id: number): Observable<ProjectDetail> {
    return this.http.get<ProjectDetail>(`${this.base}/SpProjects/${id}`);
  }

  createProject(project: Partial<ProjectDetail>): Observable<ProjectDetail> {
    return this.http.post<ProjectDetail>(`${this.base}/SpProjects`, project);
  }

  updateProject(id: number, project: Partial<ProjectDetail>): Observable<void> {
    return this.http.put<void>(`${this.base}/SpProjects/${id}`, project);
  }

  deleteProject(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/SpProjects/${id}`);
  }

  // ─── Initiatives (/api/sp/Initiatives) ────────────────────────
  getInitiatives(): Observable<Initiative[]> {
    return this.http.get<Initiative[]>(`${this.base}/Initiatives`);
  }

  getInitiative(id: number): Observable<Initiative> {
    return this.http.get<Initiative>(`${this.base}/Initiatives/${id}`);
  }

  // ─── Areas (/api/sp/Areas) ────────────────────────────────────
  getAreas(): Observable<Area[]> {
    return this.http.get<Area[]>(`${this.base}/Areas`);
  }

  // ─── Releases (/api/sp/Releases) ─────────────────────────────
  getReleases(): Observable<Release[]> {
    return this.http.get<Release[]>(`${this.base}/Releases`);
  }

  // ─── Team Members (/api/sp/TeamMembers) ───────────────────────
  getTeamMembers(): Observable<TeamMember[]> {
    return this.http.get<TeamMember[]>(`${this.base}/TeamMembers`);
  }

  // ─── Activities (/api/sp/Activities) ──────────────────────────
  getActivities(): Observable<Activity[]> {
    return this.http.get<Activity[]>(`${this.base}/Activities`);
  }

  // ─── Lookups (/api/sp/Lookups) ────────────────────────────────
  getStatuses(): Observable<ProjectStatus[]> {
    return this.http.get<ProjectStatus[]>(`${this.base}/Lookups/statuses`);
  }

  getPriorities(): Observable<ProjectPriority[]> {
    return this.http.get<ProjectPriority[]>(`${this.base}/Lookups/priorities`);
  }

  getActivityTypes(): Observable<ActivityType[]> {
    return this.http.get<ActivityType[]>(`${this.base}/Lookups/activity-types`);
  }

  getTaskTypes(): Observable<TaskType[]> {
    return this.http.get<TaskType[]>(`${this.base}/Lookups/task-types`);
  }

  // ─── Project Groups (/api/sp/ProjectGroups) ──────────────────
  getProjectGroups(): Observable<ProjectGroup[]> {
    return this.http.get<ProjectGroup[]>(`${this.base}/ProjectGroups`);
  }

  // ─── People Groups (/api/sp/PeopleGroups) ────────────────────
  getPeopleGroups(): Observable<PeopleGroup[]> {
    return this.http.get<PeopleGroup[]>(`${this.base}/PeopleGroups`);
  }

  getPeopleGroup(id: number): Observable<PeopleGroup> {
    return this.http.get<PeopleGroup>(`${this.base}/PeopleGroups/${id}`);
  }

  // ─── Navigation counts (for dashboard) ────────────────────────
  getNavigationCounts(): Observable<NavigationCounts> {
    return forkJoin({
      projects: this.getProjects().pipe(catchError(() => of([]))),
      areas: this.getAreas().pipe(catchError(() => of([]))),
      initiatives: this.getInitiatives().pipe(catchError(() => of([]))),
      activities: this.getActivities().pipe(catchError(() => of([]))),
      people: this.getTeamMembers().pipe(catchError(() => of([]))),
      releases: this.getReleases().pipe(catchError(() => of([]))),
      projectGroups: this.getProjectGroups().pipe(catchError(() => of([]))),
      peopleGroups: this.getPeopleGroups().pipe(catchError(() => of([])))
    }).pipe(
      map(data => ({
        projects: data.projects.length,
        areas: data.areas.length,
        initiatives: data.initiatives.length,
        activities: data.activities.length,
        people: data.people.length,
        releases: data.releases.length,
        projectGroups: data.projectGroups.length,
        peopleGroups: data.peopleGroups.length
      }))
    );
  }
}
