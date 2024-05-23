import React from "react";
import { useDroppable } from "@dnd-kit/core";
import {
    SortableContext,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import Typography from "@mui/material/Typography";
import Box from "@/components/Box";
import Container from "@/components/Container";
import Paper from "@/components/Paper";
import SortableItem from "@/components/SortableItem";
import { colors } from "@/config/theme";

interface TaskBoardItem {
    id: string;
    content: React.ReactNode;
}

export type TaskBoardSectionProps = {
    id: string;
    title: string;
    description: string;
    tasks: TaskBoardItem[];
};

const TaskBoardSection = ({
    id,
    title,
    description,
    tasks,
}: TaskBoardSectionProps) => {
    const { setNodeRef } = useDroppable({
        id,
    });

    return (
        <Container sx={{ pb: 2 }}>
            <Box>
                <Typography variant={"h2"}> {title}</Typography>
                <Typography> {description}</Typography>
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
        </Container>
    );
};

export default TaskBoardSection;
