// state.ts
export interface TaskState {
    completedTasks: string[];
}

export const initialTaskState: TaskState = {
    completedTasks: []
};  