import Head from "@/components/Head";
import { loadServerSideLocales } from "@/utils/locale";
import { GetServerSideProps } from "next";

import ActionBar from "@/components/ActionBar";
import BackButton from "@/components/BackButton";
import AccountLayout from "@/modules/AccountLayout";
import ApplicationPermissions from "@/modules/ApplicationPermissions";

const AddPermissionsPage = () => {
    return (
        <>
            <Head title="Health Data Research Innovation Gateway - My Account - API Management - Permissions" />
            <AccountLayout>
                <BackButton label="Back to API Creation" />
                <ApplicationPermissions />
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

export default AddPermissionsPage;
