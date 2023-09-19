import Box from "@/components/Box";
import Head from "@/components/Head";
import { loadServerSideLocales } from "@/utils/locale";
import { GetServerSideProps } from "next";

import ActionBar from "@/components/ActionBar";
import { Typography } from "@mui/material";
import Paper from "@/components/Paper";
import BackButton from "@/components/BackButton";
import AccountLayout from "@/modules/AccountLayout";

const CreateAppPage = () => {
    return (
        <>
            <Head title="Health Data Research Innovation Gateway - My Account - Integrations - Integration" />
            <AccountLayout>
                <BackButton label="Back to Integration management" />
                <Paper>
                    <Box>
                        <Typography variant="h2">Create Integration</Typography>
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
