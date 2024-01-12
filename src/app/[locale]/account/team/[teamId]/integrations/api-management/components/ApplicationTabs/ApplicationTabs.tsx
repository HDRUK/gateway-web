"use client";

import { useParams } from "next/navigation";
import { Application } from "@/interfaces/Application";
import Tabs from "@/components/Tabs";
import useGet from "@/hooks/useGet";
import apis from "@/config/apis";
import ApplicationAuthDetails from "../ApplicationAuthDetails";
import ApplicationPermissions from "../ApplicationPermissions";
import EditApplicationForm from "../EditApplicationForm";

const ApplicationTabs = () => {
    const params = useParams<{ apiId: string }>();

    const { data: application } = useGet<Application>(
        params?.apiId ? `${apis.applicationsV1Url}/${params?.apiId}` : null
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
