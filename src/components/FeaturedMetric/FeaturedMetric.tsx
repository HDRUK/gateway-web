"use client";

import { useEffect, useLayoutEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { MetricsResponse } from "@/interfaces/Metrics";
import { SearchCategory } from "@/interfaces/Search";
import Box from "@/components/Box";
import Typography from "@/components/Typography";
import useGet from "@/hooks/useGet";
import apis from "@/config/apis";
import theme from "@/config/theme";
import { ArrowUpwardIcon } from "@/consts/icons";
import { RouteName } from "@/consts/routeName";
import Link from "../Link";

const TRANSLATIONS_NAMESPACE = "pages.home.stats";
const ROTATE_INTERVAL_MS = 10000;
const STAT_ID_ORDER = [
    SearchCategory.DATASETS,
    SearchCategory.DATA_USE,
    "feasibility",
    SearchCategory.TOOLS,
    SearchCategory.PUBLICATIONS,
    "dataCustodians",
    "dataCustodianNetworks",
    SearchCategory.COLLECTIONS,
];

const formatNumber = (value?: number) => value?.toLocaleString() ?? 0;

interface FeatureMetricProps {
    selectedButton?: string;
}

const FeaturedMetric = ({ selectedButton }: FeatureMetricProps) => {
    const t = useTranslations(TRANSLATIONS_NAMESPACE);

    const { data: metricsData } = useGet<MetricsResponse>(apis.metricsV2Url);

    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    const selectedIndex = selectedButton
        ? STAT_ID_ORDER.indexOf(selectedButton)
        : -1;

    const [stableSelectedIndex, setStableSelectedIndex] = useState<
        number | null
    >(null);

    useLayoutEffect(() => {
        if (selectedIndex !== -1) {
            setStableSelectedIndex(selectedIndex);
            return;
        }

        if (!selectedButton) {
            setStableSelectedIndex(null);
        }
    }, [selectedButton, selectedIndex]);

    const displayIndex =
        stableSelectedIndex !== null ? stableSelectedIndex : currentIndex;

    const stats = useMemo(() => {
        return [
            t.rich("datasetsCustodians", {
                datasets: formatNumber(metricsData?.datasets ?? 0),
                custodians: formatNumber(metricsData?.custodians ?? 0),
                light: chunks => (
                    <Box
                        component="span"
                        sx={{
                            p: 0,
                            fontWeight: 400,
                            display: {
                                mobile: "none",
                                laptop: "inline",
                            },
                        }}>
                        {chunks}
                    </Box>
                ),
            }),

            t("durs", {
                durs: formatNumber(metricsData?.durs ?? 0),
            }),

            t("datasetCohortRequest", {
                datasetCohortRequest: formatNumber(
                    metricsData?.datasetCohortRequest ?? 0
                ),
            }),

            t("scripts", {
                scripts: formatNumber(metricsData?.tools ?? 0),
            }),

            t("publications", {
                publications: formatNumber(metricsData?.publications ?? 0),
            }),

            t("dataCustodians", {
                dataCustodians: formatNumber(metricsData?.custodians ?? 0),
            }),

            t("dataCustodianNetworks", {
                dataCustodians: formatNumber(
                    metricsData?.custodianNetworks ?? 0
                ),
            }),

            t("collections", {
                collections: formatNumber(metricsData?.collections ?? 0),
            }),
        ];
    }, [metricsData, t]);

    useEffect(() => {
        if (selectedIndex !== -1 || stats.length <= 1 || isPaused)
            return undefined;

        const interval = window.setInterval(() => {
            setCurrentIndex(prevIndex => (prevIndex + 1) % stats.length);
        }, ROTATE_INTERVAL_MS);

        return () => window.clearInterval(interval);
    }, [isPaused, selectedIndex, stats.length]);

    if (!metricsData) {
        return null;
    }

    return (
        <Box
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onFocus={() => setIsPaused(true)}
            onBlur={() => setIsPaused(false)}
            sx={{
                display: "flex",
                color: theme.palette.common.white,
                gap: 1,
                p: 2,
                mt: 2,
                borderLeft: "2px solid var(--Dark-Green-100, #ADDAD9)",
                background:
                    "linear-gradient(90deg, rgba(255, 255, 255, 0.10) 0%, rgba(255, 255, 255, 0.00) 100%)",
                justifyContent: "space-between",
                opacity: selectedIndex === -1 && selectedButton ? 0 : 100,
            }}>
            <Box sx={{ p: 0, display: "flex", gap: 1, alignItems: "center" }}>
                <ArrowUpwardIcon fontSize="large" />
                <Typography
                    data-testid="stat-line-text"
                    sx={{
                        fontSize: "1.5rem",
                        fontWeight: 600,
                        lineHeight: 1.2,
                        [theme.breakpoints.down("tablet")]: {
                            fontSize: "1.25rem",
                        },
                    }}>
                    {stats[displayIndex]}
                </Typography>
            </Box>
            <Link
                href={RouteName.STATISTICS}
                sx={{
                    color: theme.palette.common.white,
                    textDecorationColor: theme.palette.common.white,
                    fontSize: 16,
                    alignSelf: "center",
                }}>
                {t("viewAll")}
            </Link>
        </Box>
    );
};

export default FeaturedMetric;
