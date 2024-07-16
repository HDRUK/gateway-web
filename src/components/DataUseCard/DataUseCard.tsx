import { Link } from "@mui/material";
import { useParams } from "next/navigation";
import { DataUse } from "@/interfaces/DataUse";
import { IconType } from "@/interfaces/Ui";
import Box from "@/components/Box";
import KeyValueList from "@/components/KeyValueList";
import Paper from "@/components/Paper";
import Typography from "@/components/Typography";
import { colors } from "@/config/theme";
import { RouteName } from "@/consts/routeName";
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
    const params = useParams<{ locale: string }>();
    const title = dataUse.project_title;
    const providerName = dataUse.team.name;
    const applicantNames = dataUse.non_gateway_applicants.join(", ");

    const datasetNames: JSX.Element[] = [];
    dataUse.datasets.forEach((dataset, idx) => {
        // don't add a comma to the last element
        datasetNames.push(
            <>
                <Link
                    href={`/${params?.locale}/${RouteName.DATASET_ITEM}/${dataset.id}`}>
                    {dataset.shortTitle}
                </Link>
                {idx + 1 < dataUse.datasets.length && ", "}
            </>
        );
    });

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
                            tablet: "repeat(1, 1fr)",
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
                                    key: "Data Custodian",
                                    value: providerName,
                                },
                                {
                                    key: "Applicant name(s)",
                                    value: applicantNames,
                                },
                                {
                                    key: "Datasets",
                                    value: datasetNames,
                                },
                                {
                                    key: "Last activity",
                                    value: formatDate(
                                        dataUse.updated_at,
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
