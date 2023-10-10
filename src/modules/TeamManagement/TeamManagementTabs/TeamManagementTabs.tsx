import Tabs from "@/components/Tabs";
import Typography from "@/components/Typography";
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
    return (
        <Tabs
            centered
            tabs={tabsList}
            tabBoxSx={{ padding: 0 }}
            rootBoxSx={{ padding: 0 }}
        />
    );
};

export default TeamManagementTabs;
