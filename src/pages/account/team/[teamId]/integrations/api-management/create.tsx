import Box from "@/components/Box";
import Head from "@/components/Head";
import { loadServerSideLocales } from "@/utils/locale";
import { GetServerSideProps } from "next";

import ActionBar from "@/components/ActionBar";
import { Typography } from "@mui/material";
import Paper from "@/components/Paper";
import BackButton from "@/components/BackButton";
import CreateApplicationForm from "@/modules/application/CreateApplicationForm";
import AccountLayout from "@/modules/AccountLayout";

const CreateAppPage = () => {
    return (
        <>
            <Head title="Health Data Research Innovation Gateway - My Account - Integrations - Create" />
            <AccountLayout>
                <BackButton label="Back to API Management" />
                <Paper>
                    <Box>
                        <Typography variant="h2">Create API</Typography>
                        <CreateApplicationForm />
                    </Box>
                </Paper>
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
