"use client";

import Tabs from "@/components/Tabs";
import useGet from "@/hooks/useGet";
import apis from "@/config/apis";
import { useEffect, useState } from "react";
import { Dataset } from "@/interfaces/Dataset";
import { PaginationType } from "@/interfaces/Pagination";

import useModal from "@/hooks/useModal";
import usePatch from "@/hooks/usePatch";
import useDelete from "@/hooks/useDelete";
import useDebounce from "@/hooks/useDebounce";
import {
    ArchiveIcon,
    ContentCopyIcon,
    EditIcon,
    UnarchiveIcon,
} from "@/consts/icons";
import {
    datasetSearchDefaultValues,
    sortByOptions,
} from "@/config/forms/datasetAccountSearch";
import { useForm } from "react-hook-form";
import { useParams, useSearchParams } from "next/navigation";
import { RouteName } from "@/consts/routeName";
import { useTranslations } from "next-intl";
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
    const tab = searchParams.get("tab");
    const { teamId } = useParams();
    const [currentPage, setCurrentPage] = useState(1);
    const [sort, setSort] = useState(
        `${datasetSearchDefaultValues.sortField}:${datasetSearchDefaultValues.sortDirection}`
    );
    const { control, watch } = useForm({
        defaultValues: datasetSearchDefaultValues,
    });
    const watchAll = watch();

    useEffect(() => {
        const [option] = sortByOptions.filter(
            o => o.value === watchAll.sortField
        );
        setSort(`${watchAll.sortField}:${option.direction}`);
    }, [watchAll.sortField]);

    useEffect(() => {
        setSort(
            previous => `${previous.split(":")[0]}:${watchAll.sortDirection}`
        );
    }, [watchAll.sortDirection]);

    const filterTitleDebounced = useDebounce(watchAll.searchTitle, 500);

    const queryParams = new URLSearchParams({
        team_id: teamId.toString(),
        withTrashed: "true",
        status: (tab as string) || "ACTIVE",
        page: currentPage.toString(),
        sort,
        title: filterTitleDebounced,
    });

    const { data: counts } = useGet<CountStatus>(
        `${apis.datasetsV1Url}/count/status?team_id=${teamId}`
    );
    const {
        ACTIVE: countActive,
        DRAFT: countDraft,
        ARCHIVED: countArchived,
    } = counts ?? {};

    const { data, isLoading, mutate } = useGet<PaginationType<Dataset>>(
        `${apis.datasetsV1Url}?${queryParams}`,
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
    }, [currentPage]);

    const actions = [
        {
            href: `/${RouteName.ACCOUNT}/${RouteName.TEAM}/${teamId}/${RouteName.DATASETS}`,
            icon: EditIcon,
            label: t("actions.edit.label"),
        },
        {
            href: `/account/team/${teamId}/datasets/duplicate`,
            icon: ContentCopyIcon,
            label: t("actions.duplicate.label"),
        },
        ...(tab === "ARCHIVED"
            ? [
                  {
                      action: (id: number) => {
                          showModal({
                              tertiaryButton: {
                                  onAction: () => {
                                      unArchiveDataset(id, {
                                          status: "ACTIVE",
                                      });
                                  },
                                  buttonText: t("actions.unarchive.buttonText"),
                              },
                              onSuccess: () => {
                                  unArchiveDataset(id, { status: "DRAFT" });
                              },
                              confirmText: t("actions.unarchive.confirmText"),
                              title: t("actions.unarchive.title"),
                              content: t("actions.unarchive.label"),
                          });
                      },
                      icon: UnarchiveIcon,
                      label: t("actions.unarchive."),
                  },
              ]
            : []),
        ...(tab !== "ARCHIVED"
            ? [
                  {
                      action: async (id: number) => {
                          await archiveDataset(id);

                          mutate();
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
                key={tabItem.value}
                label={tabItem.label}
                list={data?.list}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
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
