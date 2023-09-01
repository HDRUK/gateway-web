import Head from "@/components/Head";
import { loadServerSideLocales } from "@/utils/locale";
import { GetServerSideProps } from "next";

import AppLanding from "@/modules/AppManagement/AppLanding";
import AccountLayout from "@/components/AccountLayout";

const AppLandingPage = () => {
    return (
        <>
            <Head title="Health Data Research Innovation Gateway - My account - App Registration" />
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

export default AppLandingPage;
