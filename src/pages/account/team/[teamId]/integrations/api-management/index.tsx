import Head from "@/components/Head";
import { loadServerSideLocales } from "@/utils/locale";
import { GetServerSideProps } from "next";

import AccountLayout from "@/modules/AccountLayout";
import ApiManagement from "@/modules/ApiManagement";

import ProtectedRoute from "@/components/ProtectedRoute";

const TeamIntegrationsPage = () => {
    return (
        <ProtectedRoute>
            <Head title="Health Data Research Innovation Gateway - My Account - Integrations - API Management" />
            <AccountLayout>
                <ApiManagement />
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

export default TeamIntegrationsPage;
