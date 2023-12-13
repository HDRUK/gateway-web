"use client";

import Tabs from "@/components/Tabs";

import apis from "@/config/apis";
import useGet from "@/hooks/useGet";
import { Application } from "@/interfaces/Application";
import ApplicationAuthDetails from "../ApplicationAuthDetails";
import EditApplicationForm from "../EditApplicationForm";
import ApplicationPermissions from "..//ApplicationPermissions";
import { useParams } from "next/navigation";

const ApplicationTabs = () => {
    const { apiId } = useParams();

    const { data: application } = useGet<Application>(
        apiId ? `${apis.applicationsV1Url}/${apiId}` : null
    );

    const applicationTabs = [
        {
            label: "App Info",
            value: "app-info",
            content: (
                <EditApplicationForm isTabView application={application} />
            ),
        },
        {
            label: "Scopes/Permissions",
            value: "permissions",
            content: (
                <ApplicationPermissions isTabView application={application} />
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
            tabs={applicationTabs}
            tabBoxSx={{ padding: 0 }}
            rootBoxSx={{ padding: 0 }}
        />
    );
};

export default ApplicationTabs;
