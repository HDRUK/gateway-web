import Box from "@/components/Box";
import Head from "@/components/Head";
import { loadServerSideLocales } from "@/utils/locale";
import { GetServerSideProps } from "next";

import ActionBar from "@/components/ActionBar";
import Paper from "@/components/Paper";
import BackButton from "@/components/BackButton";
import CreateApplicationForm from "@/modules/CreateApplicationForm";
import AccountLayout from "@/modules/AccountLayout";
import Typography from "@/components/Typography";

const CreateAppPage = () => {
    return (
        <>
            <Head title="Health Data Research Innovation Gateway - My Account - Integrations - Create" />
            <AccountLayout>
                <BackButton label="Back to API Management" />
                <Paper sx={{ marginBottom: 1 }}>
                    <Box>
                        <Typography variant="h2">Create an API</Typography>
                        <Typography sx={{ marginBottom: 2 }}>
                            Use this form to create your Gateway API 
                        </Typography>
                    </Box>
                </Paper>
                <CreateApplicationForm />
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
