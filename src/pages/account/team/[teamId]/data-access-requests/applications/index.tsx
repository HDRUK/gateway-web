import Box from "@/components/Box";
import Head from "@/components/Head";
import { loadServerSideLocales } from "@/utils/locale";
import { GetServerSideProps } from "next";
import { Typography } from "@mui/material";
import Paper from "@/components/Paper";
import AccountLayout from "@/components/AccountLayout";

const TeamDarApplicationsPage = () => {
    return (
        <>
            <Head title="Health Data Research Innovation Gateway - My Account - Data Access Requests - Applications" />
            <AccountLayout>
                <Paper>
                    <Box>
                        <Typography variant="h2">Applications</Typography>
                    </Box>
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

export default TeamDarApplicationsPage;
