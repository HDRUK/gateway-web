import { get } from "lodash";
import { Dataset } from "@/interfaces/Dataset";
import { IconType } from "@/interfaces/Ui";
import Box from "@/components/Box";
import KeyValueList from "@/components/KeyValueList";
import Paper from "@/components/Paper";
import Typography from "@/components/Typography";
import { colors } from "@/config/theme";
import { nonManualDatasetCardActions } from "@/consts/actions";
import { getLatestVersion } from "@/utils/dataset";
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
    const latestMetadata = getLatestVersion(dataset);

    if (!latestMetadata) return null;

    const { updated_at } = dataset;
    const { gwdmVersion } = latestMetadata;

    const title = get(latestMetadata, "summary.title") as unknown as string;
    const publisherName = get(
        latestMetadata,
        gwdmVersion === undefined || gwdmVersion === "1.0"
            ? "summary.publisher.publisherName"
            : "summary.publisher.name"
    ) as unknown as string;

    const version = get(latestMetadata, "required.version");

    const originMapping = {
        MANUAL: "Manually",
        API: "API",
        GMI: "Predefined Integration",
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
                        status={dataset.status}
                    />
                </Box>
            </Box>
        </Paper>
    );
};

export default DatasetCard;
