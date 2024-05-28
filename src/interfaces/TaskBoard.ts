interface TaskItem {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    id: string | number;
    [key: string]: any;
}

interface TaskBoardItem {
    id: string | number;
    anchored?: boolean;
    content: React.ReactNode;
    task?: TaskItem;
}

export type { TaskBoardItem, TaskItem };
