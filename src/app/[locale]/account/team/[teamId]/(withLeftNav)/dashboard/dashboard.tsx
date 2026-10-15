"use client";

import { useState } from "react";
import { DateRangePicker } from "@hdruk/ui";
import type { DateRange } from "@hdruk/ui";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs, { ManipulateType } from "dayjs";
import "dayjs/locale/en-gb";
import { useTranslations } from "next-intl";
import { DashboardEntityCount } from "@/interfaces/Dashboard";
import Box from "@/components/Box";
import BoxContainer from "@/components/BoxContainer";
import DownloadFile from "@/components/DownloadFile";
import Paper from "@/components/Paper";
import Typography from "@/components/Typography";
import DatasetViewsBarWidget from "@/modules/DatasetViewsBarWidget/DatasetViewsBarWidget";
import DatasetViewsWidget from "@/modules/DatasetViewsWidget/DatasetViewsWidget";
import EnquiriesWidget from "@/modules/EnquiriesWidget/EnquiriesWidget";
import ImproveYourUsageWidget from "@/modules/ImproveYourUsageWidget/ImproveYourUsageWidget";
import LearnMoreWidget from "@/modules/LearnMoreWidget/LearnMoreWidget";
import OtherViewsWidget from "@/modules/OtherViewsWidget/OtherViewsWidget";
import apis from "@/config/apis";
import ResourceCounts from "./components/ResourceCounts/ResourceCounts";

interface DashboardCounts {
    datasets: DashboardEntityCount;
    datauses: DashboardEntityCount;
    tools: DashboardEntityCount;
    collections: DashboardEntityCount;
    publications: DashboardEntityCount;
}

interface DashboardProps {
    teamId: string;
    initialCounts: DashboardCounts;
}

const MIN_DATE = dayjs("2024-11-01");

const startOfToday = () => dayjs().startOf("day");

const lastPeriod = (amount: number, unit: ManipulateType) => (): DateRange => {
    const today = startOfToday();
    const start = today.subtract(amount, unit);
    return [start.isBefore(MIN_DATE) ? MIN_DATE : start, today];
};

const allTime = (): DateRange => [MIN_DATE, startOfToday()];

const SHORTCUTS = [
    { key: "lastMonth", getValue: lastPeriod(1, "month") },
    { key: "last3Months", getValue: lastPeriod(3, "month") },
    { key: "last6Months", getValue: lastPeriod(6, "month") },
    { key: "lastYear", getValue: lastPeriod(1, "year") },
    { key: "allTime", getValue: allTime },
];

const toApiDate = (date: DateRange[number]) =>
    date ? date.format("YYYY-MM-DD") : "";

const Dashboard = ({ teamId, initialCounts }: DashboardProps) => {
    const t = useTranslations("pages.account.dashboard");
    const [range, setRange] = useState<DateRange>(lastPeriod(1, "year"));

    const startDate = toApiDate(range[0]);
    const endDate = toApiDate(range[1]);
    const downloadUrl = `${apis.apiV3Url}/teams/${teamId}/dashboard/download/csv?startDate=${startDate}&endDate=${endDate}`;

    return (
        <BoxContainer sx={{ gap: 2, gridTemplateColumns: "minmax(0, 1fr)" }}>
            <Paper>
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        flexWrap: "wrap",
                        gap: 2,
                    }}>
                    <Box>
                        <Typography variant="h2" component="h1">
                            {t("title")}
                        </Typography>
                        <Typography>{t("text")}</Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <LocalizationProvider
                            dateAdapter={AdapterDayjs}
                            adapterLocale="en-gb">
                            <DateRangePicker
                                value={range}
                                onChange={setRange}
                                disableFuture
                                minDate={MIN_DATE}
                                hideLabel
                                label={t("choosePeriod")}
                                shortcuts={SHORTCUTS.map(
                                    ({ key, getValue }) => ({
                                        label: t(`shortcuts.${key}`),
                                        getValue,
                                    })
                                )}
                            />
                        </LocalizationProvider>
                        <DownloadFile
                            apiPath={downloadUrl}
                            buttonText={t("download")}
                            buttonSx={{ mb: 0 }}
                            variant="contained"
                        />
                    </Box>
                </Box>
            </Paper>
            <Paper>
                <ResourceCounts
                    teamId={teamId}
                    startDate={startDate}
                    endDate={endDate}
                    initialCounts={initialCounts}
                />
            </Paper>
            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: {
                        xs: "1fr",
                        md: "repeat(3, 1fr)",
                    },
                    gap: 2,
                    p: 0,
                }}>
                <DatasetViewsWidget
                    teamId={teamId}
                    startDate={startDate}
                    endDate={endDate}
                />
                <DatasetViewsBarWidget
                    teamId={teamId}
                    startDate={startDate}
                    endDate={endDate}
                />
                <OtherViewsWidget
                    teamId={teamId}
                    startDate={startDate}
                    endDate={endDate}
                />
                <EnquiriesWidget
                    teamId={teamId}
                    startDate={startDate}
                    endDate={endDate}
                />
                <LearnMoreWidget />
                <ImproveYourUsageWidget />
            </Box>
        </BoxContainer>
    );
};

export default Dashboard;
