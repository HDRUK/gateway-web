import Box from "@/components/Box";
import Head from "@/components/Head";
import { loadServerSideLocales } from "@/utils/locale";
import { GetServerSideProps } from "next";
import Paper from "@/components/Paper";
import BackButton from "@/components/BackButton";
import AccountLayout from "@/modules/AccountLayout";
import Typography from "@/components/Typography";

const TeamApplicationPage = () => {
    return (
        <>
            <Head title="Health Data Research Innovation Gateway - My Account - Integrations - Integration" />
            <AccountLayout>
                <BackButton label="Back to Integration selection" />
                <Paper>
                    <Box>
                        <Typography variant="h2">
                            Integration Management
                        </Typography>
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

export default TeamApplicationPage;
