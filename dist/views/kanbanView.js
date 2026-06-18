import { store } from '../store';
import { Status } from '../types/task.types';
import { refreshUI } from '../app';
export function renderKanban() {
    const board = document.getElementById('kanban-board');
    if (!board)
        return;
    const cols = [Status.todo, Status.inProgress, Status.done];
    board.innerHTML = cols.map(col => {
        const items = store.tasks.filter(t => t.status === col);
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
    `;
    }).join('');
    let dragId = null;
    document.querySelectorAll('.k-card').forEach(card => {
        card.addEventListener('dragstart', () => {
            dragId = Number(card.getAttribute('data-id'));
        });
    });
    document.querySelectorAll('.k-body').forEach(col => {
        col.addEventListener('dragover', e => e.preventDefault());
        col.addEventListener('drop', () => {
            var _a;
            if (!dragId)
                return;
            const status = (_a = col.parentElement) === null || _a === void 0 ? void 0 : _a.getAttribute('data-status');
            const task = store.tasks.find(t => t.id === dragId);
            if (task) {
                task.status = status;
                store.save();
                refreshUI();
            }
        });
    });
}
//# sourceMappingURL=kanbanView.js.map