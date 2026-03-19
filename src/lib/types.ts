export type Priority = 'high' | 'medium' | 'low'
export type TimeOfDay = 'morning' | 'afternoon' | 'evening'

export interface Task {
  id: string
  user_id: string
  title: string
  completed: boolean
  priority: Priority
  tag: string
  time_of_day: TimeOfDay
  scheduled_date: string
  created_at: string
}

export interface Profile {
  id: string
  name: string | null
  plan: 'free' | 'pro'
  streak: number
  last_active: string | null
  created_at: string
}