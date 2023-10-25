import Head from "@/components/Head";
import { loadServerSideLocales } from "@/utils/locale";
import { GetServerSideProps } from "next";
import ApplicationTabs from "@/modules/ApplicationTabs";
import BackButton from "@/components/BackButton";
import AccountLayout from "@/modules/AccountLayout";
import ProtectedRoute from "@/components/ProtectedRoute";

const TeamApplicationPage = () => {
    return (
        <ProtectedRoute>
            <Head title="Health Data Research Innovation Gateway - My Account - Integrations - Application" />
            <AccountLayout>
                <BackButton label="Back to API selection" />
                <ApplicationTabs />
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

export default TeamApplicationPage;
