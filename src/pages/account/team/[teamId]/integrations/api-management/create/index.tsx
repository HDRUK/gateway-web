import Box from "@/components/Box";
import Head from "@/components/Head";
import { loadServerSideLocales } from "@/utils/locale";
import { GetServerSideProps } from "next";

import Paper from "@/components/Paper";
import BackButton from "@/components/BackButton";
import CreateApplicationForm from "@/modules/CreateApplicationForm";
import AccountLayout from "@/modules/AccountLayout";
import Typography from "@/components/Typography";
import ProtectedRoute from "@/components/ProtectedRoute";

const CreateAppPage = () => {
    return (
        <ProtectedRoute>
            <Head title="Health Data Research Innovation Gateway - My Account - Integrations - API management" />
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
                <CreateApplicationForm />
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

export default CreateAppPage;
