import { get } from "lodash";
import { Dataset } from "@/interfaces/Dataset";
import { IconType } from "@/interfaces/Ui";
import Box from "@/components/Box";
import KeyValueList from "@/components/KeyValueList";
import Paper from "@/components/Paper";
import Typography from "@/components/Typography";
import { colors } from "@/config/theme";
import { nonManualDatasetCardActions } from "@/consts/actions";
import { formatDate } from "@/utils/date";
import CardActions from "../CardActions";

interface DatasetCardProps {
    dataset: Dataset;
    actions: {
        icon: IconType;
        href?: string;
        action?: (id: number) => void;
        label: string;
    }[];
}

const DatasetCard = ({ dataset, actions }: DatasetCardProps) => {
    const latestMetadata = get(dataset, "versions[0]");

    if (!latestMetadata) return null;

    const {
        version,
        updated_at,
        metadata: { metadata },
    } = latestMetadata;

    const title = get(metadata, "summary.title") as unknown as string;
    const publisherName = get(
        metadata,
        "summary.publisher.publisherName"
    ) as unknown as string;

    const originMapping = {
        MANUAL: "Manually",
        API: "API",
        FMA: "FMA",
    };

    return (
        <Paper data-testid="dataset-card" sx={{ mb: 2 }}>
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
                            {title}
                        </Typography>
                        <KeyValueList
                            rows={[
                                {
                                    key: "Publisher",
                                    value: publisherName,
                                },
                                {
                                    key: "Version",
                                    value: version,
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
                    <Box
                        sx={{
                            p: 0,
                            alignItems: "end",
                            justifyContent: "end",
                            display: "flex",
                        }}>
                        <Typography fontSize={13}>
                            {originMapping[dataset.create_origin]} created
                            dataset
                        </Typography>
                    </Box>
                </Box>
                <Box sx={{ p: 0, borderLeft: `solid 1px ${colors.grey600}` }}>
                    <CardActions
                        actions={
                            dataset.create_origin === "MANUAL"
                                ? actions
                                : nonManualDatasetCardActions
                        }
                        id={dataset.id}
                    />
                </Box>
            </Box>
        </Paper>
    );
};

export default DatasetCard;
