import { store } from '../store'
import { Status } from '../types/task.types'
import { refreshUI } from '../app'

export function renderKanban() {
  const board = document.getElementById('kanban-board')
  if (!board) return

  const cols: Status[] = [Status.todo, Status.inProgress, Status.done]

  board.innerHTML = cols.map(col => {
    const items = store.tasks.filter(t => t.status === col)

    return `
    <div class="k-col" data-status="${col}">
      <h3>${col}</h3>
      <div class="k-body">
        ${items.map(t => `
          <div class="k-card" draggable="true" data-id="${t.id}">
            ${t.title}
          </div>
        `).join('')}
      </div>
    </div>
    `
  }).join('')

  let dragId: number | null = null

  document.querySelectorAll('.k-card').forEach(card => {
    card.addEventListener('dragstart', () => {
      dragId = Number(card.getAttribute('data-id'))
    })
  })

  document.querySelectorAll('.k-body').forEach(col => {
    col.addEventListener('dragover', e => e.preventDefault())

    col.addEventListener('drop', () => {
      if (!dragId) return

      const status = col.parentElement?.getAttribute('data-status') as Status
      const task = store.tasks.find(t => t.id === dragId)

      if (task) {
        task.status = status
        store.save()
        refreshUI()
      }
    })
  })
}