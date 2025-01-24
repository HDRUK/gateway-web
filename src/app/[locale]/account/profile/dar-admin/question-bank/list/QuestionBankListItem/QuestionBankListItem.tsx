import { QuestionBankQuestion } from "@/interfaces/QuestionBankQuestion";
import { IconType } from "@/interfaces/Ui";
import Box from "@/components/Box";
import Card from "@/components/Card";
import CardActions from "@/components/CardActions";
import Chip from "@/components/Chip";
import Typography from "@/components/Typography";
import { colors } from "@/config/theme";
import { formatDate } from "@/utils/date";

interface QuestionCardProps {
    data: QuestionBankQuestion | undefined;
    actions: {
        icon: IconType;
        href?: string;
        action?: (id: number) => void;
        label: string;
    }[];
}

const QuestionBankListItem = ({ data, actions }: QuestionCardProps) => {
    if (!data) return null;

    const { title, guidance, component } = data;

    if (!title) return null;

    const hydratedActions = actions.map(action => {
        return {
            ...action,
            disabled: !!data.locked,
        };
    });

    return (
        <Card
            variant="outlined"
            sx={{ my: 1, minWidth: "100%", maxWdith: "100%" }}>
            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: "repeat(1, 1fr 50px)",
                    p: 0,
                }}>
                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: "repeat(2, 1fr)",
                    }}>
                    <Typography
                        component="div"
                        sx={{
                            fontWeight: "bold",
                            padding: "10px",
                            fontSize: 14,
                        }}>
                        <Chip
                            variant="outlined"
                            label={component}
                            color="primary"
                            sx={{ mr: 2 }}
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
                            {`Question ID - ${data.question_id}   Version - ${
                                data.version_id
                            }   Created - ${formatDate(data.created_at)}`}
                        </Typography>
                        <Typography component="span">{guidance}</Typography>
                    </Box>
                </Box>
                <Box sx={{ p: 0, borderLeft: `solid 1px ${colors.grey600}` }}>
                    <CardActions
                        actions={hydratedActions}
                        id={data.question_id}
                    />
                </Box>
            </Box>
        </Card>
    );
};

export default QuestionBankListItem;
