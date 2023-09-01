import Box from "@/components/Box";
import Head from "@/components/Head";
import { loadServerSideLocales } from "@/utils/locale";
import { GetServerSideProps } from "next";
import ApplicationTabs from "@/modules/ApplicationTabs";
import { Typography } from "@mui/material";
import Paper from "@/components/Paper";
import BackButton from "@/components/BackButton";
import AccountLayout from "@/components/AccountLayout";

const TeamApplicationPage = () => {
    return (
        <>
            <Head title="Health Data Research Innovation Gateway - My Account - Integrations - Application" />
            <AccountLayout>
                <BackButton label="Back to API selection" />
                <Paper>
                    <Box>
                        <Typography variant="h2">API Management</Typography>
                        <Typography>
                            Use this page to register your application with us.
                        </Typography>
                    </Box>
                    <ApplicationTabs />
                </Paper>
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

export default TeamApplicationPage;
