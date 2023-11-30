"use client";

import Head from "@/components/Head";
import { loadServerSideLocales } from "@/utils/locale";
import { GetServerSideProps } from "next";

import BackButton from "@/components/BackButton";
import AccountLayout from "@/modules/AccountLayout";
import EditApplicationForm from "@/modules/EditApplicationForm";
import useGet from "@/hooks/useGet";
import { Application } from "@/interfaces/Application";
import apis from "@/config/apis";
import { useSearchParams } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";

const EditAppPage = () => {
    const searchParams = useSearchParams();
    const apiId = searchParams.get("apiId") as string;
    const { data: application } = useGet<Application>(
        apiId ? `${apis.applicationsV1Url}/${apiId}` : null
    );

    return (
        <ProtectedRoute
            permissions={["fe.account.nav.integrations.api-management"]}>
            <Head title="Health Data Research Innovation Gateway - My Account - Integrations - Create" />
            <AccountLayout>
                <BackButton label="Back to API Management" />
                <EditApplicationForm
                    application={application}
                    isTabView={false}
                />
            </AccountLayout>
        </ProtectedRoute>
    );
};

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
    return {
        props: {
            ...(await loadServerSideLocales(locale)),
        },
    };
};

export default EditAppPage;
