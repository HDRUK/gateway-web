import Tabs from "@/components/Tabs";
import { Typography } from "@mui/material";
import { useState } from "react";

const tabsList = [
    {
        label: "Members",
        value: "Members",
        content: (
            <Typography component="span">
                Placeholder for Members Tab
            </Typography>
        ),
    },
    {
        label: "Notifications",
        value: "Notifications",
        content: (
            <Typography component="span">
                Placeholder for Notifications Tab
            </Typography>
        ),
    },
];

const TeamManagementTabs = () => {
    const [selectedTab, setSelectedTab] = useState("Members");

    const handleTabChange = (tab: string) => {
        setSelectedTab(tab);
    };

    return (
        <Tabs
            centered
            value={selectedTab}
            onChange={handleTabChange}
            tabs={tabsList}
            tabBoxSx={{ padding: 0 }}
            rootBoxSx={{ padding: 0 }}
        />
    );
};

export default TeamManagementTabs;
