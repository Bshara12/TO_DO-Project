import { getTasks, saveTasks } from '../data/storage.js';
import { TaskClass } from './task.js';
export class TaskManager {
    constructor() {
        this.tasks = [];
    }
    getAll() {
        return getTasks();
    }
    getById(id) {
        var _a;
        this.tasks = getTasks();
        return (_a = this.tasks.find(t => t.id === id)) !== null && _a !== void 0 ? _a : null;
    }
    addTask(data) {
        let task = new TaskClass(data.title, data.description, data.priority, data.tags, data.dueDate);
        const tasks = getTasks();
        tasks.push(task);
        saveTasks(tasks);
    }
    updateTask(task) {
        const tasks = getTasks();
        const updateList = tasks.map(t => (t.id == task.id ? task : t));
        saveTasks(updateList);
    }
    deleteTask(id) {
        this.tasks = getTasks();
        let filtered = this.tasks.filter(t => t.id !== id);
        saveTasks(filtered);
    }
    getByStatus(status) {
        let filtered = getTasks().filter(t => t.status == status);
        console.log('filtered', filtered);
        return filtered;
    }
}
//# sourceMappingURL=taskmodel.js.map