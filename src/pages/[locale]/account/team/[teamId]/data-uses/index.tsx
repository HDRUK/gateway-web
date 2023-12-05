import Box from "@/components/Box";
import Head from "@/components/Head";
import messages from "@/config/messages/en.json";
import { GetServerSideProps } from "next";
import Paper from "@/components/Paper";
import AccountLayout from "@/modules/AccountLayout";
import Typography from "@/components/Typography";
import ProtectedRoute from "@/components/ProtectedRoute";

const TeamDataUsesPage = () => {
    return (
        <ProtectedRoute permissions={["fe.account.nav.dur"]}>
            <Head title="Health Data Research Innovation Gateway - My Account - Data Uses" />
            <AccountLayout>
                <Paper>
                    <Box>
                        <Typography variant="h2">Data Uses</Typography>
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

export default TeamDataUsesPage;
