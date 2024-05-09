import { QuestionBankQuestion } from "@/interfaces/QuestionBankQuestion";
import Box from "@/components/Box";
import Card from "@/components/Card";
import Chip from "@/components/Chip";
import Typography from "@/components/Typography";
import { formatDate } from "@/utils/date";

interface QuestionCardProps {
    data: QuestionBankQuestion | undefined;
}

const QuestionListItem = ({ data }: QuestionCardProps) => {
    if (data === undefined) return null;

    const question = JSON.parse(data.question_json);
    const title = question?.title;
    const guidance = question?.guidance;
    const component = question?.field.component;
    if (!title) return null;

    return (
        <Card
            variant="outlined"
            sx={{ my: 1, minWidth: "100%", maxWdith: "100%" }}>
            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: "repeat(2, 1fr)",
                }}>
                <Typography
                    component="span"
                    sx={{
                        fontWeight: "bold",
                        padding: "10px",
                        fontSize: 14,
                    }}>
                    <Chip
                        variant="outlined"
                        label={component}
                        color="primary"
                        sx={{ mx: 2 }}
                    />
                    {title}
                </Typography>

                <Box
                    sx={{
                        m: 0.2,
                        display: "flex",
                        justifyContent: "end",
                    }}>
                    {!data.locked ? (
                        <Chip label="Available" color="success" />
                    ) : (
                        <Chip label="Locked" color="error" />
                    )}
                </Box>
                <Box
                    sx={{
                        display: "grid",
                        gridTemplateRows: "repeat(2, 1fr)",
                        gridColumn: "span 3",
                    }}>
                    <Typography
                        sx={{
                            color: "#868E96",
                        }}>
                        {`Question ID - ${data.id}   Version - ${
                            data.version
                        }   Created - ${formatDate(data.created_at)}`}
                    </Typography>
                    <Typography component="span">{guidance}</Typography>
                </Box>
            </Box>
        </Card>
    );
};

export default QuestionListItem;
