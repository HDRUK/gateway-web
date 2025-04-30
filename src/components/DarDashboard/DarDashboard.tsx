"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { Typography } from "@mui/material";
import Cookies from "js-cookie";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { DataAccessRequestApplication } from "@/interfaces/DataAccessRequestApplication";
import { PaginationType } from "@/interfaces/Pagination";
import Box from "@/components/Box";
import DarApplicationCard from "@/components/DarApplicationCard";
import DarApplicationGroup from "@/components/DarApplicationGroup";
import InputWrapper from "@/components/InputWrapper";
import Loading from "@/components/Loading";
import Pagination from "@/components/Pagination";
import Paper from "@/components/Paper";
import Tabs from "@/components/Tabs";
import useDebounce from "@/hooks/useDebounce";
import useDelete from "@/hooks/useDelete";
import useGet from "@/hooks/useGet";
import config from "@/config/config";
import {
    darDashboardDefaultValues,
    darDashboardSearchFilter,
    darDashboardSortField,
} from "@/config/forms/dataAccessApplicationDashboard";
import { colors } from "@/config/theme";
import {
    DarApplicationApprovalStatus,
    DarApplicationStatus,
} from "@/consts/dataAccess";
import { capitalise } from "@/utils/general";
import { clearCookieAction } from "@/app/actions/clearCookieAction";
import { updateDarApplicationTeamAction } from "@/app/actions/updateDarApplicationTeam";
import { updateDarApplicationUserAction } from "@/app/actions/updateDarApplicationUser";

const STATUS = "status";
const SUBMISSION_STATUS = [
    DarApplicationStatus.SUBMITTED,
    DarApplicationStatus.DRAFT,
];

interface CountStatus {
    ALL: number;
    APPROVED: number;
    DRAFT: number;
    FEEDBACK: number;
    REJECTED: number;
    SUBMITTED: number;
    WITHDRAWN: number;
    action_required: number;
    info_required: number;
}

interface DarDashboardProps {
    translationPath: string;
    darApiPath: string;
    isResearcher: boolean;
    userId?: string;
    teamId?: string;
}

