"use client";

import { useState } from "react";
import { Select, MenuItem, InputAdornment } from "@mui/material";
import { useTranslations } from "next-intl";
import { DashboardEntityCount } from "@/interfaces/Dashboard";
import Box from "@/components/Box";
import BoxContainer from "@/components/BoxContainer";
import DownloadFile from "@/components/DownloadFile";
import Paper from "@/components/Paper";
import Typography from "@/components/Typography";
import DatasetViewsWidget from "@/modules/DatasetViewsWidget/DatasetViewsWidget";
import apis from "@/config/apis";
import { CalendarMonthOutlinedIcon } from "@/consts/icons";
import { formatDate } from "@/utils/date";
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

const PERIODS = [
    { value: "last_12_months", months: 12 },
    { value: "last_6_months", months: 6 },
    { value: "last_3_months", months: 3 },
    { value: "last_month", months: 1 },
];

const getPeriodDates = (period: string) => {
    const end = new Date();
    const start = new Date();
    const months = PERIODS.find(p => p.value === period)?.months ?? 12;
    start.setMonth(start.getMonth() - months);
    return {
        startDate: formatDate(start, "YYYY-MM-DD") ?? "",
        endDate: formatDate(end, "YYYY-MM-DD") ?? "",
    };
};

const Dashboard = ({ teamId, initialCounts }: DashboardProps) => {
    const t = useTranslations("pages.account.dashboard");
    const [period, setPeriod] = useState("last_12_months");

    const { startDate, endDate } = getPeriodDates(period);
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
                        <Select
                            size="small"
                            value={period}
                            onChange={e => setPeriod(e.target.value)}
                            inputProps={{ "aria-label": t("choosePeriod") }}
                            startAdornment={
                                <InputAdornment position="start">
                                    <CalendarMonthOutlinedIcon
                                        sx={{ fontSize: 18 }}
                                    />
                                </InputAdornment>
                            }
                            sx={{ minWidth: 180 }}>
                            {PERIODS.map(({ value }) => (
                                <MenuItem key={value} value={value}>
                                    {t(`periods.${value}`)}
                                </MenuItem>
                            ))}
                        </Select>
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
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gap: 2,
                    p: 0,
                }}>
                <DatasetViewsWidget
                    teamId={teamId}
                    startDate={startDate}
                    endDate={endDate}
                />
            </Box>
        </BoxContainer>
    );
};

export default Dashboard;
