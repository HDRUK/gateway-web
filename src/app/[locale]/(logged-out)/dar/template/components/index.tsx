export type Board = "Selected Questions" | "Question Bank";

export type Task = {
    id: string;
    title: string;
    description: string;
    status: Board;
};

export type BoardSections = {
    [name: string]: Task[];
};
