"use client";

import Skeleton from "@mui/material/Skeleton";
import { useTheme } from "@mui/material/styles";
import { LineChart } from "@mui/x-charts/LineChart";
import { useTranslations } from "next-intl";
import Box from "@/components/Box";
import Paper from "@/components/Paper";
import Typography from "@/components/Typography";
import useGet from "@/hooks/useGet";
import apis from "@/config/apis";

const MS_PER_DAY = 86_400_000;
const MONTHLY_THRESHOLD_DAYS = 180;
const WEEKLY_THRESHOLD_DAYS = 30;
const CHART_HEIGHT = 280;
const CHART_XAXIS_HEIGHT = 40;
const CHART_MARGIN = { top: 16, right: 32, bottom: 0, left: 8 } as const;

interface DatasetViewsPoint {
    date: string;
    counter: number;
}

type Granularity = "monthly" | "weekly" | "daily";

interface DatasetViewsWidgetProps {
    teamId: string;
    startDate: string;
    endDate: string;
}

const getGranularity = (startDate: string, endDate: string): Granularity => {
    const diffDays =
        (new Date(endDate).getTime() - new Date(startDate).getTime()) /
        MS_PER_DAY;
    if (diffDays >= MONTHLY_THRESHOLD_DAYS) return "monthly";
    if (diffDays >= WEEKLY_THRESHOLD_DAYS) return "weekly";
    return "daily";
};

const formatDateLabel = (date: string, granularity: Granularity): string => {
    if (granularity === "monthly") {
        const [year, month] = date.split("-");
        return new Date(Number(year), Number(month) - 1).toLocaleString(
            "en-GB",
            { month: "short" }
        );
    }
    if (granularity === "weekly") return `W${date.split("-")[1]}`;
    return new Date(date).toLocaleString("en-GB", {
        day: "numeric",
        month: "short",
    });
};

const DatasetViewsWidget = ({
    teamId,
    startDate,
    endDate,
}: DatasetViewsWidgetProps) => {
    const t = useTranslations("pages.account.dashboard.datasetViews");
    const { palette } = useTheme();
    const granularity = getGranularity(startDate, endDate);

    const datasetViewsUrl = `${apis.teamsV3Url}/${teamId}/dashboard/datasets/views/360`;

    const { data, isLoading } = useGet<DatasetViewsPoint[]>(
        `${datasetViewsUrl}?${new URLSearchParams({
            startDate,
            endDate,
        }).toString()}`,
        {}
    );

    const points = data ?? [];
    const total = points.reduce((sum, p) => sum + p.counter, 0);

    if (isLoading) {
        return (
            <Paper sx={{ p: 2, height: "100%" }}>
                <Skeleton
                    variant="rectangular"
                    height="100%"
                    sx={{ minHeight: CHART_HEIGHT }}
                />
            </Paper>
        );
    }

    return (
        <Paper sx={{ pb: 2 }}>
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    pt: 2,
                    px: 2,
                }}>
                <Typography variant="h2">
                    {total.toLocaleString()} {t("title")}
                </Typography>
            </Box>
            {points.length === 0 ? (
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        height: CHART_HEIGHT,
                        px: 2,
                    }}>
                    <Typography sx={{ color: "text.secondary" }}>
                        {t("noData")}
                    </Typography>
                </Box>
            ) : (
                <LineChart
                    xAxis={[
                        {
                            scaleType: "point",
                            data: points.map(p =>
                                formatDateLabel(p.date, granularity)
                            ),
                            height: CHART_XAXIS_HEIGHT,
                        },
                    ]}
                    series={[
                        {
                            data: points.map(p => p.counter),
                            color: palette.primary.main,
                            showMark: true,
                        },
                    ]}
                    height={CHART_HEIGHT}
                    grid={{ horizontal: true }}
                    margin={CHART_MARGIN}
                    sx={{ width: "100%" }}
                />
            )}
        </Paper>
    );
};

export default DatasetViewsWidget;
