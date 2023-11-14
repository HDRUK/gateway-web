import Tabs from "@/components/Tabs";
import useGet from "@/hooks/useGet";
import apis from "@/config/apis";
import { useEffect, useMemo, useState } from "react";
import { Dataset } from "@/interfaces/Dataset";
import { PaginationType } from "@/interfaces/Pagination";
import DatasetTab from "@/modules/DatasetTab";
import { useRouter } from "next/router";
import { AccountTeamUrlQuery } from "@/interfaces/AccountTeamQuery";
import { getTabLength } from "./TeamDatasets.utils";

const TeamDatasets = () => {
    const { query } = useRouter();
    const { teamId } = query as AccountTeamUrlQuery;
    const [currentPage, setCurrentPage] = useState(1);
    const { data, isLoading } = useGet<PaginationType<Dataset>>(
        `${apis.datasetsV1Url}?team_id=${teamId}&withTrashed&page=${currentPage}`,
        {
            keepPreviousData: true,
            withPagination: true,
        }
    );

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
                //     "Archived",
                //     "Draft",
                //     "Active",
                // ]),
            })) as Dataset[],
        [data?.list]
    );

    const archivedTabs = getTabLength(dataWithStatus, "Archived");
    const draftTabs = getTabLength(dataWithStatus, "Draft");
    const activeTabs = getTabLength(dataWithStatus, "Active");

    const tabsList = [
        { label: "Active", value: "active", dsCount: activeTabs },
        { label: "Draft", value: "draft", dsCount: draftTabs },
        { label: "Archived", value: "archived", dsCount: archivedTabs },
    ].map(tab => ({
        label: `${tab.label} (${tab.dsCount})`,
        value: tab.value,
        content: (
            <DatasetTab
                {...data}
                label={tab.value}
                list={(dataWithStatus || []).filter(
                    ds => ds.status === tab.label
                )}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                isLoading={isLoading}
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
