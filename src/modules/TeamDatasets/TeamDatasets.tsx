import Tabs from "@/components/Tabs";
import Box from "@/components/Box";
import useGet from "@/hooks/useGet";
import apis from "@/config/apis";
import { useMemo } from "react";
import { Dataset } from "@/interfaces/Dataset";

const TeamDatasets = () => {
    const { data } = useGet<Dataset[]>(apis.datasetsV1Url);
    const tabCounts = useMemo(() => {
        // todo: Replace with real data once BE is implemented
        const mockData = [
            { status: "Archived" },
            { status: "Draft" },
            { status: "Active" },
            { status: "Active" },
            { status: "Active" },
            { status: "Archived" },
        ];
        return {
            archived: mockData.filter(dataset => dataset.status === "Archived")
                .length,
            draft: mockData.filter(dataset => dataset.status === "Draft")
                .length,
            active: mockData.filter(dataset => dataset.status === "Active")
                .length,
        };
        // todo: remove linting suppression once BE implemented
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data]);

    const tabsList = [
        {
            label: `Active (${tabCounts.active})`,
            value: "active",
            content: <Box />,
        },
        {
            label: `Draft (${tabCounts.draft})`,
            value: "draft",
            content: <Box />,
        },
        {
            label: `Archived (${tabCounts.archived})`,
            value: "archived",
            content: <Box />,
        },
    ];
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
