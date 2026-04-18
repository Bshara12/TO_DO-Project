import { type TaskInterface } from '../types/task.types'

function saveTasks (tasks: TaskInterface[]) {
  localStorage.setItem('tasks', JSON.stringify(tasks))
}
function getTasks (): TaskInterface[] {
  const data = localStorage.getItem('tasks')

  if (!data) return []

  const tasks:TaskInterface[] = JSON.parse(data)

  return tasks.map((task: TaskInterface) => ({
    ...task,
    dueDate: new Date(task.dueDate),
    createdAt: new Date(task.createdAt),
    completedAt: new Date(task.completedAt)
  }))
}

function deleteAllTasks():void{
  localStorage.removeItem("tasks");
}