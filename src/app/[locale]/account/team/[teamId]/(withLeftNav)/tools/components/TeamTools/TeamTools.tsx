"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@hdruk/ui";
import { tokens } from "@hdruk/ui/theme";
import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { PaginationType } from "@/interfaces/Pagination";
import { Tool } from "@/interfaces/Tool";
import Box from "@/components/Box";
import Paper from "@/components/Paper";
import Tabs from "@/components/Tabs";
import Typography from "@/components/Typography";
import useActivationCheck from "@/hooks/useActivationCheck";
import useDebounce from "@/hooks/useDebounce";
import useGet from "@/hooks/useGet";
import usePatch from "@/hooks/usePatch";
import notificationService from "@/services/notification";
import apis from "@/config/apis";
import { toolValidationSchema } from "@/config/forms/tool";
import {
    searchDefaultValues,
    sortByOptions,
} from "@/config/forms/toolAccountSearch";
import { DataStatus } from "@/consts/application";
import { AddIcon, EditIcon } from "@/consts/icons";
import { RouteName } from "@/consts/routeName";
import {
    ACCOUNT,
    PAGES,
    TEAM,
    COMPONENTS,
    TITLE,
    TEXT,
    TOOLS,
} from "@/consts/translation";
import {
    getToolActivationValues,
    loadEntityActivation,
} from "@/utils/activation";
import { capitalise } from "@/utils/general";
import ToolsTab from "../ToolsTab";

interface CountStatus {
    ACTIVE?: number;
    DRAFT?: number;
    ARCHIVED?: number;
}

interface TeamToolsProps {
    permissions: { [key: string]: boolean };
    teamId?: string;
    userId: string;
}

const TRANSLATION_PATH = `${PAGES}.${ACCOUNT}.${TEAM}.${TOOLS}.${COMPONENTS}.TeamTools`;

