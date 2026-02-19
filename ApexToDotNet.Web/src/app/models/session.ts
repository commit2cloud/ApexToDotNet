export interface Session {
  id: number;
  rowVersionNumber?: number;
  title: string;
  sessionType: string;
  speaker?: string;
  startDate: string; // ISO date string
  endDate: string;   // ISO date string
  status: string;
}
