"use client";

import Skeleton from "@mui/material/Skeleton";
import { useTranslations } from "next-intl";
import Box from "@/components/Box";
import Paper from "@/components/Paper";
import Typography from "@/components/Typography";
import useGet from "@/hooks/useGet";
import apis from "@/config/apis";
import { colors } from "@/config/theme";

const TRANSLATION_PATH = "pages.account.dashboard.otherViews";
const TILE_COUNT = 2;

interface OtherViewsWidgetProps {
    teamId: string;
    startDate: string;
    endDate: string;
}

const OtherViewsWidget = ({
    teamId,
    startDate,
    endDate,
}: OtherViewsWidgetProps) => {
    const t = useTranslations(TRANSLATION_PATH);

    const params = new URLSearchParams({ startDate, endDate }).toString();
    const dashboardUrl = `${apis.teamsV3Url}/${teamId}/dashboard`;

    const { data: collectionsViews, isLoading: collectionsLoading } =
        useGet<number>(`${dashboardUrl}/collections/views?${params}`, {});
    const { data: dataCustodianViews, isLoading: dataCustodianLoading } =
        useGet<number>(`${dashboardUrl}/datacustodians/views?${params}`, {});

    const isLoading = collectionsLoading || dataCustodianLoading;

    const items = [
        { key: "collections", count: collectionsViews },
        { key: "dataCustodian", count: dataCustodianViews },
    ];

    return (
        <Paper sx={{ p: 2, height: "100%" }}>
            <Typography variant="h2" sx={{ mb: 2 }}>
                {t("title")}
            </Typography>
            {isLoading ? (
                <Box
                    role="status"
                    aria-label={t("loading")}
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 2,
                        p: 0,
                        m: 0,
                    }}>
                    {Array.from({ length: TILE_COUNT }, (_, i) => (
                        <Skeleton key={i} variant="rectangular" height={72} />
                    ))}
                </Box>
            ) : (
                <Box
                    component="dl"
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 2,
                        m: 0,
                        p: 0,
                    }}>
                    {items.map(({ key, count }) => (
                        <Box
                            key={key}
                            sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                gap: 2,
                                p: 2,
                                bgcolor: colors.grey100,
                            }}>
                            <Typography component="dt">
                                {t(`labels.${key}`)}
                            </Typography>
                            <Typography
                                variant="h1"
                                component="dd"
                                sx={{ m: 0 }}>
                                {(count ?? 0).toLocaleString()}
                            </Typography>
                        </Box>
                    ))}
                </Box>
            )}
        </Paper>
    );
};

export default OtherViewsWidget;
