"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@hdruk/ui";
import { tokens } from "@hdruk/ui/theme";
import { useTranslations } from "next-intl";
import { useParams, useSearchParams } from "next/navigation";
import { Dataset } from "@/interfaces/Dataset";
import { PaginationType } from "@/interfaces/Pagination";
import Box from "@/components/Box";
import { DatasetMenuAction } from "@/components/DatasetCard/DatasetCardMenu";
import Paper from "@/components/Paper";
import Tabs from "@/components/Tabs";
import Typography from "@/components/Typography";
import AddDatasetDialog from "@/modules/AddDatasetDialog";
import useActivationCheck from "@/hooks/useActivationCheck";
import useAuth from "@/hooks/useAuth";
import useDebounce from "@/hooks/useDebounce";
import useDialog from "@/hooks/useDialog";
import useGet from "@/hooks/useGet";
import usePatch from "@/hooks/usePatch";
import usePut from "@/hooks/usePut";
import notificationService from "@/services/notification";
import apis from "@/config/apis";
import {
    datasetSearchDefaultValues,
    sortByOptions,
} from "@/config/forms/datasetAccountSearch";
import { DataStatus } from "@/consts/application";
import { AddIcon, CohortIcon, ContentCopyIcon, EditIcon } from "@/consts/icons";
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
import { loadDatasetActivation } from "@/utils/activation";
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
    isSuperAdmin: boolean;
}

const TRANSLATION_PATH = `${PAGES}.${ACCOUNT}.${TEAM}.${DATASETS}.${COMPONENTS}.TeamDatasets`;

const TeamDatasets = ({
    permissions,
    teamId,
    isSuperAdmin,
}: TeamDatasetsProps) => {
    const t = useTranslations(TRANSLATION_PATH);
    const { showDialog } = useDialog();
    const { user } = useAuth();
    const checkActivation = useActivationCheck();
    const searchParams = useSearchParams();
    const params = useParams<{ teamId: string }>();
    const tab = searchParams?.get("tab");

    const [initialSort] = sortByOptions.filter(
        o => o.value === datasetSearchDefaultValues.sortField
    );

    const [queryParams, setQueryParams] = useState({
        status: DataStatus.ACTIVE.toLowerCase(),
        page: "1",
        sort: `${datasetSearchDefaultValues.sortField}:${initialSort.initialDirection}`,
        title: "",
    });

    const { status, ...filteredQueryParams } = queryParams;

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
            status: (
                searchParams?.get("tab") || DataStatus.ACTIVE
            ).toLowerCase(),
        }));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParams?.get("tab")]);

    const baseDatasetsUrl = `${apis.teamsV2Url}/${params?.teamId}/datasets`;

    const { data: counts, mutate: mutateCount } = useGet<CountStatus>(
        `${baseDatasetsUrl}/count/status`
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
        `${
            apis.teamsV2Url
        }/${teamId}/datasets/status/${status}?${new URLSearchParams(
            filteredQueryParams
        )}`,
        {
            keepPreviousData: true,
            withPagination: true,
        }
    );

    const patchDataset = usePatch(baseDatasetsUrl, {
        localeKey: "archiveDataset",
        successNotificationsOn: false,
    });

    const putDataset = usePut<{ is_cohort_discovery: boolean }>(
        apis.datasetsV2Url,
        { itemName: "Dataset" }
    );

    useEffect(() => {
        window.scrollTo({ top: 0 });
    }, [queryParams.page]);

    const handleStatusChange = async (id: number, status: DataStatus) => {
        if (status === DataStatus.ACTIVE) {
            const dataset = data?.list.find(item => item.id === id);
            const canActivate =
                !!dataset &&
                (await checkActivation({
                    load: loadDatasetActivation(
                        baseDatasetsUrl,
                        dataset,
                        user?.email
                    ),
                }));

            if (!canActivate) {
                return;
            }
        }

        const result = await patchDataset(id, { status });
        mutateDatasets();
        mutateCount();

        if (result !== null) {
            notificationService.apiSuccess(t(`actions.statusChange.${status}`));
        }
    };
    const showAddNewButton = useMemo(
        () => permissions["datasets.create"],
        [permissions]
    );

    const actions = [
        ...(permissions["datasets.update"] && tab !== DataStatus.ARCHIVED
            ? [
                  {
                      href: `/${RouteName.ACCOUNT}/${RouteName.TEAM}/${params?.teamId}/${RouteName.DATASETS}`,
                      icon: EditIcon,
                      label: t("actions.edit.label"),
                  },
              ]
            : []),
        ...(permissions["datasets.create"] && tab !== DataStatus.ARCHIVED
            ? [
                  {
                      href: `/${RouteName.ACCOUNT}/${RouteName.TEAM}/${params?.teamId}/${RouteName.DATASETS}`,
                      icon: ContentCopyIcon,
                      label: t("actions.duplicate.label"),
                      query: { duplicate: "true" },
                  },
              ]
            : []),
    ];

    const getMenuActions = (dataset: Dataset): DatasetMenuAction[] => {
        if (!isSuperAdmin) {
            return [];
        }

        return [
            ...(dataset.status === DataStatus.ACTIVE
                ? [
                      {
                          action: async ({
                              id,
                              is_cohort_discovery,
                          }: Dataset) => {
                              await putDataset(`${id}/cohort-discovery`, {
                                  is_cohort_discovery: !is_cohort_discovery,
                              });
                              mutateDatasets();
                          },
                          icon: CohortIcon,
                          label: t(
                              dataset.is_cohort_discovery
                                  ? "actions.cohortDiscovery.exclude"
                                  : "actions.cohortDiscovery.include"
                          ),
                      },
                  ]
                : []),
        ];
    };

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
                onStatusChange={
                    permissions["datasets.update"] ||
                    permissions["datasets.delete"]
                        ? handleStatusChange
                        : undefined
                }
                disabledStatusOptions={[
                    ...(permissions["datasets.update"]
                        ? []
                        : [DataStatus.ACTIVE, DataStatus.DRAFT]),
                    ...(permissions["datasets.delete"]
                        ? []
                        : [DataStatus.ARCHIVED]),
                ]}
                getMenuActions={getMenuActions}
                menuLabel={t("actions.more.label")}
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
                tabBoxSx={{ padding: 0, background: tokens.background.white }}
                rootBoxSx={{ padding: 0 }}
            />
        </>
    );
};

export default TeamDatasets;
