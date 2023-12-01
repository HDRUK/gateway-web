"use client";

import Tabs from "@/components/Tabs";

import apis from "@/config/apis";
import useGet from "@/hooks/useGet";
import { Application } from "@/interfaces/Application";
import ApplicationAuthDetails from "@/modules/ApplicationAuthDetails";
import EditApplicationForm from "@/modules/EditApplicationForm";
import ApplicationPermissions from "@/modules/ApplicationPermissions";
import { useRouter } from "next/router";

const ApplicationTabs = () => {
    const { query } = useRouter();
    const { apiId } = query;

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
