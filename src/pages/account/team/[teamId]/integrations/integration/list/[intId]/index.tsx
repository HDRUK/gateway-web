import Box from "@/components/Box";
import Head from "@/components/Head";
import { loadServerSideLocales } from "@/utils/locale";
import { GetServerSideProps } from "next";

import Paper from "@/components/Paper";
import BackButton from "@/components/BackButton";
import AccountLayout from "@/modules/AccountLayout";
import Typography from "@/components/Typography";
import EditIntegrationForm from "@/modules/EditIntegrationForm";

import ProtectedRoute from "@/components/ProtectedRoute";

const CreateAppPage = () => {
    return (
        <ProtectedRoute
            permissions={["fe.account.nav.integrations.integration"]}>
            <Head title="Health Data Research Innovation Gateway - My Account - Integrations - Integration" />
            <AccountLayout>
                <BackButton label="Back to Integration Management" />
                <Paper sx={{ marginBottom: 1 }}>
                    <Box>
                        <Typography variant="h2">Integration</Typography>
                        <Typography>
                            Input and edit the authentication information for
                            the Gateway system to use for the integration
                        </Typography>
                    </Box>
                </Paper>
                <EditIntegrationForm />
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
