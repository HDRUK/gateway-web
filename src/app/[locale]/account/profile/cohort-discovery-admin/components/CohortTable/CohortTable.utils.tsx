import { IconButton, Typography } from "@mui/material";
import { ColumnDef } from "@tanstack/react-table";
import { CohortRequest, CohortRequestStatus } from "@/interfaces/CohortRequest";
import { Workgroup } from "@/interfaces/Workgroup";
import Box from "@/components/Box";
import Chip from "@/components/Chip";
import FilterPopover from "@/components/FilterPopover";
import Link from "@/components/Link";
import SortIcon from "@/components/SortIcon";
import TooltipIcon from "@/components/TooltipIcon";
import {
    statusMapping,
    NHSSDEStatusMapping,
    COHORT_DISCOVERY_EXPIRY_WARNING_DAYS,
    COHORT_DISCOVERY_SDE_EXPIRY_WARNING_DAYS,
} from "@/consts/cohortDiscovery";
import { SHORT_DATE_FORMAT } from "@/consts/date";
import { SortByAlphaIcon, WarningIcon } from "@/consts/icons";
import { RouteName } from "@/consts/routeName";
import { formatDate, differenceInDays } from "@/utils/date";
import { capitalise } from "@/utils/general";

interface getColumnsProps {
    sort: { key: string; direction: string };
    setSort: (sort: { key: string; direction: string }) => void;
    setRequestStatus: (status: string) => void;
    requestStatus?: CohortRequestStatus;
    translations: { [id: string]: string };
    features: { [id: string]: string };
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

const statusRadios = [
    { label: "All", value: "" },
    { label: "Approved", value: "APPROVED" },
    { label: "Pending", value: "PENDING" },
    { label: "Rejected", value: "REJECTED" },
    { label: "Banned", value: "BANNED" },
    { label: "Suspended", value: "SUSPENDED" },
    { label: "Expired", value: "EXPIRED" },
];

const showAlert = (
    date: string,
    status: string,
    translations: { [id: string]: string },
    warning_days: number
) => {
    const actionedDate = new Date(date);
    const currentDate = new Date();

    const showWarning =
        status === "APPROVED" &&
        differenceInDays(currentDate, actionedDate) > warning_days;

    const hasExpired = status === "EXPIRED";

    const toolTipMessage = hasExpired
        ? translations.accountExpired
        : showWarning
        ? translations.expiryWarning
        : "";

    const showToolTip = hasExpired || showWarning;

    return { showToolTip, toolTipMessage, hasExpired };
};

const getColumns = ({
    setSort,
    sort,
    setRequestStatus,
    requestStatus,
    translations,
    features,
}: getColumnsProps): ColumnDef<CohortRequest>[] => {
    const { isCohortDiscoveryServiceEnabled } = features;

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
                        href={`/${RouteName.ACCOUNT}/${RouteName.PROFILE}/${RouteName.COHORT_DISCOVERY_ADMIN}/${original.id}`}>
                        {original.user.name}
                    </Link>

                    <Typography color="GrayText">
                        {original.user.email}
                    </Typography>
                </>
            ),
        },
        {
            id: "secondary_email",
            header: () => (
                <Box
                    sx={{
                        p: 0,
                        justifyContent: "space-between",
                        display: "flex",
                        alignItems: "center",
                    }}
                    textAlign="left">
                    Secondary Email
                </Box>
            ),
            cell: ({ row: { original } }) => (
                <Typography color="GrayText">
                    {original.user.secondary_email}
                </Typography>
            ),
        },
        {
            id: "sector",
            header: () => (
                <Box
                    sx={{
                        p: 0,
                        justifyContent: "space-between",
                        display: "flex",
                        alignItems: "center",
                    }}
                    textAlign="left">
                    Sector
                    <IconButton
                        sx={{ p: 0 }}
                        disableRipple
                        size="large"
                        edge="start"
                        aria-label="Sort by sector"
                        onClick={() => {
                            setSort(updateSort("sector"));
                        }}>
                        <SortByAlphaIcon />
                    </IconButton>
                </Box>
            ),
            cell: ({ row: { original } }) => (
                <Typography color="GrayText">
                    {original.user.sector?.name}
                </Typography>
            ),
        },
        {
            id: "organisation",
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
                    Cohort Status
                    <FilterPopover
                        name="request_status"
                        radios={statusRadios}
                        setFilter={setRequestStatus}
                        filter={requestStatus}
                    />
                </Box>
            ),
            cell: ({ row: { original } }) =>
                original.request_status && (
                    <div style={{ textAlign: "center" }}>
                        <Chip
                            size="small"
                            label={capitalise(original.request_status || "")}
                            color={statusMapping[original.request_status]}
                        />
                    </div>
                ),
        },
        ...(isCohortDiscoveryServiceEnabled
            ? [
                  {
                      id: "workgroups",
                      header: () => (
                          <Box
                              sx={{
                                  p: 0,
                                  justifyContent: "space-between",
                                  display: "flex",
                                  alignItems: "center",
                              }}
                              textAlign="left">
                              Workgroups
                              <SortIcon
                                  setSort={setSort}
                                  sort={sort}
                                  sortKey="workgroups"
                                  ariaLabel="Workgroups"
                              />
                          </Box>
                      ),
                      accessorFn: row => row.user.workgroups,
                      cell: ({ cell }) => {
                          const workgroups = cell.getValue<Workgroup[]>();
                          return (
                              <Box
                                  sx={{
                                      display: "flex",
                                      flexWrap: "wrap",
                                      gap: 1,
                                  }}>
                                  {workgroups?.map(wg => (
                                      <Chip key={wg.name} label={wg.name} />
                                  ))}
                              </Box>
                          );
                      },
                  } as ColumnDef<CohortRequest>,
              ]
            : []),
        {
            id: "accessToEnv",
            header: () => (
                <Box
                    sx={{
                        p: 0,
                        justifyContent: "space-between",
                        display: "flex",
                        alignItems: "center",
                    }}
                    textAlign="left">
                    Access to Environment
                    <SortIcon
                        setSort={setSort}
                        sort={sort}
                        sortKey="access_to_env"
                        ariaLabel="Access to environment"
                    />
                </Box>
            ),
            cell: ({ row: { original } }) => (
                <Typography color="GrayText">
                    {original.access_to_env}
                </Typography>
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
                    Cohort Date Requested
                    <SortIcon
                        setSort={setSort}
                        sort={sort}
                        sortKey="created_at"
                        ariaLabel="Date requested"
                    />
                </Box>
            ),
            accessorFn: (row: CohortRequest) =>
                `${formatDate(row.created_at, "DD/MM/YYYY")}`,
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
                        label="Cohort Date Actioned"
                        content={translations.dateActionedTooltip}
                    />{" "}
                    <SortIcon
                        setSort={setSort}
                        sort={sort}
                        sortKey="updated_at"
                        ariaLabel="Date Actioned"
                    />
                </Box>
            ),
            cell: ({ row }) => {
                const { showToolTip, toolTipMessage, hasExpired } = showAlert(
                    row.original.updated_at,
                    row.original.request_status,
                    translations,
                    COHORT_DISCOVERY_EXPIRY_WARNING_DAYS
                );

                return (
                    <Box display="flex" alignItems="center" sx={{ p: 0 }}>
                        {formatDate(row.original.updated_at, "DD/MM/YYYY")}
                        {showToolTip && (
                            <TooltipIcon
                                label=""
                                boxSx={{
                                    justifyContent: "start",
                                    p: 0,
                                }}
                                content={<div>{toolTipMessage}</div>}
                                icon={
                                    <WarningIcon
                                        color={hasExpired ? "error" : "warning"}
                                    />
                                }
                            />
                        )}
                    </Box>
                );
            },
        },
        {
            id: "updated_at",
            header: () => (
                <Box
                    sx={{
                        p: 0,
                        justifyContent: "space-between",
                        display: "flex",
                        alignItems: "center",
                    }}
                    textAlign="left">
                    Profile Updated At
                    <SortIcon
                        setSort={setSort}
                        sort={sort}
                        sortKey="updated_at"
                        ariaLabel="Date requested"
                    />
                </Box>
            ),
            cell: ({ row: { original } }) => (
                <Typography color="GrayText">
                    {formatDate(original.user.updated_at, "DD/MM/YYYY")}
                </Typography>
            ),
        },
        {
            id: "nhse_sde_request_status",
            header: () => (
                <Box
                    sx={{
                        p: 0,
                        justifyContent: "space-between",
                        display: "flex",
                        alignItems: "center",
                    }}
                    textAlign="left">
                    NHSE SDE Status
                    <SortIcon
                        setSort={setSort}
                        sort={sort}
                        sortKey="nhse_sde_request_status"
                        ariaLabel="NHSE SDE Status"
                    />
                </Box>
            ),
            cell: ({ row: { original } }) =>
                original.nhse_sde_request_status && (
                    <div style={{ textAlign: "center" }}>
                        <Chip
                            size="small"
                            label={capitalise(
                                original.nhse_sde_request_status.replace(
                                    "_",
                                    " "
                                )
                            )}
                            color={
                                NHSSDEStatusMapping[
                                    original.nhse_sde_request_status
                                ]
                            }
                        />
                    </div>
                ),
        },
        {
            id: "nhse_sde_requested_at",
            header: () => (
                <Box
                    sx={{
                        p: 0,
                        justifyContent: "space-between",
                        display: "flex",
                        alignItems: "center",
                    }}
                    textAlign="left">
                    First Applied to NHSE SDE
                    <SortIcon
                        setSort={setSort}
                        sort={sort}
                        sortKey="nhse_sde_requested_at"
                        ariaLabel="Date First Applied to NHSE SDE"
                    />
                </Box>
            ),
            cell: ({ row: { original } }) => (
                <Typography>
                    {formatDate(
                        original.nhse_sde_requested_at,
                        SHORT_DATE_FORMAT
                    )}
                </Typography>
            ),
        },
        {
            id: "nhse_sde_self_declared_approved_at",
            header: () => (
                <Box
                    sx={{
                        p: 0,
                        justifyContent: "space-between",
                        display: "flex",
                        alignItems: "center",
                    }}
                    textAlign="left">
                    NHSE SDE Self-Declared Approval
                    <SortIcon
                        setSort={setSort}
                        sort={sort}
                        sortKey="nhse_sde_self_declared_approved_at"
                        ariaLabel="Date Self-Declared Approval By NHSE SDE"
                    />
                </Box>
            ),
            cell: ({ row: { original } }) => (
                <Typography>
                    {formatDate(
                        original.nhse_sde_self_declared_approved_at,
                        "DD/MM/YYYY"
                    )}
                </Typography>
            ),
        },
        {
            id: "nhse_sde_request_expire_at",
            header: () => (
                <Box
                    sx={{
                        p: 0,
                        justifyContent: "space-between",
                        display: "flex",
                        alignItems: "center",
                    }}
                    textAlign="left">
                    NHSE SDE Expires At
                    <SortIcon
                        setSort={setSort}
                        sort={sort}
                        sortKey="nhse_sde_request_expire_at"
                        ariaLabel="Date NHSE SDE Expiry"
                    />
                </Box>
            ),
            // TODO: it's a bit wonky that we don't actually use the expiry date in
            // calculating the alert.
            cell: ({ row }) => {
                const { showToolTip, toolTipMessage, hasExpired } = showAlert(
                    row.original.nhse_sde_updated_at,
                    row.original.nhse_sde_request_status,
                    translations,
                    COHORT_DISCOVERY_SDE_EXPIRY_WARNING_DAYS
                );

                return (
                    <Box display="flex" alignItems="center" sx={{ p: 0 }}>
                        {formatDate(
                            row.original.nhse_sde_request_expire_at,
                            "DD/MM/YYYY"
                        )}
                        {showToolTip && (
                            <TooltipIcon
                                label=""
                                boxSx={{
                                    justifyContent: "start",
                                    p: 0,
                                }}
                                content={<div>{toolTipMessage}</div>}
                                icon={
                                    <WarningIcon
                                        color={hasExpired ? "error" : "warning"}
                                    />
                                }
                            />
                        )}
                    </Box>
                );
            },
        },
        {
            id: "nhse_sde_updated_at",
            header: () => (
                <Box
                    sx={{
                        p: 0,
                        justifyContent: "space-between",
                        display: "flex",
                        alignItems: "center",
                    }}
                    textAlign="left">
                    NHSE SDE Updated At
                    <SortIcon
                        setSort={setSort}
                        sort={sort}
                        sortKey="nhse_sde_updated_at"
                        ariaLabel="Date NHSE SDE Updated"
                    />
                </Box>
            ),
            cell: ({ row: { original } }) => (
                <Typography>
                    {formatDate(original.nhse_sde_updated_at, "DD/MM/YYYY")}
                </Typography>
            ),
        },
        {
            id: "domain",
            header: () => (
                <Box
                    sx={{
                        p: 0,
                        justifyContent: "space-between",
                        display: "flex",
                        alignItems: "center",
                    }}
                    textAlign="left">
                    Domain
                </Box>
            ),
            cell: ({ row: { original } }) => (
                <Typography color="GrayText">{original.user.domain}</Typography>
            ),
        },
        {
            id: "link",
            header: () => (
                <Box
                    sx={{
                        p: 0,
                        justifyContent: "space-between",
                        display: "flex",
                        alignItems: "center",
                    }}
                    textAlign="left">
                    Link
                </Box>
            ),
            cell: ({ row: { original } }) => (
                <Typography color="GrayText">{original.user.link}</Typography>
            ),
        },
        {
            id: "orcid",
            header: () => (
                <Box
                    sx={{
                        p: 0,
                        justifyContent: "space-between",
                        display: "flex",
                        alignItems: "center",
                    }}
                    textAlign="left">
                    OrcID
                </Box>
            ),
            cell: ({ row: { original } }) => (
                <Typography color="GrayText">{original.user?.orcid}</Typography>
            ),
        },
        {
            id: "bio",
            header: () => (
                <Box
                    sx={{
                        p: 0,
                        justifyContent: "space-between",
                        display: "flex",
                        alignItems: "center",
                    }}
                    textAlign="left">
                    Bio
                </Box>
            ),
            cell: ({ row: { original } }) => (
                <Typography color="GrayText">{original.user.bio}</Typography>
            ),
        },
    ];
};

export { getColumns };
