import Tabs from "@/components/Tabs";
import Typography from "@/components/Typography";
import { useState } from "react";
import Notifications from "@/modules/TeamManagement/Notifications";
import TeamMembers from "@/modules/TeamMembers";

const tabsList = [
    {
        label: "Members",
        value: "Members",
        content: (
            <Typography component="span">
                <TeamMembers />
            </Typography>
        ),
    },
    {
        label: "Notifications",
        value: "Notifications",
        content: (
            <Typography component="span">
                <Notifications />
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
