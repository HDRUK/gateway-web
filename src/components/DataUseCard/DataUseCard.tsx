import { get } from "lodash";
import { DataUse } from "@/interfaces/DataUse";
import { IconType } from "@/interfaces/Ui";
import Box from "@/components/Box";
import KeyValueList from "@/components/KeyValueList";
import Paper from "@/components/Paper";
import Typography from "@/components/Typography";
import { colors } from "@/config/theme";
import { getLatestVersion } from "@/utils/dataset";
import { formatDate } from "@/utils/date";
import CardActions from "../CardActions";

interface DataUseCardProps {
    dataUse: DataUse;
    actions: {
        icon: IconType;
        href?: string;
        action?: (id: number) => void;
        label: string;
    }[];
}

const DataUseCard = ({ dataUse, actions }: DataUseCardProps) => {
    // const latestMetadata = getLatestVersion(dataUse);

    // if (!latestMetadata) return null;

    // const {
    //     version,
    //     updated_at,
    //     metadata: { metadata, gwdmVersion },
    // } = latestMetadata;

    const title = dataUse["project_title"];
    const providerName = "";
    const applicantName = dataUse["applicant_id"]; // TODO id->name



    // console.log(dataUse["datasets"]);
    let datasetNames = "";
    dataUse["datasets"].forEach(dataset => {
        datasetNames = datasetNames.concat(", " + dataset["shortTitle"])
    });
    // console.log(datasetNames);

    
    // const datasets = dataUse["datasets"]; //
    // const publisherName = get(
    //     metadata,
    //     gwdmVersion === undefined || gwdmVersion === "1.0"
    //         ? "summary.publisher.publisherName"
    //         : "summary.publisher.name"
    // ) as unknown as string;

    // const originMapping = {
    //     MANUAL: "Manually",
    //     API: "API",
    //     FMA: "FMA",
    // };

    return (
        <Paper data-testid="datause-card" sx={{ mb: 2 }}>
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
                                    key: "Data Providers",
                                    value: providerName,
                                },
                                {
                                    key: "Applicant name(s)",
                                    value: applicantName,
                                },
                                {
                                    key: "Datasets",
                                    value: datasetNames,
                                },
                                {
                                    key: "Last activity",
                                    value: formatDate(
                                        dataUse["updated_at"],
                                        "DD MMMM YYYY HH:mm"
                                    ),
                                },
                            ]}
                        />
                    </Box>
                </Box>
                <Box sx={{ p: 0, borderLeft: `solid 1px ${colors.grey600}` }}>
                    <CardActions actions={actions} id={dataUse.id} />
                </Box>
            </Box>
        </Paper>
    );
};

export default DataUseCard;
