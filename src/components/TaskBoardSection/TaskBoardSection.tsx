import { useDroppable } from "@dnd-kit/core";
import {
    SortableContext,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { tokens } from "@hdruk/ui/theme";
import { SxProps } from "@mui/material";
import Typography from "@mui/material/Typography";
import { TaskBoardItem } from "@/interfaces/TaskBoard";
import Box from "@/components/Box";
import Paper from "@/components/Paper";
import SortableItem from "@/components/SortableItem";

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
    sx = { p: 2 },
}: TaskBoardSectionProps) => {
    const { setNodeRef } = useDroppable({
        id,
    });

    return (
        <Paper sx={sx}>
            <Box>
                <Typography variant="h2">{title}</Typography>
                <Typography>{description}</Typography>
            </Box>
            <Paper sx={{ p: 1, backgroundColor: tokens.background.primary, border: 0 }}>
                <SortableContext
                    id={id}
                    items={tasks}
                    strategy={verticalListSortingStrategy}>
                    <div ref={setNodeRef}>
                        {tasks?.map(task => (
                            <SortableItem key={task.id} itemId={task.id}>
                                {task.content}
                            </SortableItem>
                        ))}
                    </div>
                </SortableContext>
            </Paper>
        </Paper>
    );
};

export default TaskBoardSection;
