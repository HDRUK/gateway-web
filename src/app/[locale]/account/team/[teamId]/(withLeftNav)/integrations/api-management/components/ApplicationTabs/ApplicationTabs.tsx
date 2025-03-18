"use client";

import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { Application } from "@/interfaces/Application";
import Tabs from "@/components/Tabs";
import useGet from "@/hooks/useGet";
import useModal from "@/hooks/useModal";
import usePatch from "@/hooks/usePatch";
import apis from "@/config/apis";
import ApplicationAuthDetails from "../ApplicationAuthDetails";
import ApplicationPermissions from "../ApplicationPermissions";
import EditApplicationForm from "../EditApplicationForm";

const TRANSLATION_PATH = `pages.account.team.integrations.apiManagement`;

const ApplicationTabs = () => {
    const t = useTranslations(TRANSLATION_PATH);
    const params = useParams<{ apiId: string }>();
    const { showModal } = useModal();

    const { data: application, mutate: mutateApplication } =
        useGet<Application>(
            params?.apiId ? `${apis.applicationsV1Url}/${params?.apiId}` : null
        );

    const generateClientId = usePatch(
        `${apis.applicationsV1Url}/${application?.id}/clientid`,
        {
            itemName: "Application",
        }
    );

    const handleGenerateId = () => {
        showModal({
            title: t("generateIdTitle"),
            content: t("generateIdMessage"),
            confirmText: t("generateIdConfirm"),
            cancelText: t("generateIdCancel"),
            onSuccess: () => {
                generateClientId("", {}).then(() => mutateApplication());
            },
        });
    };

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
            content: (
                <ApplicationAuthDetails
                    application={application}
                    handleGenerateId={handleGenerateId}
                />
            ),
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
