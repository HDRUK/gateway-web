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
import { getTabLength } from "./TeamDatasets.utils";

const TeamDatasets = () => {
    const { showModal } = useModal();
    const { query } = useRouter();
    const { teamId, tab } = query as AccountTeamUrlQuery;
    const [currentPage, setCurrentPage] = useState(1);

    const sortByOptions = [
        {
            label: "Sort By Date of Last Update",
            value: "updated",
            defaultDirection: "desc",
        },
        {
            label: "Sort By Date of Creation",
            value: "created",
            defaultDirection: "desc",
        },
        {
            label: "Sort By Title",
            value: "properties/summary/title",
            defaultDirection: "asc",
        },
        {
            label: "Sort By Publisher Name",
            value: "properties/summary/publisher/publisherName",
            defaultDirection: "asc",
        },
    ];

    const [sortField, setSortField] = useState(sortByOptions[0].value);
    const [sortDirection, setSortDirection] = useState(
        sortByOptions[0].defaultDirection
    );

    const [filterTitle, setFilterTitle] = useState("XYZ");
    const filterTitleDebounced = useDebounce(filterTitle, 500);

    const queryParams = new URLSearchParams();
    queryParams.append("team_id", teamId);
    queryParams.append("withTrashed", "true");
    queryParams.append("page", `${currentPage}`);
    queryParams.append("sort", `${sortField}:${sortDirection}`);
    if (filterTitleDebounced) {
        queryParams.append("filter_title", filterTitleDebounced);
    }

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

    const archivedTabs = getTabLength(data?.list, "ARCHIVED");
    const draftTabs = getTabLength(data?.list, "DRAFT");
    const activeTabs = getTabLength(data?.list, "ACTIVE");

    const tabsList = [
        { label: "Active", value: "ACTIVE", dsCount: activeTabs },
        { label: "Draft", value: "DRAFT", dsCount: draftTabs },
        { label: "Archived", value: "ARCHIVED", dsCount: archivedTabs },
    ].map(tabItem => ({
        label: `${tabItem.label} (${tabItem.dsCount})`,
        value: tabItem.value,
        content: (
            <DatasetTab
                {...data}
                key={tabItem.value}
                label={tabItem.label}
                list={(data?.list || []).filter(
                    ds => ds.status === tabItem.value
                )}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                sortByOptions={sortByOptions}
                sortField={sortField}
                setSortField={setSortField}
                sortDirection={sortDirection}
                setSortDirection={setSortDirection}
                filterTitle={filterTitle}
                setFilterTitle={setFilterTitle}
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
