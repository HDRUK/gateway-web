import Box from "@/components/Box";
import Head from "@/components/Head";
import { loadServerSideLocales } from "@/utils/locale";
import { GetServerSideProps } from "next";
import Paper from "@/components/Paper";
import AccountLayout from "@/modules/AccountLayout";
import Typography from "@/components/Typography";
import ProtectedRoute from "@/components/ProtectedRoute";

const TeamDarWorkflowsPage = () => {
    return (
        <ProtectedRoute>
            <Head title="Health Data Research Innovation Gateway - My Account - Data Access Requests - Workflows" />
            <AccountLayout>
                <Paper>
                    <Box>
                        <Typography variant="h2">Workflows</Typography>
                        hi
                    </Box>
                </Paper>
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

export default TeamDarWorkflowsPage;
