export interface Project {
  id: number;
  rowVersionNumber?: number;
  projectName: string;
  taskName: string;
  startDate: string; // ISO date string
  endDate: string;   // ISO date string
  status: string;
  assignedTo?: string;
  cost?: number;
  budget?: number;
}
