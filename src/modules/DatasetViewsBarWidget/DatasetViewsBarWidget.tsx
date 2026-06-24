"use client";

import { useState, type ReactNode } from "react";
import MuiLink from "@mui/material/Link";
import Skeleton from "@mui/material/Skeleton";
import { useTheme } from "@mui/material/styles";
import type { BarItemIdentifier } from "@mui/x-charts";
import { BarChart } from "@mui/x-charts/BarChart";
import { ChartsText, type ChartsTextProps } from "@mui/x-charts/ChartsText";
import {
    ChartsTooltipContainer,
    useItemTooltip,
    type ChartsTooltipContainerProps,
} from "@mui/x-charts/ChartsTooltip";
import { useYAxis } from "@mui/x-charts/hooks";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import Box from "@/components/Box";
import Paper from "@/components/Paper";
import Typography from "@/components/Typography";
import useGet from "@/hooks/useGet";
import apis from "@/config/apis";
import { colors } from "@/config/theme";
import { RouteName } from "@/consts/routeName";
import { getShortenedText } from "@/utils/string";

const TRANSLATION_PATH = "pages.account.dashboard.datasetViewsBar";
const CHART_MARGIN = { top: 8, right: 48, bottom: 8, left: 0 } as const;
const Y_AXIS_WIDTH = 160;
const LABEL_INNER_PADDING = 8;
const BAR_HEIGHT = 24;
const BAR_SPACING = 12;
const BAND_SIZE = BAR_HEIGHT + BAR_SPACING;
const MAX_BARS = 6;
const Y_LABEL_CHARS = 22;
const Y_LABEL_PADDING = 16;
const CATEGORY_GAP_RATIO = BAR_SPACING / BAND_SIZE;

const BarLabelInsideEnd = ({
    x,
    y,
    width,
    height,
    isFaded,
    isHighlighted,
    children,
}: {
    x?: number;
    y?: number;
    width?: number;
    height?: number;
    isFaded?: boolean;
    isHighlighted?: boolean;
    children?: ReactNode;
}) => {
    const { typography } = useTheme();

    return (
        <text
            x={(x ?? 0) + (width ?? 0) - LABEL_INNER_PADDING}
            y={(y ?? 0) + (height ?? 0) / 2}
            textAnchor="end"
            dominantBaseline="central"
            pointerEvents="none"
            fill={isHighlighted ? colors.white : colors.purple900}
            opacity={isFaded ? 0.3 : 1}
            fontSize={typography.caption.fontSize}>
            {children}
        </text>
    );
};

// Left-aligned y-axis tick label. The default renderer anchors labels against the
// axis line (right-aligned); we pin them to the left edge of the axis gutter instead.
const YAxisTickLabel = (props: ChartsTextProps) => (
    <ChartsText
        {...props}
        x={-(Y_AXIS_WIDTH - Y_LABEL_PADDING)}
        style={{ ...props.style, textAnchor: "start" }}
    />
);

// Item tooltip: shows the full (untruncated) dataset title plus its view count.
const DatasetViewsTooltipContent = () => {
    const t = useTranslations(TRANSLATION_PATH);
    const item = useItemTooltip();
    const yAxis = useYAxis();

    const dataIndex = item?.identifier.dataIndex;
    if (item == null || dataIndex == null) return null;

    const fullTitle = yAxis?.data?.[dataIndex] as string | undefined;
    if (fullTitle == null) return null;

    return (
        <Paper sx={{ p: 1, boxShadow: 2 }}>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {fullTitle}
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
                {`${t("viewsLabel")}: ${item.formattedValue}`}
            </Typography>
        </Paper>
    );
};

const DatasetViewsTooltip = (props: ChartsTooltipContainerProps) => (
    <ChartsTooltipContainer {...props} trigger="item">
        <DatasetViewsTooltipContent />
    </ChartsTooltipContainer>
);

