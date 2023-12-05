import Head from "@/components/Head";
import messages from "@/config/messages/en.json";
import { GetServerSideProps } from "next";

import AccountLayout from "@/modules/AccountLayout";
import ApiManagement from "@/modules/ApiManagement";

import ProtectedRoute from "@/components/ProtectedRoute";

const TeamIntegrationsPage = () => {
    return (
        <ProtectedRoute
            permissions={["fe.account.nav.integrations.api-management"]}>
            <Head title="Health Data Research Innovation Gateway - My Account - Integrations - API Management" />
            <AccountLayout>
                <ApiManagement />
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

export default TeamIntegrationsPage;