export default function DarDashboard({
    translationPath,
    darApiPath,
    isResearcher,
    userId,
    teamId,
}: DarDashboardProps) {
    const t = useTranslations(translationPath);

    const searchParams = useSearchParams();

    useEffect(() => {
        if (Cookies.get(config.DAR_UPDATE_SUPPRESS_COOKIE)) {
            clearCookieAction(config.DAR_UPDATE_SUPPRESS_COOKIE);
        }
    }, [Cookies]);

    const { control, watch, setValue } = useForm({
        defaultValues: darDashboardDefaultValues,
    });

    const [queryParams, setQueryParams] = useState({
        page: "1",
        sort: `${darDashboardDefaultValues.sortField}`,
        project_title: "",
        submission_status: "",
        approval_status: "",
        action_required: "",
    });

    const filterTitleDebounced = useDebounce(watch("searchTitle"), 500);

    useEffect(() => {
        setQueryParams(previous => ({
            ...previous,
            project_title: filterTitleDebounced,
        }));
    }, [filterTitleDebounced]);

    const watchSort = watch("sortField");

    useEffect(() => {
        setQueryParams(previous => ({
            ...previous,
            sort: watchSort,
        }));
    }, [watchSort, setValue]);

    const statusParam = useMemo(() => {
        return searchParams?.get("status") || "";
    }, [searchParams]);

    const actionParam = useMemo(() => {
        return searchParams?.get("action") || "";
    }, [searchParams]);

    const formatActionRequiredParam = (
        statusParam: string,
        actionStatus: string
    ) =>
        statusParam !== DarApplicationApprovalStatus.FEEDBACK
            ? ""
            : actionStatus
            ? actionStatus === "APPLICANT"
                ? "false"
                : "true"
            : "";

    useEffect(() => {
        setQueryParams(previous => ({
            ...previous,
            page: "1",
            submission_status: SUBMISSION_STATUS.includes(
                statusParam as DarApplicationStatus
            )
                ? statusParam
                : "",
            approval_status: !SUBMISSION_STATUS.includes(
                statusParam as DarApplicationStatus
            )
                ? statusParam
                : "",
            action_required: formatActionRequiredParam(
                statusParam,
                previous.action_required
            ),
        }));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [statusParam]);

    useEffect(() => {
        setQueryParams(previous => ({
            ...previous,
            action_required: formatActionRequiredParam(
                previous.approval_status,
                actionParam
            ),
        }));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [actionParam]);

    const { data: counts } = useGet<CountStatus>(`${darApiPath}/count`);

    const {
        data,
        isLoading,
        mutate: mutateApplications,
    } = useGet<PaginationType<DataAccessRequestApplication>>(
        `${darApiPath}?${new URLSearchParams(queryParams)}`,
        {
            withPagination: true,
            revalidateOnMount: true,
        }
    );

    const deleteApplication = useDelete(darApiPath, {
        itemName: t("dataAccessRequests"),
    });

    const handleDeleteApplication = (id: number) =>
        deleteApplication(id).then(() => mutateApplications());

    const handleWithdrawApplication = async (id: number) =>
        isResearcher
            ? await updateDarApplicationUserAction(id.toString(), userId!, {
                  approval_status: DarApplicationApprovalStatus.WITHDRAWN,
              }).then(() => {
                  mutateApplications();
              })
            : await updateDarApplicationTeamAction(id.toString(), teamId!, {
                  approval_status: DarApplicationApprovalStatus.WITHDRAWN,
              }).then(() => {
                  mutateApplications();
              });

    const approvalTab = [
        {
            label: `All (${counts?.FEEDBACK || 0})`,
            value: "",
            content: null,
        },
        {
            label: `Action required by Applicant (${
                counts?.info_required || 0
            })`,
            value: "APPLICANT",
            content: null,
        },
        {
            label: `Action required by Custodian (${
                counts?.action_required || 0
            })`,
            value: "CUSTODIAN",
            content: null,
        },
    ];

    const tabList = [
        { label: `All (${counts?.ALL ?? 0})`, value: "" },
        isResearcher
            ? {
                  label: `${capitalise(DarApplicationStatus.DRAFT)} (${
                      counts?.DRAFT || 0
                  })`,
                  value: DarApplicationStatus.DRAFT,
              }
            : {},
        {
            label: `${capitalise(DarApplicationStatus.SUBMITTED)} (${
                counts?.SUBMITTED || 0
            })`,
            value: DarApplicationStatus.SUBMITTED,
        },
        {
            label: `In review (${counts?.FEEDBACK || 0})`,
            value: DarApplicationApprovalStatus.FEEDBACK,
        },
        {
            label: `${capitalise(DarApplicationApprovalStatus.APPROVED)} (${
                counts?.APPROVED || 0
            })`,
            value: DarApplicationApprovalStatus.APPROVED,
        },
        {
            label: `${capitalise(DarApplicationApprovalStatus.REJECTED)} (${
                counts?.REJECTED || 0
            })`,
            value: DarApplicationApprovalStatus.REJECTED,
        },
        {
            label: `${capitalise(DarApplicationApprovalStatus.WITHDRAWN)} (${
                counts?.WITHDRAWN || 0
            })`,
            value: DarApplicationApprovalStatus.WITHDRAWN,
        },
    ]
        .filter(tab => tab.label)
        .map(tab => ({
            label: `${tab.label}`,
            value: tab.value,
            content: isLoading ? (
                <Loading />
            ) : (
                <>
                    {statusParam === DarApplicationApprovalStatus.FEEDBACK && (
                        <Tabs
                            tabs={approvalTab}
                            tabBoxSx={{
                                padding: 0,
                                background: colors.white,
                            }}
                            rootBoxSx={{
                                padding: 0,
                                borderTop: `1px solid ${colors.grey200}`,
                                mb: 1,
                            }}
                            paramName="action"
                            tabVariant="scrollable"
                        />
                    )}

                    <Box
                        sx={{
                            display: "flex",
                            p: 0,
                            justifyContent: "flex-end",
                        }}>
                        <InputWrapper
                            control={control}
                            {...darDashboardSortField}
                        />
                    </Box>

                    {data?.list?.map(item => {
                        const isMultiTeamApplication =
                            userId && item.teams.length > 1;

                        if (isMultiTeamApplication) {
                            return (
                                <DarApplicationGroup
                                    item={item}
                                    key={item.id}
                                    deleteApplication={handleDeleteApplication}
                                    withdrawApplication={
                                        handleWithdrawApplication
                                    }
                                />
                            );
                        }

                        return (
                            <DarApplicationCard
                                application={item}
                                key={item.id}
                                teamId={teamId}
                                deleteApplication={handleDeleteApplication}
                                withdrawApplication={handleWithdrawApplication}
                            />
                        );
                    })}
                </>
            ),
        }));

    return (
        <>
            <Paper>
                <Box
                    sx={{
                        bgcolor: "white",
                        p: 2,
                        display: "flex",
                        alignItems: "center",
                    }}>
                    <Box sx={{ flexGrow: 1, p: 0 }}>
                        <Typography variant="h2">{t("title")}</Typography>
                        <Typography>{t("intro")}</Typography>
                    </Box>
                </Box>
                <Box sx={{ pt: 0 }}>
                    <InputWrapper
                        setValue={setValue}
                        control={control}
                        {...darDashboardSearchFilter}
                    />
                </Box>
            </Paper>

            <Tabs
                tabs={tabList}
                tabBoxSx={{ padding: 0, background: colors.white }}
                rootBoxSx={{
                    padding: 0,
                    borderTop: `1px solid ${colors.grey200}`,
                    "& .MuiTabs-root": {
                        mb:
                            statusParam ===
                            DarApplicationApprovalStatus.FEEDBACK
                                ? 0
                                : 1,
                    },
                }}
                paramName={STATUS}
                tabVariant="scrollable"
            />

            <Pagination
                sx={{ mt: 2 }}
                isLoading={isLoading}
                page={data?.currentPage}
                count={data?.lastPage}
                onChange={(_, page: number) =>
                    setQueryParams({
                        ...queryParams,
                        page: page.toString(),
                    })
                }
            />
        </>
    );
}
