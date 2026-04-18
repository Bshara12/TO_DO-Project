export interface TaskInterface {
  id: number
  title: string
  description: string
  status: Status
  priority: Priority
  tags: string[]
  dueDate: Date
  createdAt: Date
  completedAt: Date
}

interface Settings {}

enum Priority {
  low = 'low',
  medium = 'medium',
  high = 'high'
}

enum Status {
  todo = 'todo',
  inProgress = 'inProgress',
  done = 'done'
}
