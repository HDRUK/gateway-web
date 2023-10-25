import Head from "@/components/Head";
import { loadServerSideLocales } from "@/utils/locale";
import { GetServerSideProps } from "next";

import BackButton from "@/components/BackButton";
import AccountLayout from "@/modules/AccountLayout";
import ApplicationPermissions from "@/modules/ApplicationPermissions";
import useGet from "@/hooks/useGet";
import { Application } from "@/interfaces/Application";
import { useRouter } from "next/router";
import apis from "@/config/apis";
import ProtectedRoute from "@/components/ProtectedRoute";

const AddPermissionsPage = () => {
    const router = useRouter();
    const { apiId } = router.query;
    const { data: application } = useGet<Application>(
        apiId ? `${apis.applicationsV1Url}/${apiId}` : null
    );

    return (
        <ProtectedRoute>
            <Head title="Health Data Research Innovation Gateway - My Account - API Management - Permissions" />
            <AccountLayout>
                <BackButton label="Back to API Creation" />
                <ApplicationPermissions application={application} />
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

export default AddPermissionsPage;
