"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import { useParams, useSearchParams } from "next/navigation";
import { DataAccessRequestApplication } from "@/interfaces/DataAccessRequestApplication";
import { PaginationType } from "@/interfaces/Pagination";
import Box from "@/components/Box";
import InputWrapper from "@/components/InputWrapper";
import Loading from "@/components/Loading";
import Pagination from "@/components/Pagination";
import Paper from "@/components/Paper";
import Tabs from "@/components/Tabs";
import useDebounce from "@/hooks/useDebounce";
import useGet from "@/hooks/useGet";
import apis from "@/config/apis";
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
import DarApplicationCard from "../DarApplicationCard";

const TRANSLATION_PATH = "pages.account.team.dataAccessRequests.applications";

const STATUS = "status";
const SUBMISSION_STATUS = [
    DarApplicationStatus.SUBMITTED,
    DarApplicationStatus.DRAFT,
    DarApplicationStatus.FEEDBACK,
];

interface CountStatusSubmission {
    DRAFT?: number;
    FEEDBACK?: number;
    SUBMITTED?: number;
}

interface CountStatusApproval {
    APPROVED?: number;
    REJECTED?: number;
    WITHDRAWN?: number;
}

interface CountStatusActionRequired {
    action_required?: number;
    info_required?: number;
}

export default function Dashboard() {
    const t = useTranslations(TRANSLATION_PATH);
    const params = useParams<{ teamId: string }>();
    const searchParams = useSearchParams();

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
        submissionStatus: string,
        actionStatus: string
    ) =>
        submissionStatus !== DarApplicationStatus.FEEDBACK
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
                previous.submission_status,
                actionParam
            ),
        }));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [actionParam]);

    const { data: submissionCounts } = useGet<CountStatusSubmission>(
        `${apis.teamsV1Url}/${params?.teamId}/dar/applications/count/submission_status`
    );

    const { data: approvalCounts } = useGet<CountStatusApproval>(
        `${apis.teamsV1Url}/${params?.teamId}/dar/applications/count/approval_status`
    );

    const { data: actionRequiredCounts } = useGet<CountStatusActionRequired>(
        `${apis.teamsV1Url}/${params?.teamId}/dar/applications/count/action_required`
    );

    const { data, isLoading } = useGet<
        PaginationType<DataAccessRequestApplication>
    >(
        `${apis.teamsV1Url}/${
            params?.teamId
        }/dar/applications?${new URLSearchParams(queryParams)}`,
        { keepPreviousData: true, withPagination: true }
    );

    const totalDARCount = useMemo(
        () =>
            (submissionCounts?.SUBMITTED ?? 0) +
            (submissionCounts?.DRAFT ?? 0) +
            (submissionCounts?.FEEDBACK ?? 0),
        [submissionCounts]
    );

    const approvalTab = [
        {
            label: `All (${submissionCounts?.FEEDBACK || 0})`,
            value: "",
            content: null,
        },
        {
            label: `Action required by Applicant (${
                actionRequiredCounts?.info_required || 0
            })`,
            value: "APPLICANT",
            content: null,
        },
        {
            label: `Action required by Custodian (${
                actionRequiredCounts?.action_required || 0
            })`,
            value: "CUSTODIAN",
            content: null,
        },
    ];

    const tabList = [
        { label: `All (${totalDARCount})`, value: "" },
        {
            label: `${capitalise(DarApplicationStatus.SUBMITTED)} (${
                submissionCounts?.SUBMITTED || 0
            })`,
            value: DarApplicationStatus.SUBMITTED,
        },
        {
            label: `In review (${submissionCounts?.FEEDBACK || 0})`,
            value: DarApplicationStatus.FEEDBACK,
        },
        {
            label: `${capitalise(DarApplicationApprovalStatus.APPROVED)} (${
                approvalCounts?.APPROVED || 0
            })`,
            value: DarApplicationApprovalStatus.APPROVED,
        },
        {
            label: `${capitalise(DarApplicationApprovalStatus.REJECTED)} (${
                approvalCounts?.REJECTED || 0
            })`,
            value: DarApplicationApprovalStatus.REJECTED,
        },
        {
            label: `${capitalise(DarApplicationApprovalStatus.WITHDRAWN)} (${
                approvalCounts?.WITHDRAWN || 0
            })`,
            value: DarApplicationApprovalStatus.WITHDRAWN,
        },
    ].map(tab => ({
        label: `${tab.label}`,
        value: tab.value,
        content: isLoading ? (
            <Loading />
        ) : (
            <>
                {statusParam === DarApplicationStatus.FEEDBACK && (
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

                <Box sx={{ display: "flex", p: 0, justifyContent: "flex-end" }}>
                    <InputWrapper
                        control={control}
                        {...darDashboardSortField}
                    />
                </Box>

                {data?.list?.map(item => (
                    <DarApplicationCard application={item} key={item.id} />
                ))}
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
                            statusParam === DarApplicationStatus.FEEDBACK
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
