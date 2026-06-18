import { TaskInterface } from '../types/task.types'
import { formatDate } from '../utils/dateHelper'

export function taskCard(task: TaskInterface): string {
  const isDone = task.status === 'done'

  return `
  <div class="task-card ${isDone ? 'done' : ''}" data-id="${task.id}">
    
    <div class="task-title">${task.title}</div>

    <div class="task-meta">
      ${task.dueDate ? `<span>📅 ${formatDate(task.dueDate)}</span>` : ''}
      <span>${task.priority}</span>
    </div>

    <button class="delete-btn" data-del="${task.id}">✕</button>
  </div>
  `
}