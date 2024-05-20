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
        <Card sx={{ border: 1, borderColor: "lightgrey", borderRadius: 2 }}>
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
                    <Box sx={{ p: 0, m: 0, gap: 1 }}>
                        <Typography
                            gutterBottom
                            variant="h4"
                            component="div"
                            sx={{ mb: 1 }}>
                            <b> {task.title} </b>
                        </Typography>
                        <Typography gutterBottom variant="h5" component="div">
                            {task.description}
                        </Typography>
                    </Box>

                    <DragIndicatorIcon fontSize="medium" color="primary" />
                </Box>
            </CardContent>
        </Card>
    );
};

export default TaskItem;
