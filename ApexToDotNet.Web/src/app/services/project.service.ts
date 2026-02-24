import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Project } from '../models/project';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private apiUrl = `${environment.apiUrl}/projects`;
  
  // In-memory storage for demo purposes
  private mockProjects: Project[] = [];
  private nextId = 1;

  constructor(private http: HttpClient) { }

  getProjects(): Observable<Project[]> {
    // Try API first, fallback to mock data
    return this.http.get<Project[]>(this.apiUrl).pipe(
      catchError(error => {
        console.warn('API unavailable, using mock data', error);
        return of(this.mockProjects);
      })
    );
  }

  getProject(id: number): Observable<Project> {
    // Try API first, fallback to mock data
    return this.http.get<Project>(`${this.apiUrl}/${id}`).pipe(
      catchError(error => {
        console.warn('API unavailable, using mock data', error);
        const project = this.mockProjects.find(p => p.id === id);
        return project ? of(project) : throwError(() => new Error('Project not found'));
      })
    );
  }

  createProject(project: Project): Observable<Project> {
    // Try API first, fallback to mock storage
    return this.http.post<Project>(this.apiUrl, project).pipe(
      catchError(error => {
        console.warn('API unavailable, saving to mock storage', error);
        const newProject = { ...project, id: this.nextId++ };
        this.mockProjects.push(newProject);
        return of(newProject);
      })
    );
  }

  updateProject(id: number, project: Project): Observable<void> {
    // Try API first, fallback to mock storage
    return this.http.put<void>(`${this.apiUrl}/${id}`, project).pipe(
      catchError(error => {
        console.warn('API unavailable, updating mock storage', error);
        const index = this.mockProjects.findIndex(p => p.id === id);
        if (index !== -1) {
          this.mockProjects[index] = project;
          return of(undefined);
        }
        return throwError(() => new Error('Project not found'));
      })
    );
  }

  deleteProject(id: number): Observable<void> {
    // Try API first, fallback to mock storage
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(error => {
        console.warn('API unavailable, deleting from mock storage', error);
        const index = this.mockProjects.findIndex(p => p.id === id);
        if (index !== -1) {
          this.mockProjects.splice(index, 1);
          return of(undefined);
        }
        return throwError(() => new Error('Project not found'));
      })
    );
  }
}
