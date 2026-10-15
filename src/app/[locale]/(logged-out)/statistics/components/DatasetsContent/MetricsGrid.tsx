import {
    Card,
    CardActionArea,
    CardContent,
    Grid,
    Typography,
} from "@mui/material";
import { getTranslations } from "next-intl/server";
import { MetricsResponse } from "@/interfaces/Metrics";
import { SearchCategory } from "@/interfaces/Search";
import { FILTER_COHORT_DISCOVERY } from "@/config/forms/filters";
import { RouteName } from "@/consts/routeName";

const metricKeys = [
    "datasets",
    "custodians",
    "durs",
    "datasetCohortRequest",
    "tools",
    "publications",
    "custodianNetworks",
    "collections",
] as const;

const metricHrefs: Record<(typeof metricKeys)[number], string> = {
    datasets: `/${RouteName.SEARCH}?type=${SearchCategory.DATASETS}`,
    custodians: `/${RouteName.SEARCH}?type=${SearchCategory.DATA_CUSTODIANS}`,
    durs: `/${RouteName.SEARCH}?type=${SearchCategory.DATA_USE}`,
    datasetCohortRequest: `/${RouteName.SEARCH}?type=${SearchCategory.DATASETS}&${FILTER_COHORT_DISCOVERY}=${FILTER_COHORT_DISCOVERY}`,
    tools: `/${RouteName.SEARCH}?type=${SearchCategory.TOOLS}`,
    publications: `/${RouteName.SEARCH}?type=${SearchCategory.PUBLICATIONS}`,
    custodianNetworks: `/${RouteName.SEARCH}?type=${SearchCategory.COLLECTIONS}`,
    collections: `/${RouteName.SEARCH}?type=${SearchCategory.COLLECTIONS}`,
};

const formatNumber = (value?: number) => (value ?? 0).toLocaleString();

const TRANSLATION_PATH = "pages.statistics";

interface MetricsGridProps {
    metrics: MetricsResponse;
}

export default async function MetricsGrid({ metrics }: MetricsGridProps) {
    const t = await getTranslations(TRANSLATION_PATH);

    return (
        <Grid container spacing={2}>
            {metricKeys.map(key => (
                <Grid key={key} size={{ xs: 12, sm: 6, md: 3 }}>
                    <Card
                        sx={{
                            height: "100%",
                            backgroundColor: "grey.100",
                            borderRadius: 0,
                        }}>
                        <CardActionArea
                            href={metricHrefs[key]}
                            sx={{ height: "100%" }}>
                            <CardContent sx={{ p: 2 }}>
                                <Typography
                                    sx={{
                                        color: "grey.700",
                                        mb: 1,
                                    }}>
                                    {t(key)}
                                </Typography>

                                <Typography variant="h2" component="span">
                                    {formatNumber(metrics[key])}
                                </Typography>
                            </CardContent>
                        </CardActionArea>
                    </Card>
                </Grid>
            ))}
        </Grid>
    );
}
