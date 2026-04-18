"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const task_types_1 = require("../types/task.types");
function saveTasks(tasks) {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}
function getTasks() {
    const data = localStorage.getItem('tasks');
    if (!data)
        return [];
    const tasks = JSON.parse(data);
    return tasks.map((task) => ({
        ...task,
        dueDate: new Date(task.dueDate),
        createdAt: new Date(task.createdAt),
        completedAt: new Date(task.completedAt)
    }));
}
function deleteAllTasks() {
    localStorage.removeItem("tasks");
}
//# sourceMappingURL=storage.js.map