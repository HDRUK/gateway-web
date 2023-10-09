import Box from "@/components/Box";
import Head from "@/components/Head";
import { loadServerSideLocales } from "@/utils/locale";
import { GetServerSideProps } from "next";

import ActionBar from "@/components/ActionBar";
import Paper from "@/components/Paper";
import BackButton from "@/components/BackButton";
import AccountLayout from "@/modules/AccountLayout";
import Typography from "@/components/Typography";
import EditApplicationForm from "@/modules/EditApplicationForm";
import useGet from "@/hooks/useGet";
import { Application } from "@/interfaces/Application";
import apis from "@/config/apis";
import { useRouter } from "next/router";

const CreateAppPage = () => {
    const { query } = useRouter();
    const { data: application } = useGet<Application>(
        `${apis.applicationsV1Url}/${query.apiId}`,
        { shouldFetch: !!query.apiId }
    );

    return (
        <>
            <Head title="Health Data Research Innovation Gateway - My Account - Integrations - Create" />
            <AccountLayout>
                <BackButton label="Back to API Management" />
                <EditApplicationForm
                    application={application}
                    isTabView={false}
                />
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

export default CreateAppPage;
