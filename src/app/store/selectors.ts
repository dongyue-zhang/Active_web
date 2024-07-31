// selectors.ts
import { createSelector } from '@ngrx/store';
import { TaskState } from './state';

export const selectTaskState = (state: { taskState: TaskState }) => state.taskState;

export const selectCompletedTasks = createSelector(
    selectTaskState,
    (state: TaskState) => state.completedTasks
);


