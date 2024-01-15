"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import { useParams, useSearchParams } from "next/navigation";
import { Dataset } from "@/interfaces/Dataset";
import { PaginationType } from "@/interfaces/Pagination";
import Tabs from "@/components/Tabs";
import useDebounce from "@/hooks/useDebounce";
import useDelete from "@/hooks/useDelete";
import useGet from "@/hooks/useGet";
import useModal from "@/hooks/useModal";
import usePatch from "@/hooks/usePatch";
import apis from "@/config/apis";
import {
    datasetSearchDefaultValues,
    sortByOptions,
} from "@/config/forms/datasetAccountSearch";
import {
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
} from "@/consts/translation";
import DatasetTab from "../DatasetTab";

interface CountStatus {
    ACTIVE?: number;
    DRAFT?: number;
    ARCHIVED?: number;
}

const TeamDatasets = () => {
    const t = useTranslations(
        `${PAGES}.${ACCOUNT}.${TEAM}.${DATASETS}.${COMPONENTS}.TeamDatasets`
    );
    const { showModal } = useModal();
    const searchParams = useSearchParams();
    const params = useParams<{ teamId: string }>();
    const tab = searchParams?.get("tab");

    const [queryParams, setQueryParams] = useState({
        team_id: `${params?.teamId}`,
        withTrashed: "true",
        status: "ACTIVE",
        page: "1",
        sort: `${datasetSearchDefaultValues.sortField}:${datasetSearchDefaultValues.sortDirection}`,
        title: "",
    });

    const { control, watch, setValue } = useForm({
        defaultValues: datasetSearchDefaultValues,
    });
    const watchAll = watch();

    useEffect(() => {
        const [option] = sortByOptions.filter(
            o => o.value === watchAll.sortField
        );
        setQueryParams(previous => ({
            ...previous,
            sort: `${watchAll.sortField}:${option.direction}`,
        }));
    }, [watchAll.sortField]);

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

    const actions = [
        {
            href: `/${RouteName.ACCOUNT}/${RouteName.TEAM}/${params?.teamId}/${RouteName.DATASETS}`,
            icon: EditIcon,
            label: t("actions.edit.label"),
        },
        {
            href: `/${RouteName.ACCOUNT}/${RouteName.TEAM}/${params?.teamId}/${RouteName.DATASETS}/${RouteName.DUPLICATE}`,
            icon: ContentCopyIcon,
            label: t("actions.duplicate.label"),
        },
        ...(tab === "ARCHIVED"
            ? [
                  {
                      action: (id: number) => {
                          showModal({
                              tertiaryButton: {
                                  onAction: async () => {
                                      await unArchiveDataset(id, {
                                          status: "ACTIVE",
                                      });
                                      mutateDatasets();
                                      mutateCount();
                                  },
                                  buttonText: t("actions.unarchive.buttonText"),
                              },
                              onSuccess: async () => {
                                  await unArchiveDataset(id, {
                                      status: "DRAFT",
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
        ...(tab !== "ARCHIVED"
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
        { label: "Active", value: "ACTIVE", dsCount: countActive ?? 0 },
        { label: "Draft", value: "DRAFT", dsCount: countDraft ?? 0 },
        { label: "Archived", value: "ARCHIVED", dsCount: countArchived ?? 0 },
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
                    setQueryParams({ ...queryParams, page: page.toString() })
                }
                isLoading={isLoading}
                actions={actions}
            />
        ),
    }));

    return (
        <Tabs
            centered
            tabs={tabsList}
            tabBoxSx={{ padding: 0 }}
            rootBoxSx={{ padding: 0 }}
        />
    );
};

export default TeamDatasets;