const TeamTools = ({ permissions, teamId, userId }: TeamToolsProps) => {
    const t = useTranslations(TRANSLATION_PATH);
    const checkActivation = useActivationCheck();
    const router = useRouter();
    const searchParams = useSearchParams();

    const [initialSort] = sortByOptions.filter(
        o => o.value === searchDefaultValues.sortField
    );

    const [queryParams, setQueryParams] = useState({
        status: DataStatus.ACTIVE.toLowerCase(),
        page: "1",
        sort: `${searchDefaultValues.sortField}:${initialSort.initialDirection}`,
        title: "",
    });

    const { status, ...filteredQueryParams } = queryParams;

    const { control, watch, setValue } = useForm({
        defaultValues: {
            ...searchDefaultValues,
            sortDirection: initialSort.initialDirection,
        },
    });
    const watchAll = watch();

    useEffect(() => {
        const [option] = sortByOptions.filter(
            o => o.value === watchAll.sortField
        );
        setQueryParams(previous => ({
            ...previous,
            sort: `${watchAll.sortField}:${option.initialDirection}`,
        }));
        setValue("sortDirection", option.initialDirection);
    }, [watchAll.sortField, setValue]);

    useEffect(() => {
        setQueryParams(previous => ({
            ...previous,
            sort: `${previous.sort.split(":")[0]}:${watchAll.sortDirection}`,
        }));
    }, [watchAll.sortDirection]);

    const filterTitleDebounced = useDebounce(watchAll.searchTitle, 500);

    useEffect(() => {
        setQueryParams(previous => ({
            ...previous,
            title: filterTitleDebounced,
            page: "1",
        }));
    }, [filterTitleDebounced]);

    useEffect(() => {
        setQueryParams(previous => ({
            ...previous,
            status: (
                searchParams?.get("tab") || DataStatus.ACTIVE
            ).toLowerCase(),
        }));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParams?.get("tab")]);

    const baseToolsUrl = teamId
        ? `${apis.teamsV2Url}/${teamId}/tools`
        : `${apis.usersV2Url}/${userId}/tools`;

    const { data: counts, mutate: mutateCount } = useGet<CountStatus>(
        `${baseToolsUrl}/count/status`
    );

    const {
        ACTIVE: countActive,
        DRAFT: countDraft,
        ARCHIVED: countArchived,
    } = counts ?? {};

    const {
        data,
        isLoading,
        mutate: mutateTools,
    } = useGet<PaginationType<Tool>>(
        `${baseToolsUrl}/status/${status}?${new URLSearchParams(
            filteredQueryParams
        )}`,
        {
            keepPreviousData: true,
            withPagination: true,
        }
    );

    const patchTool = usePatch<Partial<Tool>>(baseToolsUrl, {
        itemName: "Tool",
        successNotificationsOn: false,
    });

    useEffect(() => {
        window.scrollTo({ top: 0 });
    }, [queryParams.page]);

    const handleStatusChange = async (id: number, status: DataStatus) => {
        if (
            status === DataStatus.ACTIVE &&
            !(await checkActivation({
                load: loadEntityActivation(
                    `${baseToolsUrl}/${id}`,
                    toolValidationSchema,
                    getToolActivationValues
                ),
            }))
        ) {
            return;
        }

        const result = await patchTool(id, { status });
        await Promise.all([mutateTools(), mutateCount()]);

        if (result !== null) {
            notificationService.apiSuccess(t(`actions.statusChange.${status}`));
        }
    };
    const showAddNewButton = useMemo(() => {
        return teamId ? permissions["tools.create"] : true;
    }, [permissions]);

    const actions = [
        ...(permissions["tools.update"]
            ? [
                  {
                      href: teamId
                          ? `/${RouteName.ACCOUNT}/${RouteName.TEAM}/${teamId}/${RouteName.TOOLS}`
                          : `/${RouteName.ACCOUNT}/${RouteName.PROFILE}/${RouteName.TOOLS}`,
                      icon: EditIcon,
                      label: t("actions.edit.label"),
                  },
              ]
            : []),
    ];

    const tabsList = [
        {
            label: capitalise(DataStatus.ACTIVE),
            value: DataStatus.ACTIVE,
            dsCount: countActive ?? 0,
        },
        {
            label: capitalise(DataStatus.DRAFT),
            value: DataStatus.DRAFT,
            dsCount: countDraft ?? 0,
        },
        {
            label: capitalise(DataStatus.ARCHIVED),
            value: DataStatus.ARCHIVED,
            dsCount: countArchived ?? 0,
        },
    ].map(tabItem => ({
        label: `${tabItem.label} (${tabItem.dsCount})`,
        value: tabItem.value,
        content: (
            <ToolsTab
                {...data}
                control={control}
                setValue={setValue}
                key={tabItem.value}
                label={tabItem.label}
                list={data?.list || []}
                currentPage={parseInt(queryParams.page, 10)}
                setCurrentPage={page =>
                    setQueryParams({
                        ...queryParams,
                        page: page.toString(),
                    })
                }
                isLoading={isLoading}
                actions={actions}
                onStatusChange={
                    permissions["tools.update"] ? handleStatusChange : undefined
                }
                disabledStatusOptions={
                    permissions["tools.delete"]
                        ? undefined
                        : [DataStatus.ARCHIVED]
                }
            />
        ),
    }));

    const handleAdd = () => {
        const TOOL_CREATE_ROUTE = teamId
            ? `/${RouteName.ACCOUNT}/${RouteName.TEAM}/${teamId}/${RouteName.TOOLS}/${RouteName.CREATE}`
            : `/${RouteName.ACCOUNT}/${RouteName.PROFILE}/${RouteName.TOOLS}/${RouteName.CREATE}`;
        router.push(TOOL_CREATE_ROUTE);
    };

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
                        <Typography variant="h2">{t(TITLE)}</Typography>
                        <Typography>{t(TEXT)}</Typography>
                    </Box>

                    {showAddNewButton && (
                        <Button onClick={handleAdd} startIcon={<AddIcon />}>
                            {t("create")}
                        </Button>
                    )}
                </Box>
            </Paper>

            <Tabs
                centered
                tabs={tabsList}
                tabBoxSx={{ padding: 0, background: tokens.background.white }}
                rootBoxSx={{ padding: 0 }}
            />
        </>
    );
};

export default TeamTools;
