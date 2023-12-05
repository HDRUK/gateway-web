import Head from "@/components/Head";
import messages from "@/config/messages/en.json";
import { GetServerSideProps } from "next";

import IntegrationList from "@/modules/IntegrationList";
import BackButton from "@/components/BackButton";
import AccountLayout from "@/modules/AccountLayout";

import ProtectedRoute from "@/components/ProtectedRoute";

const TeamApplicationsPage = () => {
    return (
        <ProtectedRoute
            permissions={["fe.account.nav.integrations.integration"]}>
            <Head title="Health Data Research Innovation Gateway - My Account - Integrations - Integration" />
            <AccountLayout>
                <BackButton label="Back to Integration management" />
                <IntegrationList />
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

export default TeamApplicationsPage;
