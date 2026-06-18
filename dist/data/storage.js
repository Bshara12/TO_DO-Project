export function saveTasks(tasks) {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}
export function getTasks() {
    const data = localStorage.getItem('tasks');
    if (!data)
        return [];
    const tasks = JSON.parse(data);
    return tasks.map((task) => (Object.assign(Object.assign({}, task), { dueDate: task.dueDate ? new Date(task.dueDate) : null, createdAt: new Date(task.createdAt), completedAt: task.completedAt ? new Date(task.completedAt) : null })));
}
export function deleteAllTasks() {
    localStorage.removeItem('tasks');
}
export function saveSettings(setting) {
    localStorage.setItem('settings', JSON.stringify(setting));
}
export function getSettings() {
    let data = localStorage.getItem('settings');
    if (!data)
        return undefined;
    let set = JSON.parse(data);
    return set;
}
//# sourceMappingURL=storage.js.map