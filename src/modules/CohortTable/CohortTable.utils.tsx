import Box from "@/components/Box";
import Chip from "@/components/Chip";
import Link from "@/components/Link";
import TooltipIcon from "@/components/TooltipIcon";
import {
    ArrowDropDownIcon,
    ArrowDropUpIcon,
    SortByAlphaIcon,
    WarningIcon,
} from "@/consts/icons";
import { CohortRequest, CohortRequestStatus } from "@/interfaces/CohortRequest";
import { formatDate } from "@/utils/date";
import { capitalise } from "@/utils/general";
import { IconButton, Typography } from "@mui/material";
import { ColumnDef } from "@tanstack/react-table";
import { CohortStatusPopover } from "./CohortStatusPopover";

import differenceInDays from "date-fns/differenceInDays";

import {
    statusMapping,
    COHORT_DISCOVERY_EXPIRY_WARNING_DAYS,
} from "@/consts/cohortDiscovery";

interface getColumnsProps {
    sort: { key: string; direction: string };
    setSort: (sort: { key: string; direction: string }) => void;
    setRequestStatus: (status: CohortRequestStatus) => void;
    requestStatus?: CohortRequestStatus;
}

const updateSort =
    (key: string) => (prev: { key: string; direction: string }) => ({
        ...prev,
        key,
        direction:
            prev.key === key
                ? prev.direction === "asc"
                    ? "desc"
                    : "asc"
                : "asc",
    });

const getColumns = ({
    setSort,
    sort,
    setRequestStatus,
    requestStatus,
}: getColumnsProps): ColumnDef<CohortRequest>[] => {
    return [
        {
            id: "name",
            header: () => (
                <Box
                    sx={{
                        p: 0,
                        justifyContent: "space-between",
                        display: "flex",
                        alignItems: "center",
                    }}
                    textAlign="left">
                    Name
                    <IconButton
                        sx={{ p: 0 }}
                        disableRipple
                        size="large"
                        edge="start"
                        aria-label="Sort by name"
                        onClick={() => {
                            setSort(updateSort("name"));
                        }}>
                        <SortByAlphaIcon />
                    </IconButton>
                </Box>
            ),
            cell: ({ row: { original } }) => (
                <>
                    <Link
                        sx={{ textDecoration: "none", fontWeight: "bold" }}
                        href={`/account/cohort-discovery-admin/${original.id}`}>
                        {original.user.name}
                    </Link>

                    <Typography color="GrayText">
                        {original.user.email}
                    </Typography>
                </>
            ),
        },
        {
            id: "Organisation",
            header: () => (
                <Box
                    sx={{
                        p: 0,
                        justifyContent: "space-between",
                        display: "flex",
                        alignItems: "center",
                    }}
                    textAlign="left">
                    Organisation
                    <IconButton
                        sx={{ p: 0 }}
                        disableRipple
                        size="large"
                        edge="start"
                        aria-label="Sort by organisation"
                        onClick={() => setSort(updateSort("organisation"))}>
                        <SortByAlphaIcon />
                    </IconButton>
                </Box>
            ),
            cell: ({ row: { original } }) => (
                <Typography color="GrayText">
                    {original.user.organisation}
                </Typography>
            ),
        },
        {
            id: "status",
            header: () => (
                <Box
                    sx={{
                        p: 0,
                        justifyContent: "space-between",
                        display: "flex",
                        alignItems: "center",
                    }}
                    textAlign="left">
                    Status
                    <CohortStatusPopover
                        setRequestStatus={setRequestStatus}
                        requestStatus={requestStatus}
                    />
                </Box>
            ),
            cell: ({ row: { original } }) => (
                <div style={{ textAlign: "center" }}>
                    <Chip
                        size="small"
                        label={capitalise(original.request_status)}
                        color={statusMapping[original.request_status]}
                    />
                </div>
            ),
        },
        {
            id: "dateRequested",
            header: () => (
                <Box
                    sx={{
                        p: 0,
                        justifyContent: "space-between",
                        display: "flex",
                        alignItems: "center",
                    }}
                    textAlign="left">
                    Date requested
                    <IconButton
                        sx={{ p: 0 }}
                        disableRipple
                        size="large"
                        edge="start"
                        aria-label="Date requested"
                        onClick={() => setSort(updateSort("created_at"))}>
                        {sort.key === "created_at" &&
                        sort.direction !== "asc" ? (
                            <ArrowDropUpIcon />
                        ) : (
                            <ArrowDropDownIcon />
                        )}
                    </IconButton>
                </Box>
            ),
            accessorFn: (row: CohortRequest) =>
                `${formatDate(new Date(row.created_at), "dd/MM/yyyy")}`,
        },
        {
            id: "dateAction",
            header: () => (
                <Box
                    sx={{
                        p: 0,
                        justifyContent: "space-between",
                        display: "flex",
                        alignItems: "center",
                    }}
                    textAlign="left">
                    <TooltipIcon
                        label="Date Actioned"
                        content={
                            <div>
                                This is the date for the latest status update
                                for this user
                            </div>
                        }
                    />{" "}
                    <IconButton
                        sx={{ p: 0 }}
                        disableRipple
                        size="large"
                        edge="start"
                        aria-label="Date Actioned"
                        onClick={() => setSort(updateSort("updated_at"))}>
                        {sort.key === "updated_at" &&
                        sort.direction !== "asc" ? (
                            <ArrowDropUpIcon />
                        ) : (
                            <ArrowDropDownIcon />
                        )}
                    </IconButton>
                </Box>
            ),
            cell: ({ row }) => {
                const actionedDate = new Date(row.original.updated_at);
                const currentDate = new Date();

                const showWarning =
                    row.original.request_status == "APPROVED" &&
                    differenceInDays(currentDate, actionedDate) >
                        COHORT_DISCOVERY_EXPIRY_WARNING_DAYS;

                const hasExpired = row.original.request_status == "EXPIRED";

                const toolTipMessage = hasExpired
                    ? "This user’s access is expired"
                    : showWarning
                    ? "This user access is close to expiration date"
                    : "";

                return (
                    <Box display="flex" alignItems="center" sx={{ p: 0 }}>
                        {formatDate(actionedDate, "dd/MM/yyyy")}
                        {(showWarning || hasExpired) && (
                            <TooltipIcon
                                label=""
                                boxSx={{
                                    justifyContent: "start",
                                    p: 0,
                                }}
                                content={<div>{toolTipMessage}</div>}
                                icon={
                                    <IconButton
                                        sx={{ p: 0 }}
                                        size="large"
                                        aria-label="warning"
                                        color={
                                            hasExpired ? "error" : "warning"
                                        }>
                                        <WarningIcon />
                                    </IconButton>
                                }
                            />
                        )}
                    </Box>
                );
            },
        },
    ];
};

export { getColumns };
