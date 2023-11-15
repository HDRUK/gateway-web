import ProtectedRoute from "@/components/ProtectedRoute";
import Box from "@/components/Box";
import BoxContainer from "@/components/BoxContainer";
import Head from "@/components/Head";
import { loadServerSideLocales } from "@/utils/locale";
import { GetServerSideProps } from "next";
import Typography from "@/components/Typography";
import AccountLayout from "@/modules/AccountLayout";
import Paper from "@/components/Paper";

const TeamDatasetPage = () => {
    return (
        <ProtectedRoute permissions={["fe.account.nav.datasets"]}>
            <Head title="Health Data Research Innovation Gateway - My Account - Dataset" />
            <AccountLayout>
                <BoxContainer sx={{ gap: 0 }}>
                    <Paper>
                        <Box sx={{ bgcolor: "white", mb: 0 }}>
                            <Typography variant="h2">Dataset</Typography>
                        </Box>
                    </Paper>
                </BoxContainer>
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

export default TeamDatasetPage;
