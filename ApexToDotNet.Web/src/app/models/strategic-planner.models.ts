// Strategic Planner Models
// Aligned with the .NET API response shapes from StrategicPlannerController.cs

// ─── Projects (SP_PROJECTS) ───────────────────────────────────────
// GET /api/sp/SpProjects returns this shape
export interface Project {
  id: number;
  projectName: string;
  owner: string;
  ownerId?: number;
  area?: string;
  initiative?: string;
  initiativeId?: number;
  release?: string;
  releaseId?: number;
  status?: string;
  statusId?: number;
  priority?: string;       // e.g. "P1", "P2"
  priorityId?: number;
  pctComplete?: number;
  targetComplete?: string; // ISO date
  projectSize?: string;    // XS, S, M, L, XL
  tags?: string;
  updated?: string;        // ISO date
}

// Full project for create/edit (matches SpProject.cs)
export interface ProjectDetail {
  id: number;
  projectName: string;
  description?: string;
  ownerId?: number;
  initiativeId?: number;
  releaseId?: number;
  statusId?: number;
  priorityId?: number;
  pctComplete?: number;
  targetComplete?: string;
  projectSize?: string;
  tags?: string;
  focusAreaId?: number;
  url?: string;
  linkName?: string;
  archivedYn?: string;
  // Navigation properties returned by GET /{id}
  owner?: TeamMember;
  initiative?: Initiative;
  release?: Release;
  status?: ProjectStatus;
  priority?: ProjectPriority;
}

// ─── Initiatives (SP_INITIATIVES) ─────────────────────────────────
export interface Initiative {
  id: number;
  initiativeName: string;
  objective?: string;
  area?: string;
  areaId?: number;
  sponsor?: string;
  sponsorId?: number;
  activeProjects?: number;
  statusScale?: number;
  updated?: string;
  // Full entity fields (from GET /{id})
  archivedYn?: string;
}

// ─── Areas (SP_AREAS) ─────────────────────────────────────────────
export interface Area {
  id: number;
  areaName: string;
  description?: string;
  color?: string;
  initiatives?: number;
  projects?: number;
}

// ─── Releases (SP_RELEASE_TRAINS) ─────────────────────────────────
export interface Release {
  id: number;
  releaseTrain: string;
  releaseName: string;
  releaseOwner?: string;
  releaseTargetDate?: string;
  releaseOpenDate?: string;
  releaseCompleted?: string;
  releaseOpenCompleted?: string;
  releaseType?: string;
  projects?: number;
  avgPctComplete?: number;
  updated?: string;
}

// ─── Team Members (SP_TEAM_MEMBERS) ───────────────────────────────
export interface TeamMember {
  id: number;
  firstName: string;
  lastName: string;
  fullName?: string;
  email?: string;
  isCurrentYn?: string;
  jobTitle?: string;
  department?: string;
}

// ─── Activities (SP_ACTIVITIES) ───────────────────────────────────
export interface Activity {
  id: number;
  comments?: string;
  project?: string;
  projectId?: number;
  person?: string;
  teamMemberId?: number;
  startDate?: string;
  endDate?: string;
  tags?: string;
  updated?: string;
}

// ─── Lookups ──────────────────────────────────────────────────────
export interface ProjectStatus {
  id: number;
  status: string;
  displaySeq?: number;
  includeYn?: string;
}

export interface ProjectPriority {
  id: number;
  priority: number;
  description?: string;
}

export interface ActivityType {
  id: number;
  activityTypeName: string;
  isActiveYn?: string;
  displaySequence?: number;
}

export interface TaskType {
  id: number;
  taskTypeName: string;
}

// ─── Utility types ────────────────────────────────────────────────
export interface NavigationCounts {
  projects: number;
  areas: number;
  initiatives: number;
  activities: number;
  people: number;
  releases: number;
  projectGroups: number;
  peopleGroups: number;
}

// ─── Project Groups (SP_PROJECT_GROUPS) ───────────────────────────
export interface ProjectGroup {
  id: number;
  groupName: string;
  description?: string;
  projects?: number;
  updated?: string;
}

// ─── People Groups (SP_GROUPS + SP_GROUP_MEMBERS) ────────────────
export interface PeopleGroup {
  id: number;
  groupName: string;
  groupDescription?: string;
  groupTag?: string;
  members?: number | PeopleGroupMember[];
  updated?: string;
}

export interface PeopleGroupMember {
  id: number;
  teamMemberId: number;
  name?: string;
  groupLeaderYn?: string;
  addedToGroup?: string;
}