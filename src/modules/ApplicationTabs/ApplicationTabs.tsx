import Tabs from "@/components/Tabs";
import { useMemo, useState } from "react";
import { Typography } from "@mui/material";
import { useTheme } from "@emotion/react";

import Box from "@/components/Box";
import ApplicationForm from "../application/ApplicationForm";

const ApplicationTabs = () => {
    const theme = useTheme();

    const [selectedTab, setSelectedTab] = useState("App Info");

    const handleTabChange = (tab: string) => {
        setSelectedTab(tab);
    }

    const applicationTabs = [
        {
            label: "App Info",
            value: "App Info",
            content: <ApplicationForm />
        },
        {
            label: "Auth",
            value: "Auth",
            content: <><p>Placeholder for Auth Tab</p></>
        },
        {
            label: "Scopes/Permissions",
            value: "Scopes/Permissions",
            content: <><p>Placeholder for Scopes/Permissions Tab</p></>
        }
    ];

    return (
        <Tabs
            centered
            value={selectedTab}
            onChange={handleTabChange}
            tabs={applicationTabs}
            tabBoxSx={{ padding: 0 }}
            rootBoxSx={{ padding: 0 }}
        />
    )
};

export default ApplicationTabs;