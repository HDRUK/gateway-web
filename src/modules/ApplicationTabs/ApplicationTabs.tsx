import Tabs from "@/components/Tabs";
import { useState } from "react";
import { Typography } from "@mui/material";

import { useRouter } from "next/router";
import apis from "@/config/apis";
import useGet from "@/hooks/useGet";
import { Application } from "@/interfaces/Application";

import AuthDetails from "../application/AuthDetails";
import EditApplicationForm from "../application/EditApplicationForm";

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
            label: "Auth",
            value: "Auth",
            content: (
                <Typography component="span">
                    <AuthDetails application={application} />
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
