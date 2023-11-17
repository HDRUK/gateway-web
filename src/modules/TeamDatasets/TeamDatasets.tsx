import Tabs from "@/components/Tabs";
import useGet from "@/hooks/useGet";
import apis from "@/config/apis";
import { useEffect, useMemo, useState } from "react";
import { Dataset } from "@/interfaces/Dataset";
import { PaginationType } from "@/interfaces/Pagination";
import DatasetTab from "@/modules/DatasetTab";
import { useRouter } from "next/router";
import { AccountTeamUrlQuery } from "@/interfaces/AccountTeamQuery";
import { EditIcon, UnarchiveIcon } from "@/consts/icons";
import useModal from "@/hooks/useModal";
import usePatch from "@/hooks/usePatch";
import { getTabLength } from "./TeamDatasets.utils";

const TeamDatasets = () => {
    const { showModal } = useModal();
    const { query } = useRouter();
    const { teamId, tab } = query as AccountTeamUrlQuery;
    const [currentPage, setCurrentPage] = useState(1);
    const { data, isLoading } = useGet<PaginationType<Dataset>>(
        `${apis.datasetsV1Url}?team_id=${teamId}&withTrashed=true&decode_metadata=true&page=${currentPage}`,
        {
            keepPreviousData: true,
            withPagination: true,
        }
    );

    const unArchiveDataset = usePatch<Partial<Dataset>>(apis.datasetsV1Url, {
        query: "unarchive",
    });

    useEffect(() => {
        window.scrollTo({ top: 0 });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage]);

    // todo: Remove "dataWithStatus" once status has been implemented in BE
    const dataWithStatus = useMemo(
        () =>
            data?.list?.map(dataset => ({
                ...dataset,
                // todo: Uncomment this to test until status has been implemented in BE
                // status: faker.helpers.arrayElement([
                //     "ARCHIVED",
                //     "DRAFT",
                //     "ACTIVE",
                // ]),
            })) as Dataset[],
        [data?.list]
    );

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
    ];

    const archivedTabs = getTabLength(dataWithStatus, "ARCHIVED");
    const draftTabs = getTabLength(dataWithStatus, "DRAFT");
    const activeTabs = getTabLength(dataWithStatus, "ACTIVE");

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
                list={(dataWithStatus || []).filter(
                    ds => ds.status === tabItem.value
                )}
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
