import { tokens } from "@hdruk/ui/theme";
import { Tool } from "@/interfaces/Tool";
import { IconType } from "@/interfaces/Ui";
import Box from "@/components/Box";
import Paper from "@/components/Paper";
import Typography from "@/components/Typography";
import { DataStatus } from "@/consts/application";
import { formatDate } from "@/utils/date";
import CardActions from "../CardActions";
import KeyValueList from "../KeyValueList";
import StatusMenu from "../StatusMenu";

interface ToolCardProps {
    onStatusChange?: (id: number, status: DataStatus) => void;
    disabledStatusOptions?: DataStatus[];
    tool: Tool;
    actions: {
        icon: IconType;
        href?: string;
        action?: (id: number) => void;
        label: string;
    }[];
}

const ToolCard = ({
    tool,
    actions,
    onStatusChange,
    disabledStatusOptions,
}: ToolCardProps) => {
    const { type_category, name, user, updated_at } = tool;

    return (
        <Paper data-testid="tool-card" sx={{ mb: 2 }}>
            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: onStatusChange
                        ? "1fr auto 50px"
                        : "repeat(1, 1fr 50px)",
                    p: 0,
                }}>
                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: {
                            xs: "repeat(1, 1fr)",
                            sm: "repeat(1, 2fr 1fr)",
                        },
                        gap: 2,
                        pb: 1,
                    }}>
                    <Box sx={{ p: 0, fontSize: 13 }}>
                        <Typography variant="h3" sx={{ mb: 2, fontSize: 16 }}>
                            {name}
                        </Typography>
                        <KeyValueList
                            rows={[
                                {
                                    key: "Creator",
                                    value:
                                        `${user?.firstname} ${user?.lastname}` ||
                                        "-",
                                },
                                {
                                    key: "Category",
                                    value: type_category?.map(
                                        (category, index) =>
                                            index !== type_category.length - 1
                                                ? `${category.name}, `
                                                : category.name
                                    ),
                                },
                                {
                                    key: "Last activity",
                                    value: formatDate(
                                        updated_at,
                                        "DD MMMM YYYY HH:mm"
                                    ),
                                },
                            ]}
                        />
                    </Box>
                </Box>
                {onStatusChange && (
                    <Box>
                        <StatusMenu
                            status={tool.status as DataStatus}
                            onChange={status => onStatusChange(tool.id, status)}
                            disabledOptions={disabledStatusOptions}
                        />
                    </Box>
                )}
                <Box
                    sx={{
                        p: 0,
                        borderLeft: `solid 1px ${tokens.status.faded}`,
                    }}>
                    <CardActions actions={actions} id={tool.id} />
                </Box>
            </Box>
        </Paper>
    );
};

export default ToolCard;
