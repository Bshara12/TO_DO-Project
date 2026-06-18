import { TaskInterface, Status } from './types/task.types'
import { getTasks, saveTasks } from './data/storage'

class Store {
  tasks: TaskInterface[] = []
  searchQ = ''
  filter: 'all' | 'today' | 'upcoming' | 'done' = 'all'
  dragId: number | null = null

  load() {
    this.tasks = getTasks().map(t => ({
      ...t,
      dueDate: t.dueDate ? new Date(t.dueDate) : null,
      createdAt: new Date(t.createdAt),
      completedAt: t.completedAt ? new Date(t.completedAt) : null
    }))
  }

  save() {
    saveTasks(this.tasks)
  }

  update(task: TaskInterface) {
    this.tasks = this.tasks.map(t => t.id === task.id ? task : t)
    this.save()
  }

  delete(id: number) {
    this.tasks = this.tasks.filter(t => t.id !== id)
    this.save()
  }

  toggleDone(id: number) {
    const t = this.tasks.find(t => t.id === id)
    if (!t) return

    t.status = t.status === Status.done ? Status.todo : Status.done
    t.completedAt = t.status === Status.done ? new Date() : null

    this.save()
  }
}

export const store = new Store()