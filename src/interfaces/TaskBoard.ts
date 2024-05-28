/* eslint-disable @typescript-eslint/no-explicit-any */
interface TaskBoardItem {
    id: string | number;
    anchored?: boolean;
    content: React.ReactNode;
    task: any;
}

export type { TaskBoardItem };
