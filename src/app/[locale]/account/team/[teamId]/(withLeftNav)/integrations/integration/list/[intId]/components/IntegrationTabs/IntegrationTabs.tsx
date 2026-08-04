"use client";

import Tabs from "@/components/Tabs";
import EditIntegrationForm from "../EditIntegrationForm";
import IntegrationHistoryTable from "../IntegrationHistoryTable";

const integrationTabs = [
    {
        label: "Configuration",
        value: "configuration",
        content: <EditIntegrationForm />,
    },
    {
        label: "History",
        value: "history",
        content: <IntegrationHistoryTable />,
    },
];

const IntegrationTabs = () => {
    return (
        <Tabs
            tabs={integrationTabs}
            tabBoxSx={{ padding: 0 }}
            rootBoxSx={{ padding: 0 }}
        />
    );
};

export default IntegrationTabs;
