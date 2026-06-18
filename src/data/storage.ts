import { Settings, type TaskInterface } from '../types/task.types'

export function saveTasks (tasks: TaskInterface[]) {
  localStorage.setItem('tasks', JSON.stringify(tasks))
}
export function getTasks (): TaskInterface[] {
  const data = localStorage.getItem('tasks')

  if (!data) return []

  const tasks: TaskInterface[] = JSON.parse(data)

  return tasks.map((task: TaskInterface) => ({
    ...task,
    dueDate: task.dueDate ? new Date(task.dueDate) : null,
    createdAt: new Date(task.createdAt),
    completedAt: task.completedAt ? new Date(task.completedAt) : null
  }))
}

export function deleteAllTasks (): void {
  localStorage.removeItem('tasks')
}

export function saveSettings (setting: Settings): void {
  localStorage.setItem('settings', JSON.stringify(setting))
}

export function getSettings (): Settings | undefined {
  let data = localStorage.getItem('settings')
  if (!data) return undefined
  let set: Settings = JSON.parse(data)
  return set
}
