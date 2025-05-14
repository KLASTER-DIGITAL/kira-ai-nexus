
import { Task } from './tasks';
import { UserProfile } from './auth';

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  start: string;
  end: string;
  allDay?: boolean;
  color?: string;
  user_id?: string;
  created_at?: string;
  updated_at?: string;
  user?: UserProfile;
  relatedTasks?: Task[];
}
