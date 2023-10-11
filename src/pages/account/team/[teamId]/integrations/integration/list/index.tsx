import Head from "@/components/Head";
import { loadServerSideLocales } from "@/utils/locale";
import { GetServerSideProps } from "next";

import BackButton from "@/components/BackButton";
import AccountLayout from "@/modules/AccountLayout";

const TeamApplicationsPage = () => {
    return (
        <>
            <Head title="Health Data Research Innovation Gateway - My Account - Integrations - Integration" />
            <AccountLayout>
                <BackButton label="Back to Integration management" />
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

export default TeamApplicationsPage;
