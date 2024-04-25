import { Card, CardContent, CardHeader } from "@mui/material";
import Typography from "@mui/material/Typography";
import Box from "@/components/Box";
import { DragIndicatorIcon } from "@/consts/icons";
import { Task } from "../types";

type TaskItemProps = {
    task: Task;
};

const TaskItem = ({ task }: TaskItemProps) => {
    return (
        <Card sx={{ border: 1, borderColor: "black" }}>
            <CardContent>
                <Box
                    sx={{
                        display: "flex",
                        width: "100%",
                        p: 0,
                        m: 0,
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}>
                    <Typography gutterBottom variant="h5" component="div">
                        {task.title}
                    </Typography>
                    <DragIndicatorIcon fontSize="medium" color="primary" />
                </Box>
            </CardContent>
        </Card>
    );
};

export default TaskItem;
