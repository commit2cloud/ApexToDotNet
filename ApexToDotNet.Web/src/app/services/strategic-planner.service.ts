// src/app/services/strategic-planner.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
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

  constructor(private http: HttpClient) {}

  // Projects
  getProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(`${this.apiUrl}/projects`);
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
    return this.http.get<any>(`${this.apiUrl}/dashboard/counts`);
  }
}
