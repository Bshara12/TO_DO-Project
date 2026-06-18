import { store } from '../store'
import { refreshUI } from '../app'
import { Priority, Status } from '../types/task.types'

let editId: number | null = null

export function initModal(refresh: () => void) {
  const saveBtn = document.getElementById('save-task')

  saveBtn?.addEventListener('click', () => {
    const title = (document.getElementById('f-title') as HTMLInputElement).value

    if (!title) return

    if (editId) {
      const t = store.tasks.find(t => t.id === editId)
      if (t) t.title = title
    } else {
      store.tasks.push({
        id: Date.now(),
        title,
        description: '',
        priority:Priority.medium,
        status: Status.todo,
        tags: [],
        dueDate: new Date(),
        createdAt: new Date(),
        completedAt: null
      })
    }

    store.save()
    refresh()
  })
}