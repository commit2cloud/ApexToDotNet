// src/app/services/strategic-planner.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, forkJoin } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { ProjectService } from './project.service';
import {
  Project,
  Initiative,
  Release,
  Area,
  Activity,
  Person,
  PersonGroup,
  ProjectGroup
} from '../models/strategic-planner.models';

@Injectable({
  providedIn: 'root'
})
export class StrategicPlannerService {
  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private projectService: ProjectService
  ) {}

  // Projects - use ProjectService which has mock fallback
  getProjects(): Observable<Project[]> {
    return this.projectService.getProjects();
  }

  getProject(id: number): Observable<Project> {
    return this.http.get<Project>(`${this.apiUrl}/projects/${id}`);
  }

  getRecentlyChangedProjects(limit: number = 10): Observable<Project[]> {
    return this.http.get<Project[]>(`${this.apiUrl}/projects/recent?limit=${limit}`);
  }

  searchProjects(query: string, options?: {limit?: number}): Observable<Project[]> {
    const limit = options?.limit || 50;
    return this.http.get<Project[]>(`${this.apiUrl}/projects/search?q=${encodeURIComponent(query)}&limit=${limit}`);
  }

  createProject(project: Partial<Project>): Observable<Project> {
    return this.http.post<Project>(`${this.apiUrl}/projects`, project);
  }

  updateProject(id: number, project: Partial<Project>): Observable<Project> {
    return this.http.put<Project>(`${this.apiUrl}/projects/${id}`, project);
  }

  deleteProject(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/projects/${id}`);
  }

  // Initiatives
  getInitiatives(): Observable<Initiative[]> {
    return this.http.get<Initiative[]>(`${this.apiUrl}/initiatives`);
  }

  getMyInitiatives(): Observable<Initiative[]> {
    return this.http.get<Initiative[]>(`${this.apiUrl}/initiatives/my`);
  }

  // Releases
  getReleases(): Observable<Release[]> {
    return this.http.get<Release[]>(`${this.apiUrl}/releases`);
  }

  getMyOpenReleases(): Observable<Release[]> {
    return this.http.get<Release[]>(`${this.apiUrl}/releases/my/open`);
  }

  // Areas
  getAreas(): Observable<Area[]> {
    return this.http.get<Area[]>(`${this.apiUrl}/areas`);
  }

  // Activities
  getActivities(): Observable<Activity[]> {
    return this.http.get<Activity[]>(`${this.apiUrl}/activities`);
  }

  // People
  getPeople(): Observable<Person[]> {
    return this.http.get<Person[]>(`${this.apiUrl}/people`);
  }

  // People Groups
  getPeopleGroups(): Observable<PersonGroup[]> {
    return this.http.get<PersonGroup[]>(`${this.apiUrl}/people-groups`);
  }

  // Project Groups
  getProjectGroups(): Observable<ProjectGroup[]> {
    return this.http.get<ProjectGroup[]>(`${this.apiUrl}/project-groups`);
  }

  // Navigation counts (for badges)
  getNavigationCounts(): Observable<any> {
    // Try API first, fallback to calculating from actual data
    return this.http.get<any>(`${this.apiUrl}/dashboard/counts`).pipe(
      catchError(() => {
        // If API fails, calculate counts from the actual endpoints
        return forkJoin({
          projects: this.getProjects().pipe(catchError(() => of([]))),
          areas: this.getAreas().pipe(catchError(() => of([]))),
          initiatives: this.getInitiatives().pipe(catchError(() => of([]))),
          activities: this.getActivities().pipe(catchError(() => of([]))),
          people: this.getPeople().pipe(catchError(() => of([]))),
          projectGroups: this.getProjectGroups().pipe(catchError(() => of([]))),
          personGroups: this.getPeopleGroups().pipe(catchError(() => of([]))),
          releases: this.getReleases().pipe(catchError(() => of([])))
        }).pipe(
          map(data => ({
            projects: data.projects.length,
            areas: data.areas.length,
            initiatives: data.initiatives.length,
            activities: data.activities.length,
            people: data.people.length,
            projectGroups: data.projectGroups.length,
            personGroups: data.personGroups.length,
            releases: data.releases.length
          }))
        );
      })
    );
  }
}
