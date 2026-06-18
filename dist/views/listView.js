import { store } from '../store';
import { taskCard } from '../components/taskCard';
import { isToday, isUpcoming } from '../utils/dateHelper';
import { refreshUI } from '../app';
export function renderList() {
    const container = document.getElementById('list-container');
    if (!container)
        return;
    let tasks = [...store.tasks];
    if (store.searchQ) {
        tasks = tasks.filter(t => t.title.toLowerCase().includes(store.searchQ));
    }
    if (store.filter === 'today') {
        tasks = tasks.filter(t => t.dueDate && isToday(t.dueDate));
    }
    if (store.filter === 'upcoming') {
        tasks = tasks.filter(t => t.dueDate && isUpcoming(t.dueDate));
    }
    if (store.filter === 'done') {
        tasks = tasks.filter(t => t.status === 'done');
    }
    if (!tasks.length) {
        container.innerHTML = `<div>No tasks</div>`;
        return;
    }
    container.innerHTML = tasks.map(taskCard).join('');
    // delete
    container.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const id = Number(btn.dataset.del);
            store.delete(id);
            refreshUI();
        });
    });
    // toggle done
    container.querySelectorAll('.task-card').forEach(el => {
        el.addEventListener('click', () => {
            const id = Number(el.getAttribute('data-id'));
            store.toggleDone(id);
            refreshUI();
        });
    });
}
//# sourceMappingURL=listView.js.map