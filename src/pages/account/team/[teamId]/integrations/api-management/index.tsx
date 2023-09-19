import Head from "@/components/Head";
import { loadServerSideLocales } from "@/utils/locale";
import { GetServerSideProps } from "next";

import AccountLayout from "@/components/AccountLayout";
import ApiManagement from "@/modules/ApiManagement";

const TeamIntegrationsPage = () => {
    return (
        <>
            <Head title="Health Data Research Innovation Gateway - My Account - Integrations - API Management" />
            <AccountLayout>
                <ApiManagement />
            </AccountLayout>
        </>
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
