"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { DataAccessRequestApplication } from "@/interfaces/DataAccessRequestApplication";
import { PaginationType } from "@/interfaces/Pagination";
import Accordion from "@/components/Accordion";
import Box from "@/components/Box";
import InputWrapper from "@/components/InputWrapper";
import Loading from "@/components/Loading";
import Pagination from "@/components/Pagination";
import Paper from "@/components/Paper";
import ShowMore from "@/components/ShowMore";
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
import { ArrowDropDownIcon } from "@/consts/icons";
import { capitalise } from "@/utils/general";
import DarApplicationCard from "../DarApplicationCard";

const TRANSLATION_PATH =
    "pages.account.profile.dataAccessRequests.applications";

const STATUS = "status";
const SUBMISSION_STATUS = [
    DarApplicationStatus.SUBMITTED,
    DarApplicationStatus.DRAFT,
];

interface CountStatusSubmission {
    DRAFT?: number;
    SUBMITTED?: number;
}

interface CountStatusApproval {
    APPROVED?: number;
    REJECTED?: number;
    WITHDRAWN?: number;
    FEEDBACK?: number;
}

interface CountStatusActionRequired {
    action_required?: number;
    info_required?: number;
}

interface DashboardProps {
    userId: string;
}

export default function Dashboard({ userId }: DashboardProps) {
    const t = useTranslations(TRANSLATION_PATH);
    const searchParams = useSearchParams();

    const [expanded, setExpanded] = useState<string[]>([]);

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

    const { data: submissionCounts } = useGet<CountStatusSubmission>(
        `${apis.usersV1Url}/${userId}/dar/applications/count/submission_status`
    );

    const { data: approvalCounts } = useGet<CountStatusApproval>(
        `${apis.usersV1Url}/${userId}/dar/applications/count/approval_status`
    );

    const { data: actionRequiredCounts } = useGet<CountStatusActionRequired>(
        `${apis.usersV1Url}/${userId}/dar/applications/count/action_required`
    );

    const { data, isLoading } = useGet<
        PaginationType<DataAccessRequestApplication>
    >(
        `${apis.usersV1Url}/${userId}/dar/applications?${new URLSearchParams(
            queryParams
        )}`,
        { keepPreviousData: true, withPagination: true }
    );

    const approvalTab = [
        {
            label: `All (${approvalCounts?.FEEDBACK || 0})`,
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
        { label: `All (${submissionCounts?.SUBMITTED ?? 0})`, value: "" },
        {
            label: `${capitalise(DarApplicationStatus.SUBMITTED)} (${
                submissionCounts?.SUBMITTED || 0
            })`,
            value: DarApplicationStatus.SUBMITTED,
        },
        {
            label: `In review (${approvalCounts?.FEEDBACK || 0})`,
            value: DarApplicationApprovalStatus.FEEDBACK,
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

                <Box sx={{ display: "flex", p: 0, justifyContent: "flex-end" }}>
                    <InputWrapper
                        control={control}
                        {...darDashboardSortField}
                    />
                </Box>

                {data?.list?.map(item => {
                    const isTeamApplication = item.teams.length > 1;

                    if (isTeamApplication) {
                        return (
                            <Paper
                                sx={{
                                    mb: 1,
                                    p: 4,
                                    pb: 1,
                                    transition: "background-color 0.1s ease-in",
                                    ...(expanded.includes(item.id) && {
                                        backgroundColor: colors.grey300,
                                    }),
                                }}>
                                <Box>
                                    <Typography
                                        variant="h2"
                                        color={colors.purple500}
                                        fontSize={32}
                                        fontWeight={600}>
                                        {t("darApplication")}
                                        {item.id}
                                    </Typography>
                                    <ShowMore maxHeight={24}>
                                        <Typography fontSize={16}>
                                            {item.project_title}
                                        </Typography>
                                    </ShowMore>
                                    <Typography
                                        color={colors.purple500}
                                        fontWeight={700}
                                        sx={{ mt: 2 }}>
                                        {t("applicationsInGroup")}
                                        <Typography
                                            component="span"
                                            sx={{
                                                ml: 1,
                                                color: colors.black,
                                                fontWeight: 600,
                                            }}>
                                            {item.teams.length}
                                        </Typography>
                                    </Typography>

                                    <Accordion
                                        variant="plain"
                                        noIndent
                                        heading={""}
                                        expandIcon={ArrowDropDownIcon}
                                        contents={item.teams?.map(
                                            (team, index) => (
                                                <DarApplicationCard
                                                    application={item}
                                                    key={`${team.id}_${item.appliciation_id}`}
                                                    teamIndex={index}
                                                />
                                            )
                                        )}
                                        onChange={() =>
                                            setExpanded(
                                                expanded.includes(item.id)
                                                    ? expanded.filter(
                                                          e => e !== item.id
                                                      )
                                                    : [...expanded, item.id]
                                            )
                                        }
                                        expanded={expanded.includes(item.id)}
                                    />
                                </Box>
                            </Paper>
                        );
                    }

                    return (
                        <DarApplicationCard application={item} key={item.id} />
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
                        placeholder={t("searchPlaceholder")}
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
