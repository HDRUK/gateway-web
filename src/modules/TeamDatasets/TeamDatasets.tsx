import Tabs from "@/components/Tabs";
import useGet from "@/hooks/useGet";
import apis from "@/config/apis";
import { useEffect, useState } from "react";
import { Dataset } from "@/interfaces/Dataset";
import { PaginationType } from "@/interfaces/Pagination";
import DatasetTab from "@/modules/DatasetTab";
import { useRouter } from "next/router";
import { AccountTeamUrlQuery } from "@/interfaces/AccountTeamQuery";
import useModal from "@/hooks/useModal";
import usePatch from "@/hooks/usePatch";
import useDelete from "@/hooks/useDelete";
import useDebounce from "@/hooks/useDebounce";
import { ArchiveIcon, EditIcon, UnarchiveIcon } from "@/consts/icons";
import {
    datasetSearchDefaultValues,
    sortByOptions,
} from "@/config/forms/datasetAccountSearch";
import { useForm } from "react-hook-form";

interface CountStatus {
    ACTIVE?: number;
    DRAFT?: number;
    ARCHIVED?: number;
}

const TeamDatasets = () => {
    const { showModal } = useModal();
    const { query } = useRouter();
    const { teamId, tab } = query as AccountTeamUrlQuery;
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
            href: `/account/team/${teamId}/datasets`,
            icon: EditIcon,
            label: "Edit dataset metadata",
        },
        ...(tab === "ARCHIVED"
            ? [
                  {
                      action: (id: number) => {
                          showModal({
                              tertiaryButton: {
                                  onAction: () => {
                                      console.log(`Make ${id} Active`);
                                      unArchiveDataset(id, {
                                          status: "ACTIVE",
                                      });
                                  },
                                  buttonText: "Make Active",
                              },
                              onSuccess: () => {
                                  console.log(`Make ${id} Draft`);
                                  unArchiveDataset(id, { status: "DRAFT" });
                              },
                              confirmText: "Make Draft",
                              title: "Unarchive this dataset",
                              content:
                                  "Select whether you would like to move this dataset to Active (this will make your dataset available within search results) or Draft (where you can edit the dataset metadata before making it available within search results).",
                          });
                      },
                      icon: UnarchiveIcon,
                      label: "Unarchive dataset",
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
                      label: "Archive dataset metadata so it is no longer live on the Gateway",
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
