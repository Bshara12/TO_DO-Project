export interface TaskInterface {
    id: number;
    title: string;
    description: string;
    status: Status;
    priority: Priority;
    tags: string[];
    dueDate: Date;
    createdAt: Date;
    completedAt: Date;
}
declare enum Priority {
    low = "low",
    medium = "medium",
    high = "high"
}
declare enum Status {
    todo = "todo",
    inProgress = "inProgress",
    done = "done"
}
export {};
//# sourceMappingURL=task.types.d.ts.map