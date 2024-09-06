"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { PaginationType } from "@/interfaces/Pagination";
import { Tool } from "@/interfaces/Tool";
import Box from "@/components/Box";
import Button from "@/components/Button";
import Paper from "@/components/Paper";
import Tabs from "@/components/Tabs";
import Typography from "@/components/Typography";
import useDebounce from "@/hooks/useDebounce";
import useDelete from "@/hooks/useDelete";
import useGet from "@/hooks/useGet";
import useModal from "@/hooks/useModal";
import usePatch from "@/hooks/usePatch";
import apis from "@/config/apis";
import {
    searchDefaultValues,
    sortByOptions,
} from "@/config/forms/toolAccountSearch";
import { colors } from "@/config/theme";
import { DataStatus } from "@/consts/application";
import { AddIcon, ArchiveIcon, EditIcon, UnarchiveIcon } from "@/consts/icons";
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
    const router = useRouter();
    const { showModal } = useModal();
    const searchParams = useSearchParams();
    const tab = searchParams?.get("tab");

    const [initialSort] = sortByOptions.filter(
        o => o.value === searchDefaultValues.sortField
    );

    const [queryParams, setQueryParams] = useState({
        team_id: teamId ? `${teamId}` : "",
        user_id: !teamId ? `${userId}` : "",
        withTrashed: "true",
        status: "ACTIVE",
        page: "1",
        sort: `${searchDefaultValues.sortField}:${initialSort.initialDirection}`,
        title: "",
    });

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
            status: searchParams?.get("tab") || "ACTIVE",
        }));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParams?.get("tab")]);

    const { data: counts, mutate: mutateCount } = useGet<CountStatus>(
        teamId
            ? `${apis.toolsV1Url}/count/status?team_id=${teamId}`
            : `${apis.toolsV1Url}/count/status?user_id=${userId}`
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
        `${apis.toolsV1Url}?${new URLSearchParams(queryParams)}`,
        {
            keepPreviousData: true,
            withPagination: true,
        }
    );

    const unArchiveTool = usePatch<Partial<Tool>>(apis.toolsV1Url, {
        query: "unarchive",
    });

    const archiveTool = useDelete(apis.toolsV1Url, {
        localeKey: "archiveTool",
    });

    useEffect(() => {
        window.scrollTo({ top: 0 });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [queryParams.page]);

    const showArchiveButton =
        tab !== DataStatus.ARCHIVED && permissions["tools.delete"];
    const showUnarchiveButton =
        tab === DataStatus.ARCHIVED && permissions["tools.update"];
    const showAddNewButton = useMemo(
        () => permissions["tools.create"],
        [permissions]
    );

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
        ...(showUnarchiveButton
            ? [
                  {
                      action: (id: number) => {
                          showModal({
                              tertiaryButton: {
                                  onAction: async () => {
                                      await unArchiveTool(id, {
                                          status: DataStatus.ACTIVE,
                                      });
                                      mutateTools();
                                      mutateCount();
                                  },
                                  buttonText: t("actions.unarchive.buttonText"),
                              },
                              onSuccess: async () => {
                                  await unArchiveTool(id, {
                                      status: DataStatus.DRAFT,
                                  });
                                  mutateTools();
                                  mutateCount();
                              },
                              confirmText: t("actions.unarchive.confirmText"),
                              title: t("actions.unarchive.title"),
                              content: t("actions.unarchive.content"),
                          });
                      },
                      icon: UnarchiveIcon,
                      label: t("actions.unarchive.label"),
                  },
              ]
            : []),
        ...(showArchiveButton
            ? [
                  {
                      action: async (id: number) => {
                          await archiveTool(id);
                          mutateTools();
                          mutateCount();
                      },
                      icon: ArchiveIcon,
                      label: t("actions.archive.label"),
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
                list={data?.list}
                currentPage={parseInt(queryParams.page, 10)}
                setCurrentPage={page =>
                    setQueryParams({
                        ...queryParams,
                        page: page.toString(),
                    })
                }
                isLoading={isLoading}
                actions={actions}
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
                tabBoxSx={{ padding: 0, background: colors.white }}
                rootBoxSx={{ padding: 0 }}
            />
        </>
    );
};

export default TeamTools;
