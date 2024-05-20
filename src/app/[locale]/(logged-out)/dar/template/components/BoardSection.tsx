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
import { colors } from "@/config/theme";
import SortableTaskItem from "./SortableTaskItem";
import TaskItem from "./TaskItem";
import { Task } from "./index";

type BoardSectionProps = {
    id: string;
    title: string;
    description: string;
    tasks: Task[];
};

const BoardSection = ({ id, title, description, tasks }: BoardSectionProps) => {
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
                                <SortableTaskItem id={task.id}>
                                    <TaskItem task={task} />
                                </SortableTaskItem>
                            </Box>
                        ))}
                    </div>
                </SortableContext>
            </Paper>
        </Container>
    );
};

export default BoardSection;
