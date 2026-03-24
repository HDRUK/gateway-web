import { Card, CardContent, Grid, Typography } from "@mui/material";
import { getTranslations } from "next-intl/server";
import { MetricsResponse } from "@/interfaces/Metrics";

type MetricKey =
    | "datasets"
    | "custodians"
    | "durs"
    | "datasetCohortRequest"
    | "tools"
    | "publications"
    | "custodianNetworks"
    | "collections";

type MetricCardItem = {
    key: MetricKey;
    label: string;
};

const metricItems: MetricCardItem[] = [
    { key: "datasets", label: "datasets" },
    { key: "custodians", label: "dataCustodians" },
    { key: "durs", label: "dur" },
    { key: "datasetCohortRequest", label: "cohort" },
    { key: "tools", label: "scripts" },
    { key: "publications", label: "publications" },
    { key: "custodianNetworks", label: "custodianNetworks" },
    { key: "collections", label: "collections" },
];

const formatNumber = (value?: number) => (value ?? 0).toLocaleString();

const TRANSLATION_PATH = "pages.statistics";

interface MetricsGridProps {
    metrics: MetricsResponse;
}

export default async function MetricsGrid({ metrics }: MetricsGridProps) {
    const t = await getTranslations(TRANSLATION_PATH);

    return (
        <Grid container spacing={2}>
            {metricItems.map(item => (
                <Grid
                    key={item.key}
                    size={{ mobile: 12, tablet: 6, laptop: 3 }}>
                    <Card
                        sx={{
                            height: "100%",
                            backgroundColor: "grey.100",
                            borderRadius: 0,
                        }}>
                        <CardContent sx={{ p: 2 }}>
                            <Typography
                                sx={{
                                    color: "grey.700",
                                    mb: 1,
                                }}>
                                {t(item.label)}
                            </Typography>

                            <Typography variant="h2" component="span">
                                {formatNumber(metrics[item.key])}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            ))}
        </Grid>
    );
}
