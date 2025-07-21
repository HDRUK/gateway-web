"use client";

import { TableContainer } from "@mui/material";
import { ColumnDef } from "@tanstack/react-table";
import { CohortRequest, Log } from "@/interfaces/CohortRequest";
import Accordion from "@/components/Accordion";
import Scrollbar from "@/components/Scrollbar";
import Table from "@/components/Table";
import Typography from "@/components/Typography";
import { formatDate } from "@/utils/date";

interface DecisionHistoryProps {
    cohortRequest: CohortRequest;
}

const getColumns = (): ColumnDef<Log>[] => {
    return [
        {
            id: "request_status",
            cell: ({ row: { original } }) => {
                return (
                    <Typography color="GrayText">
                        {original.request_status}
                    </Typography>
                );
            },
            header: () => <div>Cohort Request Status</div>,
            size: 60,
        },
        {
            id: "nhse_sde_request_status",
            cell: ({ row: { original } }) => {
                return (
                    <Typography color="GrayText">
                        {original.nhse_sde_request_status}
                    </Typography>
                );
            },
            header: () => <div>NHSE SDE Request Status</div>,
            size: 80,
        },
        {
            id: "updated_at",
            cell: ({ row: { original } }) => {
                return (
                    <Typography color="GrayText">
                        {formatDate(original.updated_at, "DD/MM/YYYY")}
                    </Typography>
                );
            },
            header: () => <div>Updated at</div>,
            size: 60,
        },
        {
            id: "details",
            cell: ({ row: { original } }) => {
                return (
                    <Typography color="GrayText">{original.details}</Typography>
                );
            },
            header: () => <span>Details</span>,
        },
    ];
};

const DecisionHistory = ({ cohortRequest }: DecisionHistoryProps) => {
    return (
        <Accordion
            heading={<Typography>Show decision history</Typography>}
            contents={
                <Scrollbar height="400px">
                    <TableContainer>
                        <Table<Log>
                            columns={getColumns()}
                            rows={cohortRequest.logs.map(log => {
                                const reversedLog = log;
                                reversedLog.id = -reversedLog.id;
                                return reversedLog;
                            })}
                        />
                    </TableContainer>
                </Scrollbar>
            }
        />
    );
};

export default DecisionHistory;
