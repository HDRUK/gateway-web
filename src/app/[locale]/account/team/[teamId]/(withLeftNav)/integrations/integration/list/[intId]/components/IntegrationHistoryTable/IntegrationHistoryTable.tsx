"use client";

import { useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
    Typography,
} from "@mui/material";
import { useParams } from "next/navigation";
import {
    FailedDataset,
    IntegrationHistory,
} from "@/interfaces/IntegrationHistory";
import { tokens } from "@hdruk/ui/theme";
import { PaginationType } from "@/interfaces/Pagination";
import Box from "@/components/Box";
import Loading from "@/components/Loading";
import Pagination from "@/components/Pagination";
import Paper from "@/components/Paper";
import TickCrossIcon from "@/components/TickCrossIcon";
import useGet from "@/hooks/useGet";
import apis from "@/config/apis";
import { colors } from "@/config/theme";
import { formatDate } from "@/utils/date";

const PER_PAGE = 25;

const historyKey = (history: IntegrationHistory) =>
    `${history.job_uuid}-${history.started_at}`;

interface FailedDatasetDetailsProps {
    message: string | null;
    failedDatasets: FailedDataset[];
    showHeading?: boolean;
}

const FailedDatasetDetails = ({
    message,
    failedDatasets,
    showHeading,
}: FailedDatasetDetailsProps) => (
    <>
        <Typography color={colors.red600} sx={showHeading ? { mt: 2 } : undefined}>
            {message}
        </Typography>
        {showHeading && failedDatasets.length > 0 && (
            <Typography sx={{ mt: 2 }}>Failed datasets:</Typography>
        )}
        {failedDatasets.map(failedDataset => (
            <Typography
                key={failedDataset.pid}
                color={colors.red600}
                sx={showHeading ? { mt: 1 } : undefined}>
                {failedDataset.pid}: {failedDataset.message}
            </Typography>
        ))}
    </>
);

const IntegrationHistoryTable = () => {
    const params = useParams<{ teamId: string; intId: string }>();
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedKey, setSelectedKey] = useState<string | null>(null);

    const queryParams = new URLSearchParams({
        page: currentPage.toString(),
        per_page: PER_PAGE.toString(),
    });

    const { data, isLoading } = useGet<PaginationType<IntegrationHistory>>(
        params?.teamId && params?.intId
            ? `${apis.teamsV1Url}/${params.teamId}/federations/${params.intId}/history?${queryParams}`
            : null,
        { withPagination: true, keepPreviousData: true }
    );

    const { lastPage, list, total } = data || {};

    if (isLoading && !list) return <Loading />;

    if (!list || total === 0) {
        return (
            <Box>
                <Typography>No history found for this integration.</Typography>
            </Box>
        );
    }

    const selected = list.find(x => historyKey(x) === selectedKey);

    const rows = list.map(x => (
        <TableRow
            key={historyKey(x)}
            onClick={() => setSelectedKey(historyKey(x))}
            sx={{
                cursor: "pointer",
                ...(historyKey(x) === selectedKey && {
                    backgroundColor: tokens.background.success,
                }),
            }}>
            <TableCell>{formatDate(x.started_at, "DD MMM YYYY HH:mm")}</TableCell>
            <TableCell>{formatDate(x.finished_at, "DD MMM YYYY HH:mm")}</TableCell>
            <TableCell>
                <TickCrossIcon isTrue={x.status === "success"} />
            </TableCell>
            <TableCell>
                {x.status === "failed" && (
                    <FailedDatasetDetails
                        message={x.message}
                        failedDatasets={x.failed_datasets}
                    />
                )}
            </TableCell>
        </TableRow>
    ));

    return (
        <Box
            sx={{
                p: 0,
                gap: 1,
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
            }}>
            <Paper sx={{ gridColumn: "span 2" }}>
                <Typography variant="h3" sx={{ mb: 1 }}>
                    Recent executions
                </Typography>
                <TableContainer sx={{ width: "100%" }}>
                    <Table>
                        <TableBody>{rows}</TableBody>
                    </Table>
                </TableContainer>
                <Pagination
                    isLoading={isLoading}
                    page={currentPage}
                    count={lastPage}
                    onChange={(e: React.ChangeEvent<unknown>, page: number) => {
                        setCurrentPage(page);
                        setSelectedKey(null);
                    }}
                />
            </Paper>
            <Box
                data-testid="integration-history-detail"
                sx={{
                    p: 3,
                    background: tokens.text.primaryBlack,
                    color: tokens.text.primaryWhite,
                }}>
                {!selected ? (
                    <Typography sx={{ textAlign: "center" }}>
                        Select an execution to view details.
                    </Typography>
                ) : (
                    <>
                        <Typography fontSize={10} color={tokens.text.secondaryWhite}>
                            {formatDate(selected.started_at, "DD MMM YYYY HH:mm")}
                        </Typography>
                        <Box
                            sx={{
                                p: 0,
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                            }}>
                            <Typography>
                                {selected.status === "success"
                                    ? "Complete"
                                    : "Failed"}
                            </Typography>
                            <TickCrossIcon isTrue={selected.status === "success"} />
                        </Box>
                        {selected.status === "failed" && (
                            <FailedDatasetDetails
                                message={selected.message}
                                failedDatasets={selected.failed_datasets}
                                showHeading
                            />
                        )}
                    </>
                )}
            </Box>
        </Box>
    );
};

export default IntegrationHistoryTable;
