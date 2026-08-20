"use client";

import { ReactNode, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { ColumnDef } from "@tanstack/react-table";
import { Alert, Avatar, Divider, Skeleton } from "@mui/material";
import PercentIcon from "@mui/icons-material/Percent";
import Box from "@/components/Box";
import Paper from "@/components/Paper";
import Typography from "@/components/Typography";
import Chip from "@/components/Chip";
import Link from "@/components/Link";
import SortIcon from "@/components/SortIcon";
import Table from "@/components/Table";
import useGet from "@/hooks/useGet";
import apis from "@/config/apis";
import { RouteName } from "@/consts/routeName";
import {
    CheckCircleIcon,
    ErrorIcon,
    SearchRoundedIcon,
} from "@/consts/icons";
import { formatDate } from "@/utils/date";
import { FailedDatasetTest, NightlyDatasetTestResponse } from "@/interfaces/NightlyDatasetTest";

interface Sort {
    key: string;
    direction: string;
}

type StatColor = "info" | "success" | "error";

const TRANSLATION_PATH = "pages.account.profile.searchAdmin";

const HTTP_STATUS_MESSAGES: { [statusCode: number]: string } = {
    400: "Bad Request",
    401: "Unauthorized",
    403: "Forbidden",
    404: "Not Found",
    408: "Request Timeout",
    429: "Too Many Requests",
    500: "Internal Server Error",
    502: "Bad Gateway",
    503: "Service Unavailable",
    504: "Gateway Timeout",
};

const statusLabel = (statusCode: number | null) => {
    if (statusCode === null) return "No response";
    const message = HTTP_STATUS_MESSAGES[statusCode];
    return message ? `${statusCode} ${message}` : `${statusCode}`;
};

const getColumns = (
    sort: Sort,
    setSort: (sort: Sort) => void
): ColumnDef<FailedDatasetTest>[] => [
    {
        id: "datasetId",
        header: "Dataset ID",
        cell: ({ row: { original } }) => (
            <Link href={`/${RouteName.DATASET_ITEM}/${original.datasetId}`}>
                {original.datasetId}
            </Link>
        ),
    },
    {
        id: "statusCode",
        header: () => (
            <Box
                sx={{
                    p: 0,
                    display: "flex",
                    alignItems: "center",
                }}>
                Status code
                <SortIcon
                    sort={sort}
                    setSort={setSort}
                    sortKey="statusCode"
                    ariaLabel="Sort by status code"
                />
            </Box>
        ),
        cell: ({ row: { original } }) => (
            <Chip
                size="small"
                color="error"
                label={statusLabel(original.statusCode)}
            />
        ),
    },
    {
        id: "checkedAt",
        header: "Last checked",
        cell: ({ row: { original } }) =>
            formatDate(original.checkedAt, "DD/MM/YYYY HH:mm"),
    },
];

const StatTile = ({
    icon,
    color,
    label,
    value,
    children,
}: {
    icon: ReactNode;
    color: StatColor;
    label: string;
    value: ReactNode;
    children?: ReactNode;
}) => (
    <Paper
        variant="outlined"
        sx={{
            p: 2,
            flex: 1,
            minWidth: 200,
            borderTop: 3,
            borderColor: `${color}.main`,
        }}>
        <Box sx={{ p: 0, display: "flex", alignItems: "center", gap: 1.5 }}>
            <Avatar
                sx={{
                    bgcolor: `${color}.main`,
                    width: 36,
                    height: 36,
                }}>
                {icon}
            </Avatar>
            <Box sx={{ p: 0 }}>
                <Typography variant="body2" color="text.secondary">
                    {label}
                </Typography>
                <Typography variant="h3" sx={{ lineHeight: 1.2 }}>
                    {value}
                </Typography>
            </Box>
        </Box>
        {children}
    </Paper>
);

export default function NightlyDatasetTestsTab() {
    const t = useTranslations(TRANSLATION_PATH);
    const { data, isLoading } = useGet<NightlyDatasetTestResponse>(
        apis.nightlyDatasetTestsV2Url
    );

    const [sort, setSort] = useState<Sort>({
        key: "statusCode",
        direction: "asc",
    });

    const failedDatasets = useMemo(() => {
        const list = data?.failedDatasets ?? [];

        if (sort.key !== "statusCode") return list;

        return [...list].sort((a, b) => {
            const diff = (a.statusCode ?? 0) - (b.statusCode ?? 0);
            return sort.direction === "asc" ? diff : -diff;
        });
    }, [data, sort]);

    const columns = useMemo(() => getColumns(sort, setSort), [sort]);

    const failureBreakdown = useMemo(() => {
        const counts = new Map<number | null, number>();

        (data?.failedDatasets ?? []).forEach(({ statusCode }) => {
            counts.set(statusCode, (counts.get(statusCode) ?? 0) + 1);
        });

        return [...counts.entries()]
            .sort(([, a], [, b]) => b - a)
            .map(([statusCode, count]) => ({ statusCode, count }));
    }, [data]);

    if (isLoading) {
        return (
            <Paper variant="outlined" sx={{ p: 2 }}>
                <Skeleton variant="rounded" height={40} sx={{ mb: 1 }} />
                <Skeleton variant="rounded" height={40} />
            </Paper>
        );
    }

    return (
        <Box sx={{ p: 0 }}>
            <Alert severity="info" sx={{ mb: 3 }}>
                {t("nightlyTestsDisclaimer")}
            </Alert>

            <Box
                sx={{
                    display: "flex",
                    gap: 2,
                    mb: 3,
                    flexWrap: "wrap",
                }}>
                <StatTile
                    icon={<SearchRoundedIcon fontSize="small" />}
                    color="info"
                    label={t("nightlyTestsTotalChecked")}
                    value={data?.summary.totalChecked ?? 0}
                />
                <StatTile
                    icon={<CheckCircleIcon fontSize="small" />}
                    color="success"
                    label={t("nightlyTestsTotalSuccessful")}
                    value={data?.summary.totalSuccessful ?? 0}
                />
                <StatTile
                    icon={<ErrorIcon fontSize="small" />}
                    color="error"
                    label={t("nightlyTestsTotalFailed")}
                    value={data?.summary.totalFailed ?? 0}>
                    {failureBreakdown.length > 0 && (
                        <>
                            <Divider sx={{ my: 1.5 }} />
                            <Box sx={{ p: 0 }}>
                                {failureBreakdown.map(
                                    ({ statusCode, count }, index) => (
                                        <Box
                                            key={statusCode ?? "null"}
                                            sx={{
                                                p: 0,
                                                display: "flex",
                                                justifyContent:
                                                    "space-between",
                                                gap: 1,
                                                mt: index === 0 ? 0 : 0.5,
                                            }}>
                                            <Typography
                                                variant="body2"
                                                color="text.secondary"
                                                sx={{
                                                    overflow: "hidden",
                                                    textOverflow: "ellipsis",
                                                    whiteSpace: "nowrap",
                                                }}>
                                                {statusLabel(statusCode)}
                                            </Typography>
                                            <Typography
                                                variant="body2"
                                                sx={{ fontWeight: 600 }}>
                                                {count}
                                            </Typography>
                                        </Box>
                                    )
                                )}
                            </Box>
                        </>
                    )}
                </StatTile>
                <StatTile
                    icon={<PercentIcon fontSize="small" />}
                    color="error"
                    label={t("nightlyTestsPercentageFailed")}
                    value={`${data?.summary.percentageFailed ?? 0}%`}
                />
            </Box>

            <Typography variant="h3" sx={{ mb: 2 }}>
                {t("nightlyTestsFailedTitle")}
            </Typography>

            {failedDatasets.length === 0 ? (
                <Paper variant="outlined" sx={{ p: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                        {t("nightlyTestsNoFailures")}
                    </Typography>
                </Paper>
            ) : (
                <div style={{ marginBlock: 10 }}>
                    <Table<FailedDatasetTest>
                        columns={columns}
                        rows={failedDatasets}
                        style={{
                            width: "100%",
                            borderCollapse: "collapse",
                            tableLayout: "auto",
                        }}
                    />
                </div>
            )}
        </Box>
    );
}
