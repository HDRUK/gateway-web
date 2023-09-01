import Box from "@/components/Box";
import Head from "@/components/Head";
import { loadServerSideLocales } from "@/utils/locale";
import { GetServerSideProps } from "next";
import { Typography } from "@mui/material";
import Paper from "@/components/Paper";
import AccountLayout from "@/components/AccountLayout";

const TeamHelpPage = () => {
    return (
        <>
            <Head title="Health Data Research Innovation Gateway - My Account - Help" />
            <AccountLayout>
                <Paper>
                    <Box>
                        <Typography variant="h2">Help</Typography>
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

export default TeamHelpPage;
