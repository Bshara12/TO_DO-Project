import { store } from './store'
import { renderList } from './views/listView'
import { renderKanban } from './views/kanbanView'
import { initModal } from './components/modal'
import { initFocus } from './views/focusView'

export function refreshUI() {
  renderList()
  renderKanban()
  updateStats()
}

function updateStats() {
  const tasks = store.tasks

  const todo = tasks.filter(t => t.status === 'todo').length
  const prog = tasks.filter(t => t.status === 'inProgress').length
  const done = tasks.filter(t => t.status === 'done').length

  document.getElementById('s-todo')!.textContent = String(todo)
  document.getElementById('s-prog')!.textContent = String(prog)
  document.getElementById('s-done')!.textContent = String(done)
}

document.addEventListener('DOMContentLoaded', () => {
  store.load()
  refreshUI()

  initModal(refreshUI)
  initFocus(refreshUI)
})