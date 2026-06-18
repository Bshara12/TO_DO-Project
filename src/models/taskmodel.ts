import { Priority, Status, type TaskInterface } from '../types/task.types.js'
import { deleteAllTasks, getTasks, saveTasks } from '../data/storage.js'
import { TaskClass } from './task.js'

export class TaskManager {
  private tasks: TaskInterface[] = []
  getAll () {
    return getTasks()
  }
  getById (id: number): TaskInterface | null {
    this.tasks = getTasks()
    return this.tasks.find(t => t.id === id) ?? null
  }
  addTask (data: {
    title: string
    description: string
    priority: Priority
    tags: string[]
    dueDate: Date
  }) {
    let task = new TaskClass(
      data.title,
      data.description,
      data.priority,
      data.tags,
      data.dueDate
    )
    const tasks = getTasks()
    tasks.push(task)
    saveTasks(tasks)
  }

  updateTask (task: TaskInterface): void {
    const tasks = getTasks()
    const updateList = tasks.map(t => (t.id == task.id ? task : t))
    saveTasks(updateList)
  }

  deleteTask (id: number): void {
    this.tasks = getTasks()
    let filtered = this.tasks.filter(t => t.id !== id)
    saveTasks(filtered)
  }
  getByStatus (status: Status): TaskInterface[] {
    let filtered = getTasks().filter(t => t.status == status)
    console.log('filtered', filtered)
    return filtered
  }
}