interface DatasetViewsEntry {
    id: number;
    title: string;
    counter: number;
}

interface DatasetViewsBarWidgetProps {
    teamId: string;
    startDate: string;
    endDate: string;
}

type Mode = "top" | "bottom";

const DatasetViewsBarWidget = ({
    teamId,
    startDate,
    endDate,
}: DatasetViewsBarWidgetProps) => {
    const t = useTranslations(TRANSLATION_PATH);
    const router = useRouter();
    const [mode, setMode] = useState<Mode>("top");
    const isTop = mode === "top";

    const params = new URLSearchParams({ startDate, endDate }).toString();
    const viewsUrl = `${apis.teamsV3Url}/${teamId}/dashboard/datasets/views`;
    const activeUrl = `${viewsUrl}/${isTop ? "top" : "bottom"}?${params}`;

    const { data, isLoading } = useGet<DatasetViewsEntry[]>(activeUrl, {
        keepPreviousData: true,
    });

    const entries = (data ?? []).slice(0, MAX_BARS);
    const title = isTop ? t("mostTitle") : t("leastTitle");

    const chartHeight =
        entries.length * BAND_SIZE + CHART_MARGIN.top + CHART_MARGIN.bottom;

    const handleBarClick = (_event: MouseEvent, barData: BarItemIdentifier) => {
        const entry = entries[barData.dataIndex];
        if (entry) {
            router.push(`/${RouteName.DATASET_ITEM}/${entry.id}`);
        }
    };

    if (isLoading && entries.length === 0) {
        return (
            <Paper sx={{ p: 2 }}>
                <Skeleton
                    variant="rectangular"
                    height={chartHeight}
                    aria-label={title}
                />
            </Paper>
        );
    }

    return (
        <Paper
            sx={{
                pb: 2,
                height: "100%",
                display: "flex",
                flexDirection: "column",
            }}>
            <Box sx={{ pt: 2, px: 2 }}>
                <Typography variant="h2">{title}</Typography>
            </Box>
            <BarChart
                layout="horizontal"
                yAxis={[
                    {
                        scaleType: "band",
                        data: entries.map(e => e.title),
                        valueFormatter: (title, ctx) =>
                            ctx.location === "tick"
                                ? getShortenedText(title, Y_LABEL_CHARS)
                                : title,
                        disableLine: true,
                        disableTicks: true,
                        categoryGapRatio: CATEGORY_GAP_RATIO,
                        width: Y_AXIS_WIDTH,
                    },
                ]}
                xAxis={[
                    {
                        disableLine: true,
                        disableTicks: true,
                        tickLabelStyle: { display: "none" },
                        height: 0,
                    },
                ]}
                series={[
                    {
                        data: entries.map(e => e.counter),
                        color: colors.purple100,
                        highlightScope: { highlight: "item" },
                        barLabel: "value",
                    },
                ]}
                height={chartHeight}
                margin={CHART_MARGIN}
                hideLegend
                axisHighlight={{ x: "none", y: "none" }}
                onItemClick={handleBarClick}
                aria-label={title}
                slots={{
                    barLabel: BarLabelInsideEnd,
                    tooltip: DatasetViewsTooltip,
                    axisTickLabel: YAxisTickLabel,
                }}
                sx={{
                    width: "100%",
                    "& .MuiBarChart-element": {
                        cursor: "pointer",
                    },
                    "& .MuiBarChart-element:hover": { fill: colors.purple500 },
                    "& .MuiBarChart-element[data-highlighted]": {
                        filter: "none",
                    },
                }}
            />
            <Box sx={{ px: 2, mt: "auto", pb: 0 }}>
                <MuiLink
                    component="button"
                    type="button"
                    onClick={() => setMode(isTop ? "bottom" : "top")}>
                    {isTop ? t("showLeast") : t("showMost")}
                </MuiLink>
            </Box>
        </Paper>
    );
};

export default DatasetViewsBarWidget;
