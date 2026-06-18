import { store } from '../store';
import { Priority, Status } from '../types/task.types';
let editId = null;
export function initModal(refresh) {
    const saveBtn = document.getElementById('save-task');
    saveBtn === null || saveBtn === void 0 ? void 0 : saveBtn.addEventListener('click', () => {
        const title = document.getElementById('f-title').value;
        if (!title)
            return;
        if (editId) {
            const t = store.tasks.find(t => t.id === editId);
            if (t)
                t.title = title;
        }
        else {
            store.tasks.push({
                id: Date.now(),
                title,
                description: '',
                priority: Priority.medium,
                status: Status.todo,
                tags: [],
                dueDate: new Date(),
                createdAt: new Date(),
                completedAt: null
            });
        }
        store.save();
        refresh();
    });
}
//# sourceMappingURL=modal.js.map