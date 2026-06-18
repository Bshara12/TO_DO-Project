export interface TaskInterface {
    id: number;
    title: string;
    description: string;
    status: Status;
    priority: Priority;
    tags: string[];
    dueDate: Date | null;
    createdAt: Date;
    completedAt: Date | null;
}
export interface Settings {
    theme: string;
    defaultView: string;
    pomodoroTime: number;
    breakTime: number;
    defaultPriority: Priority;
}
export declare enum Priority {
    low = "low",
    medium = "medium",
    high = "high"
}
export declare enum Status {
    todo = "todo",
    inProgress = "inProgress",
    done = "done"
}
//# sourceMappingURL=task.types.d.ts.map