export interface TaskInterface {
  id: number
  title: string
  description: string
  status: Status
  priority: Priority
  tags: string[]
  dueDate: Date|null
  createdAt: Date
  completedAt: Date|null
}

export interface Settings {
  theme: string
  defaultView: string
  pomodoroTime: number
  breakTime: number
  defaultPriority: Priority
}

export enum Priority {
  low = 'low',
  medium = 'medium',
  high = 'high'
}

export enum Status {
  todo = 'todo',
  inProgress = 'inProgress',
  done = 'done'
}
