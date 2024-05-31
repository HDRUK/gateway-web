import React from "react";
import { useDroppable } from "@dnd-kit/core";
import {
    SortableContext,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { SxProps } from "@mui/material";
import Typography from "@mui/material/Typography";
import { TaskBoardItem } from "@/interfaces/TaskBoard";
import Box from "@/components/Box";
import Paper from "@/components/Paper";
import SortableItem from "@/components/SortableItem";
import { colors } from "@/config/theme";

export type TaskBoardSectionProps = {
    id: string;
    title: string;
    description: string;
    sx?: SxProps;
    tasks: TaskBoardItem[];
};

const TaskBoardSection = ({
    id,
    title,
    description,
    tasks,
    sx,
}: TaskBoardSectionProps) => {
    const { setNodeRef } = useDroppable({
        id,
    });

    const sxContainer = {
        p: 2,
        ...sx,
    };

    return (
        <Paper sx={sxContainer}>
            <Box>
                <Typography variant="h2">{title}</Typography>
                <Typography>{description}</Typography>
            </Box>
            <Paper sx={{ p: 1, backgroundColor: colors.grey100, border: 0 }}>
                <SortableContext
                    id={id}
                    items={tasks}
                    strategy={verticalListSortingStrategy}>
                    <div ref={setNodeRef}>
                        {tasks.map(task => (
                            <Box
                                key={task.id}
                                sx={{
                                    p: 0,
                                    m: 0,
                                    mb: 2,
                                }}>
                                <SortableItem id={task.id}>
                                    {task.content}
                                </SortableItem>
                            </Box>
                        ))}
                    </div>
                </SortableContext>
            </Paper>
        </Paper>
    );
};

export default TaskBoardSection;
