"use client";

import Head from "@/components/Head";
import messages from "@/config/messages/en.json";
import { GetServerSideProps } from "next";

import BackButton from "@/components/BackButton";
import AccountLayout from "@/modules/AccountLayout";
import ApplicationPermissions from "@/modules/ApplicationPermissions";
import useGet from "@/hooks/useGet";
import { Application } from "@/interfaces/Application";
import apis from "@/config/apis";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useParams } from "next/navigation";

const AddPermissionsPage = () => {
    const { apiId } = useParams();

    const { data: application } = useGet<Application>(
        apiId ? `${apis.applicationsV1Url}/${apiId}` : null
    );

    return (
        <ProtectedRoute
            permissions={["fe.account.nav.integrations.api-management"]}>
            <Head title="Health Data Research Innovation Gateway - My Account - API Management - Permissions" />
            <AccountLayout>
                <BackButton label="Back to API Creation" />
                <ApplicationPermissions application={application} />
            </AccountLayout>
        </ProtectedRoute>
    );
};

export const getServerSideProps: GetServerSideProps = async () => {
    return {
        props: {
            messages,
        },
    };
};

export default AddPermissionsPage;
