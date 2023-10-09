import Tabs from "@/components/Tabs";
import { useState } from "react";
import Typography from "@/components/Typography";

import { useRouter } from "next/router";
import apis from "@/config/apis";
import useGet from "@/hooks/useGet";
import { Application } from "@/interfaces/Application";
import ApplicationAuthDetails from "@/modules/ApplicationAuthDetails";
import EditApplicationForm from "@/modules/EditApplicationForm";

const ApplicationTabs = () => {
    const router = useRouter();
    const { appId } = router.query;
    const { data: application } = useGet<Application>(
        `${apis.applicationsV1Url}/${appId}`
    );

    const [selectedTab, setSelectedTab] = useState("App Info");

    const handleTabChange = (tab: string) => {
        setSelectedTab(tab);
    };

    const applicationTabs = [
        {
            label: "App Info",
            value: "App Info",
            content: <EditApplicationForm application={application} />,
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
        {
            label: "Authentication",
            value: "Authentication",
            content: <ApplicationAuthDetails application={application} />,
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
