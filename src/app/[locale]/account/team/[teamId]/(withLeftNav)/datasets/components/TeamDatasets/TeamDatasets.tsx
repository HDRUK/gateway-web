"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import { useParams, useSearchParams } from "next/navigation";
import { Dataset } from "@/interfaces/Dataset";
import { PaginationType } from "@/interfaces/Pagination";
import Box from "@/components/Box";
import Button from "@/components/Button";
import Paper from "@/components/Paper";
import Tabs from "@/components/Tabs";
import Typography from "@/components/Typography";
import AddDatasetDialog from "@/modules/AddDatasetDialog";
import useDebounce from "@/hooks/useDebounce";
import useDelete from "@/hooks/useDelete";
import useDialog from "@/hooks/useDialog";
import useGet from "@/hooks/useGet";
import useModal from "@/hooks/useModal";
import usePatch from "@/hooks/usePatch";
import apis from "@/config/apis";
import {
    datasetSearchDefaultValues,
    sortByOptions,
} from "@/config/forms/datasetAccountSearch";
import { colors } from "@/config/theme";
import { DataStatus } from "@/consts/application";
import {
    AddIcon,
    ArchiveIcon,
    ContentCopyIcon,
    EditIcon,
    UnarchiveIcon,
} from "@/consts/icons";
import { RouteName } from "@/consts/routeName";
import {
    ACCOUNT,
    DATASETS,
    PAGES,
    TEAM,
    COMPONENTS,
    TITLE,
    TEXT,
} from "@/consts/translation";
import { capitalise } from "@/utils/general";
import DatasetTab from "../DatasetTab";

interface CountStatus {
    ACTIVE?: number;
    DRAFT?: number;
    ARCHIVED?: number;
}

interface TeamDatasetsProps {
    permissions: { [key: string]: boolean };
    teamId: string;
}

const TRANSLATION_PATH = `${PAGES}.${ACCOUNT}.${TEAM}.${DATASETS}.${COMPONENTS}.TeamDatasets`;

const TeamDatasets = ({ permissions, teamId }: TeamDatasetsProps) => {
    const t = useTranslations(TRANSLATION_PATH);
    const { showModal } = useModal();
    const { showDialog } = useDialog();
    const searchParams = useSearchParams();
    const params = useParams<{ teamId: string }>();
    const tab = searchParams?.get("tab");

    const [initialSort] = sortByOptions.filter(
        o => o.value === datasetSearchDefaultValues.sortField
    );

    const [queryParams, setQueryParams] = useState({
        team_id: `${params?.teamId}`,
        withTrashed: "true",
        status: "ACTIVE",
        page: "1",
        sort: `${datasetSearchDefaultValues.sortField}:${initialSort.initialDirection}`,
        title: "",
    });

    const { control, watch, setValue } = useForm({
        defaultValues: {
            ...datasetSearchDefaultValues,
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
        `${apis.datasetsV1Url}/count/status?team_id=${params?.teamId}`
    );
    const {
        ACTIVE: countActive,
        DRAFT: countDraft,
        ARCHIVED: countArchived,
    } = counts ?? {};

    const {
        data,
        isLoading,
        mutate: mutateDatasets,
    } = useGet<PaginationType<Dataset>>(
        `${apis.datasetsV1Url}?${new URLSearchParams(queryParams)}`,
        {
            keepPreviousData: true,
            withPagination: true,
        }
    );

    const unArchiveDataset = usePatch<Partial<Dataset>>(apis.datasetsV1Url, {
        query: "unarchive",
    });

    const archiveDataset = useDelete(apis.datasetsV1Url, {
        localeKey: "archiveDataset",
    });

    useEffect(() => {
        window.scrollTo({ top: 0 });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [queryParams.page]);

    const showArchiveButton =
        tab !== DataStatus.ARCHIVED && permissions["datasets.delete"];
    const showUnarchiveButton =
        tab === DataStatus.ARCHIVED && permissions["datasets.update"];
    const showAddNewButton = useMemo(
        () => permissions["datasets.create"],
        [permissions]
    );

    const actions = [
        ...(permissions["datasets.update"]
            ? [
                  {
                      href: `/${RouteName.ACCOUNT}/${RouteName.TEAM}/${params?.teamId}/${RouteName.DATASETS}`,
                      icon: EditIcon,
                      label: t("actions.edit.label"),
                  },
              ]
            : []),
        ...(permissions["datasets.create"]
            ? [
                  {
                      href: `/${RouteName.ACCOUNT}/${RouteName.TEAM}/${params?.teamId}/${RouteName.DATASETS}`,
                      icon: ContentCopyIcon,
                      label: t("actions.duplicate.label"),
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
                                      await unArchiveDataset(id, {
                                          status: DataStatus.ACTIVE,
                                      });
                                      mutateDatasets();
                                      mutateCount();
                                  },
                                  buttonText: t("actions.unarchive.buttonText"),
                              },
                              onSuccess: async () => {
                                  await unArchiveDataset(id, {
                                      status: DataStatus.DRAFT,
                                  });
                                  mutateDatasets();
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
                          await archiveDataset(id);
                          mutateDatasets();
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
            <DatasetTab
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
        showDialog(AddDatasetDialog, { teamId });
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

export default TeamDatasets;
