// Strategic Planner Models

export enum Priority {
  P1 = 1,
  P2 = 2,
  P3 = 3,
  P4 = 4,
  P5 = 5
}

export enum Size {
  XS = 'XS',
  S = 'S',
  M = 'M',
  L = 'L',
  XL = 'XL'
}

export interface Project {
  id: number;
  name: string;
  description?: string;
  priority: Priority;
  status?: string;
  startDate?: Date;
  endDate?: Date;
  areaId?: number;
  areaName?: string;
  initiativeId?: number;
  initiativeName?: string;
  personCount?: number;
  activityCount?: number;
  createdDate?: Date;
  updatedDate?: Date;
}

export interface Area {
  id: number;
  name: string;
  description?: string;
  color?: string;
  projectCount?: number;
  initiativeCount?: number;
}

export interface Initiative {
  id: number;
  name: string;
  description?: string;
  priority: Priority;
  size?: Size;
  areaId?: number;
  areaName?: string;
  startDate?: Date;
  endDate?: Date;
  projectCount?: number;
  activityCount?: number;
}

export interface Activity {
  id: number;
  title: string;
  description?: string;
  priority: Priority;
  size?: Size;
  status?: string;
  projectId?: number;
  projectName?: string;
  initiativeId?: number;
  initiativeName?: string;
  assignedToId?: number;
  assignedToName?: string;
  dueDate?: Date;
  completedDate?: Date;
}

export interface Person {
  id: number;
  name: string;
  email?: string;
  role?: string;
  department?: string;
  projectCount?: number;
  activityCount?: number;
  completedActivityCount?: number;
}

export interface ProjectGroup {
  id: number;
  name: string;
  description?: string;
  projectCount?: number;
}

export interface PersonGroup {
  id: number;
  name: string;
  description?: string;
  personCount?: number;
}

export interface Release {
  id: number;
  name: string;
  description?: string;
  releaseDate?: Date;
  status?: string;
  projectCount?: number;
  activityCount?: number;
}

export interface NavigationCounts {
  projects: number;
  areas: number;
  initiatives: number;
  activities: number;
  people: number;
  projectGroups: number;
  personGroups: number;
  releases: number;
}

export interface SearchResult<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
}

