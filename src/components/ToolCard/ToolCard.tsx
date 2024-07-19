import { Category } from "@/interfaces/Category";
import { Tool } from "@/interfaces/Tool";
import { IconType } from "@/interfaces/Ui";
import Box from "@/components/Box";
import Paper from "@/components/Paper";
import Typography from "@/components/Typography";
import useGet from "@/hooks/useGet";
import apis from "@/config/apis";
import { colors } from "@/config/theme";
import { formatDate } from "@/utils/date";
import CardActions from "../CardActions";
import KeyValueList from "../KeyValueList";

interface ToolCardProps {
    tool: Tool;
    actions: {
        icon: IconType;
        href?: string;
        action?: (id: number) => void;
        label: string;
    }[];
}

const ToolCard = ({ tool, actions }: ToolCardProps) => {
    const { category_id, name, user_name, updated_at } = tool;

    const { data: categories } = useGet<Category[]>(
        `${apis.categoriesV1Url}?perPage=200`
    );

    return (
        <Paper data-testid="tool-card" sx={{ mb: 2 }}>
            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: "repeat(1, 1fr 50px)",
                    p: 0,
                }}>
                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: {
                            mobile: "repeat(1, 1fr)",
                            tablet: "repeat(1, 2fr 1fr)",
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
                                    value: user_name || "-",
                                },
                                {
                                    key: "Category",
                                    value:
                                        categories?.find(
                                            c => c.id === category_id
                                        )?.name || "-",
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
                <Box sx={{ p: 0, borderLeft: `solid 1px ${colors.grey600}` }}>
                    <CardActions
                        actions={actions}
                        id={tool.id}
                        status={tool.status}
                    />
                </Box>
            </Box>
        </Paper>
    );
};

export default ToolCard;
