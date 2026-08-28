"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { ColumnDef } from "@tanstack/react-table";
import { Skeleton, TextField } from "@mui/material";
import Box from "@/components/Box";
import Paper from "@/components/Paper";
import Typography from "@/components/Typography";
import Link from "@/components/Link";
import { Button } from "@hdruk/ui";
import SortIcon from "@/components/SortIcon";
import Table from "@/components/Table";
import useGet from "@/hooks/useGet";
import apis from "@/config/apis";
import { RouteName } from "@/consts/routeName";
import { ErrorIcon, DownloadIcon } from "@/consts/icons";
import { downloadFile } from "@/utils/download";
import { DatasetLinkCheckResult } from "@/interfaces/DatasetLinkCheckResult";

const CSV_HEADERS = ["Team ID", "Team Name", "Dataset ID", "URL", "Status"];

const escapeCsvField = (value: string): string => {
    if (!/[",\n]/.test(value)) return value;
    return `"${value.replace(/"/g, '""')}"`;
};

const buildCsv = (results: DatasetLinkCheckResult[]): string => {
    const rows = results.map(result =>
        [
            result.teamId ?? "",
            result.teamName ?? "",
            result.datasetId,
            result.url,
            "404 Not Found",
        ]
            .map(value => escapeCsvField(String(value)))
            .join(",")
    );

    return [CSV_HEADERS.join(","), ...rows].join("\n");
};

interface Sort {
    key: string;
    direction: string;
}

const TRANSLATION_PATH = "pages.account.profile.searchAdmin";

const getColumns = (
    sort: Sort,
    setSort: (sort: Sort) => void
): ColumnDef<DatasetLinkCheckResult>[] => [
    {
        id: "teamId",
        header: () => (
            <Box sx={{ p: 0, display: "flex", alignItems: "center" }}>
                Team ID
                <SortIcon
                    sort={sort}
                    setSort={setSort}
                    sortKey="teamId"
                    ariaLabel="Sort by team ID"
                />
            </Box>
        ),
        cell: ({ row: { original } }) => original.teamId ?? "-",
    },
    {
        id: "teamName",
        header: () => (
            <Box sx={{ p: 0, display: "flex", alignItems: "center" }}>
                Team name
                <SortIcon
                    sort={sort}
                    setSort={setSort}
                    sortKey="teamName"
                    ariaLabel="Sort by team name"
                />
            </Box>
        ),
        cell: ({ row: { original } }) => original.teamName ?? "-",
    },
    {
        id: "datasetId",
        header: () => (
            <Box sx={{ p: 0, display: "flex", alignItems: "center" }}>
                Dataset ID
                <SortIcon
                    sort={sort}
                    setSort={setSort}
                    sortKey="datasetId"
                    ariaLabel="Sort by dataset ID"
                />
            </Box>
        ),
        cell: ({ row: { original } }) => (
            <Link href={`/${RouteName.DATASET_ITEM}/${original.datasetId}`}>
                {original.datasetId}
            </Link>
        ),
    },
    {
        id: "url",
        header: "URL",
        cell: ({ row: { original } }) => (
            <a href={original.url} target="_blank" rel="noreferrer">
                {original.url}
            </a>
        ),
    },
    {
        id: "failed",
        header: "Status",
        cell: () => (
            <ErrorIcon
                color="error"
                fontSize="small"
                titleAccess="Confirmed 404 — page not found"
            />
        ),
    },
];

export default function DatasetLinkCheckResultsTab() {
    const t = useTranslations(TRANSLATION_PATH);
    const { data, isLoading } = useGet<DatasetLinkCheckResult[]>(
        apis.datasetLinkCheckResultsV2Url
    );

    const [search, setSearch] = useState("");
    const [sort, setSort] = useState<Sort>({
        key: "teamName",
        direction: "asc",
    });

    const results = useMemo(() => {
        const list = data ?? [];
        const term = search.trim().toLowerCase();

        const filtered = term
            ? list.filter(result =>
                  (result.teamName ?? "").toLowerCase().includes(term)
              )
            : list;

        return [...filtered].sort((a, b) => {
            const aValue = a[sort.key as keyof DatasetLinkCheckResult] ?? "";
            const bValue = b[sort.key as keyof DatasetLinkCheckResult] ?? "";

            let diff = 0;
            if (typeof aValue === "number" && typeof bValue === "number") {
                diff = aValue - bValue;
            } else {
                diff = String(aValue).localeCompare(String(bValue));
            }

            return sort.direction === "asc" ? diff : -diff;
        });
    }, [data, search, sort]);

    const columns = useMemo(() => getColumns(sort, setSort), [sort]);

    const handleExport = () => {
        downloadFile({
            content: buildCsv(results),
            type: "text/csv;charset=utf-8;",
            filename: `dataset-link-check-results-${new Date().toISOString().slice(0, 10)}.csv`,
        });
    };

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
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {t("datasetLinkCheckDisclaimer")}
            </Typography>

            <Box
                sx={{
                    p: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 2,
                    mb: 2,
                }}>
                <TextField
                    size="small"
                    placeholder={t("datasetLinkCheckSearchPlaceholder")}
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    sx={{ width: 320 }}
                />

                <Button
                    variant="outlined"
                    size="small"
                    startIcon={<DownloadIcon />}
                    disabled={results.length === 0}
                    onClick={handleExport}>
                    {t("datasetLinkCheckExportButton")}
                </Button>
            </Box>

            {results.length === 0 ? (
                <Paper variant="outlined" sx={{ p: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                        {search
                            ? t("datasetLinkCheckNoSearchResults")
                            : t("datasetLinkCheckNoFailures")}
                    </Typography>
                </Paper>
            ) : (
                <div style={{ marginBlock: 10 }}>
                    <Table<DatasetLinkCheckResult>
                        columns={columns}
                        rows={results}
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
