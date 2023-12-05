import Box from "@/components/Box";
import Head from "@/components/Head";
import messages from "@/config/messages/en.json";
import { GetServerSideProps } from "next";

import Paper from "@/components/Paper";
import BackButton from "@/components/BackButton";
import CreateApplicationForm from "@/modules/CreateApplicationForm";
import AccountLayout from "@/modules/AccountLayout";
import Typography from "@/components/Typography";
import ProtectedRoute from "@/components/ProtectedRoute";

const CreateAppPage = () => {
    return (
        <ProtectedRoute
            permissions={["fe.account.nav.integrations.api-management"]}>
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

export const getServerSideProps: GetServerSideProps = async () => {
    return {
        props: {
            messages,
        },
    };
};

export default CreateAppPage;
