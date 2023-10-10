import Box from "@/components/Box";
import Head from "@/components/Head";
import { loadServerSideLocales } from "@/utils/locale";
import { GetServerSideProps } from "next";

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
    const { apiId } = query;
    const { data: application } = useGet<Application>(
        apiId ? `${apis.applicationsV1Url}/${apiId}` : null
    );

    return (
        <>
            <Head title="Health Data Research Innovation Gateway - My Account - Integrations - Create" />
            <AccountLayout>
                <BackButton label="Back to API Management" />
                <Paper sx={{ marginBottom: 1 }}>
                    <Box>
                        <Typography variant="h2">API management</Typography>
                        <Typography sx={{ marginBottom: 2 }}>
                            Use this form to create, update and manage your api
                            on the Gateway
                        </Typography>
                    </Box>
                </Paper>
                <EditApplicationForm
                    application={application}
                    isTabView={false}
                />
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
