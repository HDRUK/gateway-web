import Head from "@/components/Head";
import { loadServerSideLocales } from "@/utils/locale";
import { GetServerSideProps } from "next";

import AppLanding from "@/modules/AppManagement/AppLanding";
import AccountLayout from "@/components/AccountLayout";

const TeamIntegrationsPage = () => {
    return (
        <>
            <Head title="Health Data Research Innovation Gateway - My Account - Integrations - API Management" />
            <AccountLayout>
                <AppLanding />
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
