import Box from "@/components/Box";
import Head from "@/components/Head";
import { loadServerSideLocales } from "@/utils/locale";
import { GetServerSideProps } from "next";
import useAuth from "@/hooks/useAuth";
import { CircularProgress } from "@mui/material";
import Typography from "@/components/Typography";
import Paper from "@/components/Paper";
import AccountLayout from "@/modules/AccountLayout";
import CohortTable from "@/modules/CohortTable";
import ProtectedRoute from "@/components/ProtectedRoute";

const CohortDiscoveryAdmin = () => {
    const { isLoading } = useAuth();

    return (
        <ProtectedRoute permissions={["cohort.read"]}>
            <Head title="Health Data Research Innovation Gateway - My Account - Cohort Discovery Admin" />
            <AccountLayout>
                <Paper>
                    <Box>
                        <Typography variant="h2">
                            Cohort Discovery Admin
                        </Typography>
                        <Typography sx={{ marginBottom: 4 }}>
                            Find and manage status of all Cohort Discovery
                            users, Click individual account users name to access
                            decision page to review and edit status
                        </Typography>
                        {isLoading ? (
                            <CircularProgress color="secondary" />
                        ) : (
                            <CohortTable />
                        )}
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

export default CohortDiscoveryAdmin;
