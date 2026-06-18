import { Priority, Status, type TaskInterface } from '../types/task.types.js';
export declare class TaskManager {
    private tasks;
    getAll(): TaskInterface[];
    getById(id: number): TaskInterface | null;
    addTask(data: {
        title: string;
        description: string;
        priority: Priority;
        tags: string[];
        dueDate: Date;
    }): void;
    updateTask(task: TaskInterface): void;
    deleteTask(id: number): void;
    getByStatus(status: Status): TaskInterface[];
}
//# sourceMappingURL=taskmodel.d.ts.map