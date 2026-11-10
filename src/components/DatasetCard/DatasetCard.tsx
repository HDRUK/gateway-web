import { tokens } from "@hdruk/ui/theme";
import { get } from "lodash";
import { Dataset } from "@/interfaces/Dataset";
import { IconType } from "@/interfaces/Ui";
import Box from "@/components/Box";
import KeyValueList from "@/components/KeyValueList";
import Paper from "@/components/Paper";
import Typography from "@/components/Typography";
import { nonManualDatasetCardActions } from "@/consts/actions";
import { DataStatus } from "@/consts/application";
import { getLatestVersion } from "@/utils/dataset";
import { formatDate } from "@/utils/date";
import CardActions from "../CardActions";
import StatusMenu from "../StatusMenu";
import DatasetCardMenu, { DatasetMenuAction } from "./DatasetCardMenu";

interface DatasetCardProps {
    onStatusChange?: (id: number, status: DataStatus) => void;
    disabledStatusOptions?: DataStatus[];
    dataset: Dataset;
    actions: {
        icon: IconType;
        href?: string;
        action?: (id: number) => void;
        label: string;
    }[];
    getMenuActions?: (dataset: Dataset) => DatasetMenuAction[];
    menuLabel?: string;
}

const DatasetCard = ({
    dataset,
    actions,
    getMenuActions,
    menuLabel,
    onStatusChange,
    disabledStatusOptions,
}: DatasetCardProps) => {
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

    const menuActions = getMenuActions ? getMenuActions(dataset) : [];

    return (
        <Paper data-testid="dataset-card" sx={{ mb: 2 }}>
            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns:
                        onStatusChange && dataset.create_origin === "MANUAL"
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
                                {
                                    key: "Created",
                                    value: originMapping[dataset.create_origin],
                                },
                                {
                                    key: "Cohort Discovery",
                                    value: dataset.is_cohort_discovery
                                        ? "Included"
                                        : "Excluded",
                                },
                            ]}
                        />
                    </Box>
                </Box>
                {onStatusChange && dataset.create_origin === "MANUAL" && (
                    <Box>
                        <StatusMenu
                            status={dataset.status as DataStatus}
                            onChange={status =>
                                onStatusChange(dataset.id, status)
                            }
                            disabledOptions={disabledStatusOptions}
                        />
                    </Box>
                )}
                <Box
                    sx={{
                        p: 0,
                        borderLeft: `solid 1px ${tokens.status.faded}`,
                    }}>
                    <CardActions
                        actions={
                            dataset.create_origin === "MANUAL"
                                ? actions
                                : nonManualDatasetCardActions
                        }
                        id={dataset.id}
                        query={
                            dataset.status === DataStatus.DRAFT
                                ? { status: DataStatus.DRAFT }
                                : undefined
                        }
                    />
                    {menuActions.length > 0 && menuLabel && (
                        <DatasetCardMenu
                            dataset={dataset}
                            label={menuLabel}
                            actions={menuActions}
                        />
                    )}
                </Box>
            </Box>
        </Paper>
    );
};

export default DatasetCard;
