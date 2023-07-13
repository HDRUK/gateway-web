import Tabs from "@/components/Tabs";
import { useState } from "react";
import { Typography } from "@mui/material";

import ApplicationForm from "../application/ApplicationForm";

const ApplicationTabs = () => {
    // const theme = useTheme();

    const [selectedTab, setSelectedTab] = useState("App Info");

    const handleTabChange = (tab: string) => {
        setSelectedTab(tab);
    }

    const applicationTabs = [
        {
            label: "App Info",
            value: "App Info",
            content: <ApplicationForm />,
        },
        {
            label: "Auth",
            value: "Auth",
            content: (
                <Typography component="span">
                    Placeholder for Auth Tab
                </Typography>
            ),
        },
        {
            label: "Scopes/Permissions",
            value: "Scopes/Permissions",
            content: (
                <Typography component="span">
                    Placeholder for Scopes/Permissions Tab
                </Typography>
            ),
        },
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
    );
};

export default ApplicationTabs;
