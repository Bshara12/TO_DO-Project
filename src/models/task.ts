import {
  Priority,
  Status,
  type TaskInterface
} from '../types/task.types.js'
export class TaskClass implements TaskInterface {
  id: number
  title: string
  description: string
  status: Status
  priority: Priority
  tags: string[]
  dueDate: Date
  createdAt: Date
  completedAt: Date | null

  constructor (
    title: string,
    description: string,
    priority: Priority,
    tags: string[],
    dueDate: Date
  ) {
    this.id = Date.now() // معرف فريد مؤقت
    this.title = title
    this.description = description
    this.status = Status.todo
    this.priority = priority
    ;(this.tags = tags), (this.dueDate = dueDate), (this.createdAt = new Date())
    this.completedAt = null
  }
}
