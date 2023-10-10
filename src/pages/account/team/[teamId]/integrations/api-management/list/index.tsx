import Head from "@/components/Head";
import { loadServerSideLocales } from "@/utils/locale";
import { GetServerSideProps } from "next";

import ApplicationList from "@/modules/ApplicationList";
import BackButton from "@/components/BackButton";
import AccountLayout from "@/modules/AccountLayout";

const TeamApplicationsPage = () => {
    return (
        <>
            <Head title="Health Data Research Innovation Gateway - My Account - Integrations - Applications List" />
            <AccountLayout>
                <BackButton label="Back to API Management" />
                <ApplicationList />
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
