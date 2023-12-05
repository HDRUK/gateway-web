import Box from "@/components/Box";
import Head from "@/components/Head";
import messages from "@/config/messages/en.json";
import { GetServerSideProps } from "next";
import Paper from "@/components/Paper";
import AccountLayout from "@/modules/AccountLayout";
import Typography from "@/components/Typography";
import ProtectedRoute from "@/components/ProtectedRoute";

const TeamDarApplicationsPage = () => {
    return (
        <ProtectedRoute permissions={["fe.account.nav.dar.applications"]}>
            <Head title="Health Data Research Innovation Gateway - My Account - Data Access Requests - Applications" />
            <AccountLayout>
                <Paper>
                    <Box>
                        <Typography variant="h2">Applications</Typography>
                    </Box>
                </Paper>
            </AccountLayout>
        </ProtectedRoute>
    );
};

export const getServerSideProps: GetServerSideProps = async () => {
    return {
        props: {
            messages,
        },
    };
};

export default TeamDarApplicationsPage;
