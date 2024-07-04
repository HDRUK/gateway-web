import { Link } from "@mui/material";
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
import { RouteName } from "@/consts/routeName";

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

    const title = dataUse.project_title;
    const providerName = dataUse.team.name;
    const applicantName = dataUse.user.name;

    console.log(dataUse);
    // console.log(dataUse["datasets"]);
    let datasetNames: JSX.Element[] = [];
    dataUse.datasets.forEach((dataset, idx) => {
        // don't add a comma to the last element
        datasetNames.push(
            <span>
                <Link href="https://example.com">{dataset.shortTitle}</Link>
                {idx + 1 < dataUse.datasets.length && ", "}
            </span>
        );
    });

    console.log(datasetNames);
    // let datasetLinks: JSX.Element = (
    //     <Box>{datasetNames.map((datasetLink, idx) =>
    //         [idx > 0 && ", ",
    //         datasetLink]
    //         )}</Box>
    // );
    // console.log(datasetLinks);
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
