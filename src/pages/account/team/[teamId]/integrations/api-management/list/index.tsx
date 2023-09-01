import Head from "@/components/Head";
import { loadServerSideLocales } from "@/utils/locale";
import { GetServerSideProps } from "next";

import ActionBar from "@/components/ActionBar";
import ApplicationList from "@/modules/ApplicationList";
import BackButton from "@/components/BackButton";
import AccountLayout from "@/components/AccountLayout";

const ListAppPage = () => {
    return (
        <>
            <Head title="Health Data Research Innovation Gateway - My account - App Registration" />
            <AccountLayout>
                <BackButton label="Back to API Management" />
                <ApplicationList />
                <ActionBar />
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

export default ListAppPage;
