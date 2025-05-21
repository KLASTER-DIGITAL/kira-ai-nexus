
import { UserProfile } from './auth';

export type EventType = 'event' | 'task' | 'reminder';
export type RecurringType = 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'yearly' | 'none';

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  startDate: string; // ISO string
  endDate?: string; // ISO string
  allDay: boolean;
  location?: string;
  type: EventType;
  recurring: boolean;
  recurringType?: RecurringType;
  user_id: string;
  created_at: string;
  updated_at: string;
  content?: {
    attendees?: string[];
    videoConferenceUrl?: string;
    color?: string;
    reminders?: number[]; // minutes before
    [key: string]: any;
  };
}

export interface CalendarIntegration {
  id: string;
  user_id: string;
  type: 'google' | 'outlook' | 'apple' | 'custom';
  name: string;
  connected: boolean;
  lastSynced?: string;
  settings?: {
    [key: string]: any;
  };
}

export interface CalendarFilter {
  type?: EventType[];
  startDate?: string;
  endDate?: string;
  search?: string;
}
